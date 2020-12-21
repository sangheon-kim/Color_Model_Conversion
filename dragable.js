// 색상환 캔버스 그려주기
draw("circle");

// 원형판
const $circleBoard = document.querySelector(".color-circle");
// 포인터 Element
const $point = document.querySelector(".point");
// 색조
const $hueInput = document.querySelector("#hue-input");
const $hueRange = document.querySelector("#hue-range");
// 채도
const $saturationInput = document.querySelector("#saturation-input");
const $saturationRange = document.querySelector("#saturation-range");
// 밝기
const $lightnessRange = document.querySelector("#lightness-range");
const $lightnessInput = document.querySelector("#lightness-input");
// 결과판
const $resultBoard = document.querySelector(".result-board");
const $redInput = document.querySelector("#red-input");
const $blueInput = document.querySelector("#blue-input");
const $greenInput = document.querySelector("#green-input");
const $hexInput = document.querySelector("#hex-input");

// 드래그 여부 체크
let selectedElement = false;

// 정사각형이기때문에 중심좌표는 반지름이다.
const centerPoint = Math.floor($circleBoard.clientWidth / 2);
// 초기값으로 세팅해놓은 값으로 결과판의 색상 지정
changeResultBoard();

/**
 *
 * @description 색조 변화 이벤트 핸들러 전달 콜백
 * @param {*} hue
 */
function hueChange(hue) {
  // 현재 중심점 기준 점과의 거리 환산
  const radius = centerPoint * ($saturationInput.value / 100);

  const dx = centerPoint + radius * Math.cos(degree2radian(hue));
  const dy = centerPoint + radius * Math.sin(degree2radian(hue));

  $point.style.left = `${dx - 15}px`;
  $point.style.top = `${dy - 15}px`;
  changeResultBoard();
}

/**
 *
 * @description 채도 변화 이벤트 핸들러 전달 콜백
 * @param {*} saturation
 */
function saturationChange(saturation) {
  const distance = (centerPoint * saturation) / 100;

  const dx = centerPoint + distance * Math.cos(degree2radian($hueRange.value));
  const dy = centerPoint + distance * Math.sin(degree2radian($hueRange.value));

  $point.style.left = `${dx - 15}px`;
  $point.style.top = `${dy - 15}px`;
  changeResultBoard();
}

function registerEventListener(element, eventType, cb, type) {
  return element.addEventListener(eventType, function (e) {
    cb(e, type);
  });
}

/**
 *
 * @description 밝기 변화 이벤트 핸들러 전달 콜백
 * @param {*} lightness
 */
function lightnessChange(lightness) {
  const $brightnessBoard = document.querySelector(".brightness-board");
  let count = Math.abs(lightness - 50);

  if (lightness > 50) {
    $brightnessBoard.style.background = `rgba(255,255,255,${0.5 + count * 0.01})`;
  } else if (lightness < 50) {
    $brightnessBoard.style.background = `rgba(0,0,0,${0.5 + count * 0.01})`;
  } else {
    $brightnessBoard.style.background = `transparent`;
  }

  changeResultBoard();
}

/**
 * @description 결과펀애 색상 반영
 * @author Sangheon Kim
 * @returns
 */
function changeResultBoard() {
  const [R, G, B] = hslToRgb(
    $hueRange.value,
    $saturationRange.value / 100,
    $lightnessRange.value / 100
  );

  $redInput.value = R;
  $greenInput.value = G;
  $blueInput.value = B;
  rgbToHsl(R, G, B);
  $hexInput.value = rgbToHex(R, G, B);
  $point.style.backgroundColor = `hsl(${$hueRange.value}, ${$saturationRange.value}%, ${$lightnessRange.value}%)`;
  return ($resultBoard.style.backgroundColor = `hsl(${$hueRange.value}, ${$saturationRange.value}%, ${$lightnessRange.value}%)`);
}

/**
 *
 * @description input 이벤트 처리
 * @param {*} e
 * @param {*} type
 */
function inputEvent(e, type) {
  const value = Number(e.target.value);

  if (value > hslObj[type].maxNum) {
    hslObj[type].input.value = hslObj[type].maxNum;
    hslObj[type].range.value = hslObj[type].maxNum;
    hslObj[type]["cb"](hslObj[type].maxNum);
  } else {
    hslObj[type].input.value = value;
    hslObj[type].range.value = value;
    hslObj[type]["cb"](value);
  }
}
/**
 *
 * @description rangeInput 이벤트 처리
 * @param {*} e
 * @param {*} type
 */
function rangeEvent(e, type) {
  const value = e.target.value;

  hslObj[type].input.value = value;
  hslObj[type].range.value = value;
  hslObj[type]["cb"](value);
}

const hslObj = {
  hue: {
    maxNum: 360,
    minNum: 0,
    cb: hueChange,
    input: $hueInput,
    range: $hueRange,
  },
  lightness: {
    maxNum: 100,
    minNum: 0,
    cb: lightnessChange,
    input: $lightnessInput,
    range: $lightnessRange,
  },
  saturation: {
    maxNum: 100,
    minNum: 0,
    cb: saturationChange,
    input: $saturationInput,
    range: $saturationRange,
  },
};

function startDrag(e) {
  let { offsetX, offsetY, touches } = e;

  if (!!e.touches) {
    const { left, top } = $circleBoard.getBoundingClientRect();
    const { clientX, clientY } = touches[0];

    offsetX = clientX - left;
    offsetY = clientY - top;
  }
  if (e.target.id !== "point") {
    // 클릭한 위치에 따라 위치 환산
    $point.style.left = `${offsetX - 15}px`;
    $point.style.top = `${offsetY - 15}px`;
    // $point.style.transform = "initial";

    // 거리는 원의 방정식을 이용해서 구해준다.
    let distance = circleEquation(centerPoint, [offsetX, offsetY]);
    // 포인터의 거리에 대한 반지름 비율 계산
    const pointerDistance = Math.floor((distance / centerPoint) * 100);

    $saturationInput.value = pointerDistance;
    $saturationRange.value = pointerDistance;

    const degree = calculateAngleByDistance(centerPoint, [offsetX, offsetY]);

    $hueInput.value = degree;
    $hueRange.value = degree;

    changeResultBoard();
  }

  selectedElement = true;
}

function drag(e) {
  if (!!selectedElement) {
    let { offsetX, offsetY, touches } = e;

    if (!!e.touches) {
      const { left, top } = $circleBoard.getBoundingClientRect();
      const { clientX, clientY } = touches[0];

      offsetX = clientX - left;
      offsetY = clientY - top;
    }
    if (e.target.id !== "point") {
      if (
        offsetY < $circleBoard.clientHeight &&
        offsetY > 8 &&
        offsetX < $circleBoard.clientWidth &&
        offsetX > 8
      ) {
        // 클릭한 위치에 따라 위치 환산
        $point.style.left = `${offsetX - 15}px`;
        $point.style.top = `${offsetY - 15}px`;

        // 거리는 원의 방정식을 이용해서 구해준다.
        let distance = circleEquation(centerPoint, [offsetX, offsetY]);
        // 포인터의 거리에 대한 반지름 비율 계산
        const pointerDistance = Math.floor((distance / centerPoint) * 100);

        $saturationInput.value = pointerDistance;
        $saturationRange.value = pointerDistance;

        const degree = calculateAngleByDistance(centerPoint, [offsetX, offsetY]);

        $hueInput.value = degree;
        $hueRange.value = degree;

        changeResultBoard();
      }
    }
  }
}
function endDrag(e) {
  selectedElement = false;
}

if (
  navigator.userAgent.match(
    /Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/
  )
) {
  $circleBoard.addEventListener("touchstart", startDrag);
  $circleBoard.addEventListener("touchmove", drag);
  $circleBoard.addEventListener("touchend", endDrag);
  $circleBoard.addEventListener("touchend", endDrag);
} else {
  $circleBoard.addEventListener("mousedown", startDrag);
  $circleBoard.addEventListener("mousemove", drag);
  $circleBoard.addEventListener("mouseup", endDrag);
  $circleBoard.addEventListener("mouseleave", endDrag);
}

registerEventListener($hueInput, "input", inputEvent, "hue");
registerEventListener($hueRange, "input", rangeEvent, "hue");
registerEventListener($lightnessInput, "input", inputEvent, "lightness");
registerEventListener($lightnessRange, "input", rangeEvent, "lightness");
registerEventListener($saturationInput, "input", inputEvent, "saturation");
registerEventListener($saturationRange, "input", rangeEvent, "saturation");

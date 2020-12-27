/**
 * @PureFunction
 * @description 360도 기준의 라디안 변형 공식
 * @param {*} degree (각독값 넣기)
 * @author Sangheon Kim
 * @returns
 */
function degree2radian(degree) {
  degree -= 90;
  return (Math.PI / 180) * degree;
}

/**
 * @PureFunction
 * @description radian값을 각도로 바꿔주는 함수
 * @param {*} radian (라디안값 넣기)
 * @author Sangheon Kim
 * @returns
 */
function radian2degree(radian) {
  return Math.abs((180 / Math.PI) * radian);
}

/**
 * @PureFunction
 * @description 원의 방정식 구하기 (중심점 기준으로 좌표값의 위치 파악)
 * @author Sangheon Kim
 * @param {*} centerPoint 중심점
 * @param {*} offsetArray x,y 좌표 배열
 * @returns
 */
function circleEquation(centerPoint, offsetArray) {
  // 배열 비구조화 할당으로 꺼내기
  const [offsetX, offsetY] = offsetArray;
  // Math.pow로 x좌표와 중심좌표 뺀것 제곱하고 소수점 버리기
  const xDistance = Math.floor(Math.pow(offsetX - centerPoint, 2));
  // Math.pow로 y좌표와 중심좌표 뺀것 제곱하고 소수점 버리기
  const yDistance = Math.floor(Math.pow(offsetY - centerPoint, 2));
  // 결과값 제곱근 사용하여 결과값 도출하여 중심좌표에서 거리 계산하기
  let result = Math.floor(Math.sqrt(xDistance + yDistance));

  return result > centerPoint ? centerPoint : result;
}

/**
 * @PureFunction
 * @description HSL to RGB Conversion
 * @author Sangheon Kim
 * @param {*} H 0 ~ 360
 * @param {*} S 0 ~ 1
 * @param {*} L 0 ~ 1
 * @returns Array<number>
 */
function hslToRgb(H, S, L) {
  const C = (1 - Math.abs(2 * L - 1)) * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = L - C / 2;

  let R1, G1, B1;

  if (H >= 0 && H <= 60) {
    R1 = C;
    G1 = X;
    B1 = 0;
  } else if (H >= 60 && H < 120) {
    R1 = X;
    G1 = C;
    B1 = 0;
  } else if (H >= 120 && H < 180) {
    R1 = 0;
    G1 = C;
    B1 = X;
  } else if (H >= 180 && H < 240) {
    R1 = 0;
    G1 = X;
    B1 = C;
  } else if (H >= 240 && H < 300) {
    R1 = X;
    G1 = 0;
    B1 = C;
  } else {
    R1 = C;
    G1 = 0;
    B1 = X;
  }

  const [R, G, B] = [
    Math.floor((R1 + m) * 255),
    Math.floor((G1 + m) * 255),
    Math.floor((B1 + m) * 255),
  ];

  return [R, G, B];
}

/**
 * @PureFunction
 * @description RGB to HSL
 * @param {*} R R Integer
 * @param {*} G G Integer
 * @param {*} B B Integer
 * @author Sangheon Kim
 * @returns Array<number>
 */
function rgbToHsl(R, G, B) {
  let H, S, L;
  // R`, G`, B` R` = R / 255, G` = G / 255, B` = B / 255
  const args = [R, G, B].map((color) => color / 255);
  const [R1, G1, B1] = args;
  const CMax = Math.max(...args);
  const CMin = Math.min(...args);
  const triangle = CMax - CMin;
  const maxIndex = args.lastIndexOf(CMax);

  L = (CMax + CMin) / 2;
  if (!!triangle) {
    switch (maxIndex) {
      case 0:
        H = ((G1 - B1) / triangle) % 6;
        break;
      case 1:
        H = (B1 - R1) / triangle + 2;
        break;
      case 2:
        H = (R1 - G1) / triangle + 4;
        break;
      default:
        break;
    }
    H *= 60;
    S = triangle / (1 - Math.abs(2 * L - 1));
  } else {
    H = 0;
    S = 0;
  }
  H = Math.floor(H);
  if (H < 0) H += 360;

  return [H, S, L];
}

/**
 * @PureFunction
 * @description RGB to Hex
 * @author Sangheeon Kim
 * @param {*} R
 * @param {*} G
 * @param {*} B
 * @returns String
 */
function rgbToHex(R, G, B) {
  let Hex = R * 65536 + G * 256 + B;
  Hex = Hex.toString(16, 6);
  let len = Hex.length;
  if (len < 6) for (let i = 0; i < 6 - len; i++) Hex = "0" + Hex;

  return Hex.toUpperCase();
}

/**
 * @PureFunction
 * @description 거리값과 중심좌표와 현재 좌표값을 이용하여, 각도 계산 함수
 * @author Sangheon Kim
 * @param {*} centerPoint
 * @param {*} offsetArray
 * @returns
 */
function calculateAngleByDistance(centerPoint, offsetArray) {
  const [offsetX, offsetY] = offsetArray;
  // 중심점에서 현재 원에서의 x좌표값
  const x = centerPoint - offsetX;
  // 중심점에서 현재 원에서의 y좌표값
  const y = centerPoint - offsetY;
  // radian 값 구하기
  let radian = Math.atan2(x, y);
  // radian 값 활용해서 각도 구하기
  const degree =
    offsetX < centerPoint
      ? Math.floor(360 - radian2degree(radian))
      : Math.floor(radian2degree(radian));

  return degree;
}

/**
 * @description 색상환 원을 그려준다.
 * @param {*} selector (Element id)
 * @author Sangheon Kim
 */
function draw(elemId) {
  var canvas = document.getElementById(elemId);

  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    let centerPoint = canvas.clientWidth / 2;
    for (let x = 0; x < canvas.clientWidth; x++) {
      for (let y = 0; y < canvas.clientHeight; y++) {
        const saturation = (circleEquation(centerPoint, [x, y]) / centerPoint) * 100;
        const hue = calculateAngleByDistance(centerPoint, [x, y]);

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, 50%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

function dragChange(e) {
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

function hslApplyBoard(H, S, L) {
  S = Math.floor(S * 100);
  L = Math.floor(L * 100);
  $hueInput.value = H;
  $hueRange.value = H;

  $saturationInput.value = S;
  $saturationRange.value = S;

  $lightnessInput.value = L;
  $lightnessRange.value = L;

  hueChange(H);
  saturationChange(S);
  lightnessChange(L);
}

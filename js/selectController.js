function randomNumber(limit) {
  return Math.floor(Math.random() * limit) + 1;
}

function ReadOnlyInput({ name, initialValue, isReadOnly, type = "text", className = "" }) {
  const $input = document.createElement("input");
  $input.type = type;
  $input.readOnly = isReadOnly;
  $input.value = initialValue;
  $input.name = name;
  $input.className = className;

  return $input;
}

function ResultBoard(key) {
  const $resultBoard = document.createElement("div");
  $resultBoard.id = key;
  $resultBoard.className = "result-board";

  const $colorBoard = document.createElement("div");
  const R = randomNumber(255);
  const G = randomNumber(255);
  const B = randomNumber(255);
  const hex = rgbToHex(R, G, B);
  $colorBoard.style.backgroundColor = `rgb(${R}, ${G}, ${B})`;
  $colorBoard.onclick = selectChangeColor;
  $colorBoard.className = "color-board";

  const $resultTitle = document.createElement("div");
  $resultTitle.className = "result-title";
  const $rgb_value = new ReadOnlyInput({
    name: "rgb_value",
    isReadOnly: true,
    className: "rgb_value",
    initialValue: `rgb(${R}, ${G}, ${B})`,
  });

  const $hex_value = new ReadOnlyInput({
    name: "rgb_value",
    isReadOnly: true,
    className: "hex-input",
    initialValue: `#${hex}`,
  });

  $resultTitle.append($rgb_value);
  $resultTitle.append($hex_value);

  $resultBoard.append($colorBoard);
  $resultBoard.append($resultTitle);

  return $resultBoard;
}

function SelectController() {
  return {
    element: new ResultBoard(++SelectController.index),
  };
}

SelectController.index = 0;

// class SelectController {
//   static index = 0;
//   constructor() {
//     this.element = new ResultBoard(++SelectController.index);
//   }
// }

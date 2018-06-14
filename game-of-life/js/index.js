"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var board;
var preset;
var speed = 300;
var myInterval;
var generation = 0;
var isRunning = false;
var height;
var width;

changeBoardSize();

$(document).ready(function () {
  start();

  // change board dimensions based on bootstrap width
  var prevHeight = height;
  $(window).resize(function () {
    stopSimulation();
    changeBoardSize();

    //to prevent rendering board until new dimentions are reached
    if (height !== prevHeight) {
      prevHeight = height;
      selectPreset();
    }
  });

  //add or remove cells on click
  $(document).on("click", ".cell", function () {
    var key = $(this).attr("id").split("-");
    //dead cells come to life
    if (board[key[0]][key[1]] == 'dead') {
      board[key[0]][key[1]] = 'new';
    }
    //alive cells become dead
    else {
        board[key[0]][key[1]] = 'dead';
        $(this).removeClass("new");
      }
    generateBoard();
  });

  //change highlighted speed button
  $(".spdBtn").click(function () {
    $(".spdBtn").removeClass("active");
    $(this).toggleClass("active");
  });

  //change highlighted size button
  $(".szBtn").click(function () {
    $(".szBtn").removeClass("active");
    $(this).toggleClass("active");
  });
});

function start() {
  generateRandomCells();
  generateBoard();
}

function changeBoardSize() {
  if ($(window).width() < 400) {
    height = 15;
    width = 20;
  } else if ($(window).width() < 576 && $(window).width() >= 400) {
    height = 20;
    width = 30;
  } else if ($(window).width() < 768 && $(window).width() >= 576) {
    height = 25;
    width = 35;
  } else if ($(window).width() < 992 && $(window).width() >= 768) {
    height = 30;
    width = 40;
  } else if ($(window).width() < 1200 && $(window).width() >= 992) {
    height = 35;
    width = 50;
  } else {
    height = 40;
    width = 60;
  }
}

function generateBoard() {
  //render the gameboard
  ReactDOM.render(React.createElement(Board, null), document.getElementById('gameBoard'));
}

//react component that renders the board display

var Board = function (_React$Component) {
  _inherits(Board, _React$Component);

  function Board() {
    _classCallCheck(this, Board);

    return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
  }

  _createClass(Board, [{
    key: "render",
    value: function render() {
      var style = {
        width: width * 10
      };
      var style2 = {
        width: width * 10 + 6,
        height: height * 10 + 6
      };

      //nested mapping for multidimentional array
      var rows = board.map(function (cols, i) {
        var cells = cols.map(function (status, j) {
          //uses an id instead of a key for jQuerry use
          return React.createElement("div", { id: i + "-" + j, className: "cell " + status });
        });

        return React.createElement(
          "div",
          { style: style, className: "rows" },
          cells
        );
      });

      return React.createElement(
        "div",
        { style: style2, className: "rowContainer" },
        rows
      );
    }
  }]);

  return Board;
}(React.Component);

//change cells to next generation


function updateCells() {
  isRunning = true;
  generation++;
  //create a temporary board
  var tempBoard = [];
  for (var i = -1; i <= height; i++) {
    tempBoard[i] = [];
    tempBoard[i].length = board[0].length;
  }
  //set negative and extra indexes for copied board
  for (var i = -1; i <= height; i++) {
    for (var j = -1; j <= width; j++) {
      tempBoard[i][j] = 'dead';
    }
  }
  //update temporary board with the original board's data
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      tempBoard[i][j] = board[i][j];
    }
  }
  //check for surrounding cells then go through the rules of the game
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var surroundingCells = 0;
      //check for number of living surrounding cells
      if (tempBoard[i - 1][j - 1] == 'old' || tempBoard[i - 1][j - 1] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i - 1][j] == 'old' || tempBoard[i - 1][j] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i - 1][j + 1] == 'old' || tempBoard[i - 1][j + 1] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i][j - 1] == 'old' || tempBoard[i][j - 1] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i][j + 1] == 'old' || tempBoard[i][j + 1] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i + 1][j - 1] == 'old' || tempBoard[i + 1][j - 1] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i + 1][j] == 'old' || tempBoard[i + 1][j] == 'new') {
        surroundingCells++;
      }
      if (tempBoard[i + 1][j + 1] == 'old' || tempBoard[i + 1][j + 1] == 'new') {
        surroundingCells++;
      }
      //change status of cell based on number of surrounding alive cells
      //rules for game of life
      if (tempBoard[i][j] == 'old' || tempBoard[i][j] == 'new') {
        if (surroundingCells < 2) {
          board[i][j] = 'dead';
        } else if (surroundingCells == 2 || surroundingCells == 3) {
          board[i][j] = 'old';
        } else if (surroundingCells > 3) {
          board[i][j] = 'dead';
        }
      } else if (tempBoard[i][j] == 'dead') {
        if (surroundingCells == 3) {
          board[i][j] = 'new';
        }
      }
    }
  }
  generateBoard();
}

//for the run button
function runSimulation() {
  if (!isRunning) {
    myInterval = setInterval("updateCells()", speed);
  }
}

//for the stop button
function stopSimulation() {
  clearTimeout(myInterval);
  isRunning = false;
}

//for the clear button
function clearSimulation() {
  clearTimeout(myInterval);
  isRunning = false;
  generation = 0;

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      board[i][j] = 'dead';
    }
  }
  generateBoard();
}

//for the speed buttons
function rate(x) {
  if (isRunning) {
    stopSimulation();
    speed = x;
    runSimulation();
  } else {
    speed = x;
  }
}

//for the size buttons
function size(h, w) {
  stopSimulation();
  generation = 0;
  height = h;
  width = w;
  selectPreset();
}

//for the dropdown menu of presets
function selectPreset() {
  clearTimeout(myInterval);
  generation = 0;
  isRunning = false;
  var selectBox = document.getElementById("selectPreset");
  preset = selectBox.options[selectBox.selectedIndex].value;

  if (preset == 'None') {
    generateDeadCells();
    generateBoard();
  } else if (preset == "Random") {
    generateRandomCells();
  } else if (preset == "10 Cell Row") {
    generateTenCellRow();
  } else if (preset == "Exploder") {
    generateExploder();
  } else if (preset == "Glider") {
    generateGlider();
  } else if (preset == "Lightweight Spaceship") {
    generateSpaceship();
  } else if (preset == "Tumbler") {
    generateTumbler();
  }
  generateBoard();
}

//for the dropdown menu of speeds
function selectSpeed() {
  var selectBox = document.getElementById("selectSpeed");
  preset = selectBox.options[selectBox.selectedIndex].value;

  if (preset == 'Slowest') {
    rate(1000);
  } else if (preset == "Slow") {
    rate(650);
  } else if (preset == "Normal") {
    rate(300);
  } else if (preset == "Fast") {
    rate(150);
  } else if (preset == "Fastest") {
    rate(50);
  }
}

//set all cells to dead
function generateDeadCells() {
  board = [];
  for (var i = -1; i < height; i++) {
    board[i] = [];
  }

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      board[i][j] = 'dead';
    }
  }
}

//creates a random set of cells
function generateRandomCells() {
  board = [];
  for (var i = -1; i < height; i++) {
    board[i] = [];
  }

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      if (Math.random() < 0.5) {
        board[i][j] = 'old';
      } else {
        board[i][j] = 'dead';
      }
    }
  }
}

//creates a lone 10 cell row
function generateTenCellRow() {
  generateDeadCells();
  var x = Math.floor(width / 2);
  var y = Math.floor(height / 2);
  board[y][x - 5] = 'new';
  board[y][x - 4] = 'new';
  board[y][x - 3] = 'new';
  board[y][x - 2] = 'new';
  board[y][x - 1] = 'new';
  board[y][x] = 'new';
  board[y][x + 1] = 'new';
  board[y][x + 2] = 'new';
  board[y][x + 3] = 'new';
  board[y][x + 4] = 'new';
}

//creates a lone exploder
function generateExploder() {
  generateDeadCells();
  var x = Math.floor(width / 2);
  var y = Math.floor(height / 2);
  board[y - 3][x] = 'new';
  board[y - 3][x - 2] = 'new';
  board[y - 2][x - 2] = 'new';
  board[y - 1][x - 2] = 'new';
  board[y][x - 2] = 'new';
  board[y + 1][x - 2] = 'new';
  board[y - 3][x + 2] = 'new';
  board[y - 2][x + 2] = 'new';
  board[y - 1][x + 2] = 'new';
  board[y][x + 2] = 'new';
  board[y + 1][x + 2] = 'new';
  board[y + 1][x] = 'new';
}

//creates a lone glider
function generateGlider() {
  generateDeadCells();
  board[1][2] = 'new';
  board[2][3] = 'new';
  board[3][1] = 'new';
  board[3][2] = 'new';
  board[3][3] = 'new';
}

//creates a lightweight spaceship
function generateSpaceship() {
  generateDeadCells();
  var y = Math.floor(height / 2);
  board[y - 2][2] = 'new';
  board[y - 2][3] = 'new';
  board[y - 2][4] = 'new';
  board[y - 2][5] = 'new';
  board[y - 1][5] = 'new';
  board[y][5] = 'new';
  board[y + 1][4] = 'new';
  board[y - 1][1] = 'new';
  board[y + 1][1] = 'new';
}

//creates a tumbler
function generateTumbler() {
  generateDeadCells();
  var x = Math.floor(width / 2);
  var y = Math.floor(height / 2);
  board[y - 3][x - 2] = 'new';
  board[y - 2][x - 2] = 'new';
  board[y - 3][x - 1] = 'new';
  board[y - 2][x - 1] = 'new';
  board[y - 1][x - 1] = 'new';
  board[y][x - 1] = 'new';
  board[y + 1][x - 1] = 'new';
  board[y - 3][x + 2] = 'new';
  board[y - 2][x + 2] = 'new';
  board[y - 3][x + 1] = 'new';
  board[y - 2][x + 1] = 'new';
  board[y - 1][x + 1] = 'new';
  board[y][x + 1] = 'new';
  board[y + 1][x + 1] = 'new';
  board[y][x - 3] = 'new';
  board[y + 1][x - 3] = 'new';
  board[y + 2][x - 3] = 'new';
  board[y + 2][x - 2] = 'new';
  board[y][x + 3] = 'new';
  board[y + 1][x + 3] = 'new';
  board[y + 2][x + 3] = 'new';
  board[y + 2][x + 2] = 'new';
}
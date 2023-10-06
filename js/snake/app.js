var highScore = getCookie("highScore");
if (highScore) {
  highScore = parseInt(highScore);
} else {
  highScore = 0;
}

var mycanvas = document.getElementById('mycanvas');
var ctx = mycanvas.getContext('2d');
var snakeSize = 20; // Tamaño de cada segmento de la serpiente
var w = 500; // Ancho del lienzo
var h = 500; // Altura del lienzo
var score = 0; // Puntuación inicial
var snake;
var food;
var direction; // Dirección de movimiento de la serpiente

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    setCookie("highScore", highScore, 365); // Almacena la puntuación alta en una cookie válida por 1 año
  }
}

var drawModule = (function () {

  var bodySnake = function (x, y) {
    ctx.fillStyle = 'green';
    ctx.fillRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(x * snakeSize, y * snakeSize, snakeSize, snakeSize);
  }

  var apple = function (x, y) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    var radius = snakeSize / 2; // Tamaño de la manzana
    var centerX = x * snakeSize + radius; // Coordenada x del centro de la manzana
    var centerY = y * snakeSize + radius; // Coordenada y del centro de la manzana
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
  }

  var scoreText = function () {
    var score_text = "Score: " + score;
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(score_text, 10, 30);
  }

  var drawSnake = function () {
    var length = 4;
    snake = [];
    for (var i = length - 1; i >= 0; i--) {
      snake.push({ x: i, y: 0 });
    }
  }

  var paint = function () {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    var snakeX = snake[0].x;
    var snakeY = snake[0].y;

    if (direction == 'right') {
      snakeX++;
    }
    else if (direction == 'left') {
      snakeX--;
    }
    else if (direction == 'up') {
      snakeY--;
    }
    else if (direction == 'down') {
      snakeY++;
    }

    // Colisión con la pared o con uno mismo
    if (snakeX < 0 || snakeX >= w / snakeSize || snakeY < 0 || snakeY >= h / snakeSize || checkCollision(snakeX, snakeY, snake)) {
      // Reiniciar juego
      direction = 'right'; // Dirección inicial
      score = 0; // Reiniciar puntuación
      drawSnake();
    }

    // Comer manzana
    if (snakeX == food.x && snakeY == food.y) {
      var tail = { x: snakeX, y: snakeY };
      score++;
      createFood();
    }
    else {
      var tail = snake.pop();
      tail.x = snakeX;
      tail.y = snakeY;
    }

    snake.unshift(tail);

    for (var i = 0; i < snake.length; i++) {
      bodySnake(snake[i].x, snake[i].y);
    }

    apple(food.x, food.y);
    scoreText();
  }

  var createFood = function () {
    food = {
      x: Math.floor(Math.random() * (w / snakeSize)),
      y: Math.floor(Math.random() * (h / snakeSize))
    }

    // Evitar que la manzana aparezca en el cuerpo de la serpiente
    for (var i = 0; i < snake.length; i++) {
      if (food.x === snake[i].x && food.y === snake[i].y) {
        createFood();
        return;
      }
    }
  }

  var checkCollision = function (x, y, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].x === x && array[i].y === y) {
        return true;
      }
    }
    return false;
  }

  var init = function () {
    direction = 'right'; // Dirección inicial
    drawSnake();
    createFood();
    setInterval(paint, 100);
  }

  return {
    init: init
  };

}());

(function (window, document, drawModule, undefined) {

  var btn = document.getElementById('btn');
  btn.addEventListener("click", function () { drawModule.init(); });

  document.onkeydown = function (event) {

    keyCode = window.event.keyCode;
    keyCode = event.keyCode;

    switch (keyCode) {

      case 37:
        if (direction != 'right') {
          direction = 'left';
        }
        break;

      case 39:
        if (direction != 'left') {
          direction = 'right';
        }
        break;

      case 38:
        if (direction != 'down') {
          direction = 'up';
        }
        break;

      case 40:
        if (direction != 'up') {
          direction = 'down';
        }
        break;
    }
  }

})(window, document, drawModule);

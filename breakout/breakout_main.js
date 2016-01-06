var canvas;
var ctx;
var ballX, ballY, dbX, dbY, paddleX, paddleY, bricks, game;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var rightPressed = false;
var leftPressed = false;
var brickColumns = 5;
var brickRows = 5;
var bricksCount = brickColumns * brickRows;
var logger = false;
var bricksRemoved = 0;

function logger(msg){
  var log = document.getElementById('log');
  if(log.getElementsByTagName('div').length > 70){
    log.removeChild(log.lastChild);
  }
  var logged = document.createElement('div');
  logged.innerHTML = msg;

  log.insertBefore(logged, log.firstChild);
}

function brick(x, y){
  this.exists = true;
  this.width = 75;
  this.height = 10;
  this.padding = 10;
  this.offsetTop = 30;
  this.offsetLeft = 30;
  this.x = x;
  this.y = y;
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
  if(e.keyCode == 39) {
    rightPressed = true;
  }
  else if(e.keyCode == 37){
    leftPressed = true;
  }
}

function keyUpHandler(e){
  if(e.keyCode == 39) {
    rightPressed = false;
  }
  else if(e.keyCode == 37){
    leftPressed = false;
  }
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks(){
  for(y = 0; y < brickColumns; y++){
    for(x = 0; x < brickRows; x++){
      if(!bricks[y][x].exists){ continue; }
      bricks[y][x].y = (y*(bricks[y][x].height + bricks[y][x].padding)) + bricks[y][x].offsetTop;
      bricks[y][x].x = (x*(bricks[y][x].width + bricks[y][x].padding)) + bricks[y][x].offsetLeft;
      ctx.beginPath();
      ctx.rect(bricks[y][x].x, bricks[y][x].y, bricks[y][x].width, bricks[y][x].height);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}

function brickCollisionDetection(){
  for(y = 0; y < brickColumns; y++){
    for(x = 0; x < brickRows; x++){
      if(!bricks[y][x].exists){ continue; }

      if(ballX >= bricks[y][x].x && ballX <= bricks[y][x].x + bricks[y][x].width
         && ballY >= bricks[y][x].y && ballY <= bricks[y][x].y + bricks[y][x].height){
        bricks[y][x].exists = false;
        dbY = -dbY;
        bricksRemoved += 1;
        if(bricksRemoved >= bricksCount){
          gameOver(true);
        }
      }
    }
  }
}

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  brickCollisionDetection();

  if(logger){
    logger("X: " + ballX.toString() + ", Y: " + ballY.toString());
  }
  if((ballY + dbY > paddleY - ballRadius && ballY + dbY < paddleY + ballRadius) &&
    ((ballX + dbX > paddleX - ballRadius && ballX + dbX < paddleX + paddleWidth - ballRadius) ||
    (ballX + dbX > paddleX + ballRadius && ballX + dbX < paddleX + paddleWidth + ballRadius))){
    dbY = -dbY;
  }
  if(ballY + dbY < ballRadius){
    dbY = -dbY;
  }
  if(ballY + dbY > canvas.height - ballRadius){
    gameOver(false);
  }
  if(ballX + dbX > canvas.width - ballRadius || ballX + dbX < ballRadius){
    dbX = -dbX;
  }
  if(leftPressed && paddleX > 0){
    paddleX -= 7
  }
  if(rightPressed && paddleX < canvas.width - paddleWidth){
    paddleX += 7
  }

  ballX += dbX;
  ballY += dbY;
}

function gameOver(win){
  var cont = true;
  if(win){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    drawBall();
    cont = confirm("Good Job! Ok to continue, cancel to stop.");
  }
  else {
    cont = confirm("Game Over. Ok to continue, cancel to stop.");
  }

  if(!cont){
    clearInterval(game);
  }
  else{
    document.location.reload();
  }

}

function runGame(run, checkInterval){
  if(run){
    game = setInterval(draw, checkInterval);
  } else{
    return;
  }
}

function init(){
  canvas = document.getElementById('canvas_main');
  ctx = canvas.getContext('2d');
  paddleX = (canvas.width - paddleWidth)/2;
  paddleY = canvas.height - paddleHeight;
  ballX = canvas.width/2;
  ballY = canvas.height-30;
  dbX = 2;
  dbY = -2;
  bricks = [];
  for(y = 0; y < brickColumns; y++){
    bricks[y] = [];
    for(x = 0; x < brickRows; x++){
      bricks[y][x] = new brick(0,0);
    }
  }
  runGame(true, 10);
}

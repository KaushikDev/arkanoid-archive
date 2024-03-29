var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight* 0.90;
	
	var x = canvas.width/2;
	var y = canvas.height-30;
	
	var dx = 2;
	var dy = -2;
	
	var ballRadius = 20;
	var ballDec = 0.20;
	
	var paddleHeight = 10;
	var paddleWidth = 0.35 * canvas.width;
	var paddleX = (canvas.width-paddleWidth)/2;
	var paddleDec = 1;
	
	var rightPressed = false;
	var leftPressed = false;
	
	var soundHitBrick =  new Audio("hitBrick.wav");
	var soundHitPaddle =  new Audio("hitPaddle.ogg");
	var soundHitFloor =  new Audio("hitFloor.m4a");
	
	var score = 0;
	var lives = 3;
	var scoreOffsetLeft = 30;
	var livesOffsetRight = 100;
	
	var brickWidth = 50;
	var brickHeight = 20;
	
	var brickPadding = 5;
	var brickOffsetTop = 30;
	var brickOffsetLeft = 30;
	var brickRowCount = 10;
	var brickColumnCount = (Math.floor(canvas.width/(brickWidth+brickPadding)));
	console.log("Column count is : "+brickColumnCount);
	
	var bricks = [];
	for (c=0;c<brickColumnCount;c++){
		bricks[c]=[];
		for(r=0;r<brickRowCount;r++){
			//position to paint bricks at the following x,y positions onscreen
			bricks[c][r]={x:0, y:0, status:1};
		}
	
	}
	
		function draw(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBall();
			drawPaddle();
			drawBricks();
			drawScore();
			drawLives();
			collisionDetection();
			x += dx;
			y += dy;
			
			//trying to bounce from left and right sides
			if(x+dx > canvas.width-ballRadius || x+dx < ballRadius){
				dx = -dx;
			}
			// trying to bounce from top only and exclude bottom so the game can be over
			if(y+dy < ballRadius){
				dy = -dy;
			}
			else if(y+dy > canvas.height-ballRadius){
				if(x > paddleX && x < paddleX+paddleWidth){
				soundHitPaddle.play();
				dy = -dy;
				}
				else{
					soundHitFloor.play();
					lives--;
					if(!lives) {
						//alert("You Lost!!\nBetter luck next time.\n\nYour Score : "+score);
						//document.location.reload();
						
						//new code
						var confirmation = confirm("Game Over.\nYour Score is : "+ score+ ".\n\nPress 'OK' to replay , press 'Cancel' to exit!");
			
						if(confirmation){
				
						window.location = "gameScreen.html";
						}
						else
						window.location = "index.html";
						//new code			
						
					}
					else {
						x = canvas.width/2;
						y = canvas.height-30;
						dx = 2;
						dy = -2;
						paddleX = (canvas.width-paddleWidth)/2;
					}
				}
			}
			//moving paddle and stopping at the right edge
			if(rightPressed && paddleX < canvas.width-paddleWidth){
				paddleX += 10;
			}
			//moving paddle and stopping at the left edge
			if(leftPressed && paddleX > 0){
				paddleX += -10;
			}
		}
		
		function drawBall(){
			ctx.beginPath();
			ctx.arc(x,y,ballRadius,0, Math.PI*2);
			var colorBall = "red";
			//var colorBall = "hsl("+parseInt(Math.random() * 360, 10) + ",  100%, 50%)";
			ctx.fillStyle=colorBall;
			ctx.fill();
			ctx.closePath();
		}
		
		function drawPaddle(){
			ctx.beginPath();
			ctx.rect(paddleX, canvas.height-paddleHeight-1, paddleWidth, paddleHeight);
			//var colorPaddle = "hsl("+parseInt(Math.random() * 360, 10) + ",  100%, 50%)";
			ctx.fillStyle = "yellow";
			ctx.strokeStyle = "black";
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}
		
		function drawBricks(){
			for(c=0;c<brickColumnCount;c++){
				for(r=0;r<brickRowCount;r++){
					if(bricks[c][r].status==1){
						var img = new Image();
						var brickColor = "hsl("+parseInt(Math.random() * 360, 10) + ",  100%, 50%)";
						var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
						var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
						bricks[c][r].x = brickX;
						bricks[c][r].y = brickY;
						ctx.beginPath();
						
						img.src = "brick3.png";
						ctx.drawImage(img, brickX,brickY,brickWidth,brickHeight);
						//ctx.rect(brickX,brickY,brickWidth,brickHeight);
						ctx.fillStyle = brickColor;
						ctx.fill();
						ctx.closePath();
					}
					
				}
			}
		}
		
		function drawScore(){
			ctx.font = "16px Arial";
			ctx.fillStyle = "white";
			ctx.fillText("Score : "+score, scoreOffsetLeft, 20);
		
		}
		
	
		function drawLives() {
			ctx.font = "16px Arial";
			ctx.fillStyle = "white";
			ctx.fillText("Lives: "+lives, canvas.width-livesOffsetRight, 20);
		}
		
		function collisionDetection(){
			for(c=0;c<brickColumnCount;c++){
				for(r=0;r<brickRowCount;r++){
					var b = bricks[c][r];
					if(b.status==1){
						if((x>b.x) && (x<b.x+brickWidth ) && (y>b.y) && (y<b.y+brickHeight)){
							soundHitBrick.play();
							dy = -dy;
							b.status = 0;
							score+=5;
							if(paddleWidth>25){
								paddleWidth -= paddleDec;
							}
							if(ballRadius>5){
								ballRadius -= ballDec;
							}
							//console.log(paddleWidth);
							if(score == brickRowCount*brickColumnCount*5){
								alert("You Won, Champ!!\n\nYour Score : "+score);
								document.location.reload();
							}
						}
					}
					
				}
			}
		}
		
		document.addEventListener("keydown", keyDownHandler, false);
		document.addEventListener("keyup", keyUpHandler, false);
		document.addEventListener("mousemove", mouseMoveHandler, false);
		document.addEventListener("touchmove", touchMoveHandler, false);
		
		function keyDownHandler(e){
			if(e.keyCode==39){
				rightPressed = true;
			}
			else if(e.keyCode==37){
				leftPressed = true;
			}
		
		}
		
		function keyUpHandler(e){
			if(e.keyCode==39){
				rightPressed = false;
			}
			else if(e.keyCode==37){
				leftPressed = false;
			}
		
		}
		
		function mouseMoveHandler(e) {
			var relativeX = e.clientX - canvas.offsetLeft;
			if(relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth/2;
			}
		}
		
		/*function touchMoveHandler(e) {
			var relativeX = e.clientX - canvas.offsetLeft;
			if(relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth/2;
			}
		}*/
		
		function touchMoveHandler(e) {
             var relativeX = e.touches[0].screenX - canvas.offsetLeft;
			if(relativeX > 0 && relativeX < canvas.width) {
				paddleX = relativeX - paddleWidth/2;
			}
        }
		
		function sound(src){
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		this.sound.setAttribute("controls","none");
		this.sound.style.display="none";
		document.body.appendChild(this.sound);
		this.play = function(){
			this.sound.play();
		}
		this.stop = function(){
			this.sound.pause();
		}
	}
		
		setInterval(draw, 5);


//test code

function onDeviceReady(){
		document.addEventListener("backbutton", onBackKeyDown, false);
		devicePlatform = device.platform;
		console.log(devicePlatform);
		}
		function onBackKeyDown() {
			if(confirm("Hey!! You really wanna leave??")){
				navigator.app.exitApp();
			}
 		}
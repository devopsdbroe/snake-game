// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw the game map, snake, and food
function draw() {
	// Reset board if game has already been started
	board.innerHTML = "";

	drawSnake();
	drawFood();
	updateScore();
}

// Draw snake
function drawSnake() {
	// Go through each coordinate object in snake array
	snake.forEach((segment) => {
		const snakeElement = createGameElement("div", "snake");

		setPosition(snakeElement, segment);
		board.appendChild(snakeElement);
	});
}

// Create a snake or food cube
function createGameElement(tag, className) {
	const element = document.createElement(tag);
	element.className = className;

	return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
	element.style.gridColumn = position.x;
	element.style.gridRow = position.y;
}

// Create a food cube
function drawFood() {
	if (gameStarted) {
		const foodElement = createGameElement("div", "food");
		setPosition(foodElement, food);
		board.appendChild(foodElement);
	}
}

// Randomize position of food cube
function generateFood() {
	const x = Math.floor(Math.random() * gridSize) + 1;
	const y = Math.floor(Math.random() * gridSize) + 1;

	// Return randomized food coordinates
	return { x, y };
}

// Moving the snake
function move() {
	// Create shallow copy of snake head using spread operator
	const head = { ...snake[0] };
	switch (direction) {
		case "up":
			head.y--;
			break;
		case "down":
			head.y++;
			break;
		case "left":
			head.x--;
			break;
		case "right":
			head.x++;
			break;

		default:
			break;
	}

	// Put the copy of head at the start of snake array
	snake.unshift(head);

	// Check if snake head has run into food cube
	if (head.x === food.x && head.y === food.y) {
		// Generate new food cube
		food = generateFood();
		increaseSpeed();

		// Clear past interval
		clearInterval(gameInterval);

		gameInterval = setInterval(() => {
			move();
			checkCollision();
			draw();
		}, gameSpeedDelay);
	} else {
		// Remove last element in snake array to give illusion of movement
		snake.pop();
	}
}

// Start game function
function startGame() {
	// Keep track of whether game is running or not
	gameStarted = true;

	// Hide logo and instruction text when the game is started
	instructionText.style.display = "none";
	logo.style.display = "none";
	gameInterval = setInterval(() => {
		move();
		checkCollision();
		draw();
	}, gameSpeedDelay);
}

// Keypress listener event
function handleKeypress(e) {
	if ((!gameStarted && e.code === "Space") || (!gameStarted && e.key === " ")) {
		startGame();
	} else {
		switch (e.key) {
			case "ArrowUp":
				direction = "up";
				break;
			case "ArrowDown":
				direction = "down";
				break;
			case "ArrowLeft":
				direction = "left";
				break;
			case "ArrowRight":
				direction = "right";
				break;

			default:
				break;
		}
	}
}

function increaseSpeed() {
	if (gameSpeedDelay > 150) {
		gameSpeedDelay -= 5;
	} else if (gameSpeedDelay > 100) {
		gameSpeedDelay -= 3;
	} else if (gameSpeedDelay > 50) {
		gameSpeedDelay -= 2;
	} else if (gameSpeedDelay > 25) {
		gameSpeedDelay -= 1;
	}
}

function checkCollision() {
	const head = snake[0];

	// Check if snake has hit the wall
	if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
		resetGame();
	}

	// Check if snake has collided with itself
	for (let i = 1; i < snake.length; i++) {
		if (head.x === snake[i].x && head.y === snake[i].y) {
			resetGame();
		}
	}
}

function resetGame() {
	updateHighScore();
	stopGame();

	// Set game variables back to default values
	snake = [{ x: 10, y: 10 }];
	food = generateFood();
	direction = "right";
	gameSpeedDelay = 200;

	updateScore();
	draw();
}

function updateScore() {
	const currentScore = snake.length - 1;
	score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
	clearInterval(gameInterval);
	gameStarted = false;
	instructionText.style.display = "block";
	logo.style.display = "block";
}

function updateHighScore() {
	const currentScore = snake.length - 1;
	if (currentScore > highScore) {
		highScore = currentScore;
		highScoreText.textContent = highScore.toString().padStart(3, "0");
	}

	highScoreText.style.display = "block";
}

document.addEventListener("keydown", handleKeypress);

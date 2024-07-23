// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variables
const gameState = {
	gridSize: 20,
	snake: [{ x: 10, y: 10 }],
	food: { x: 0, y: 0 },
	highScore: 0,
	direction: "right",
	gameInterval: null,
	gameSpeedDelay: 200,
	gameStarted: false,
};

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
	gameState.snake.forEach((segment) => {
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
	if (gameState.gameStarted) {
		const foodElement = createGameElement("div", "food");
		setPosition(foodElement, gameState.food);
		board.appendChild(foodElement);
	}
}

// Randomize position of food cube
function generateFood() {
	const x = Math.floor(Math.random() * gameState.gridSize) + 1;
	const y = Math.floor(Math.random() * gameState.gridSize) + 1;

	// Return randomized food coordinates
	return { x, y };
}

gameState.food = generateFood();

// Moving the snake
function move() {
	// Create shallow copy of snake head using spread operator
	const head = { ...gameState.snake[0] };
	switch (gameState.direction) {
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
	gameState.snake.unshift(head);

	// Check if snake head has run into food cube
	if (head.x === gameState.food.x && head.y === gameState.food.y) {
		// Generate new food cube
		gameState.food = generateFood();
		increaseSpeed();

		// Clear past interval
		clearInterval(gameState.gameInterval);

		gameState.gameInterval = setInterval(() => {
			move();
			checkCollision();
			draw();
		}, gameState.gameSpeedDelay);
	} else {
		// Remove last element in snake array to give illusion of movement
		gameState.snake.pop();
	}
}

// Start game function
function startGame() {
	// Keep track of whether game is running or not
	gameState.gameStarted = true;

	// Hide logo and instruction text when the game is started
	instructionText.style.display = "none";
	logo.style.display = "none";
	gameState.gameInterval = setInterval(() => {
		move();
		checkCollision();
		draw();
	}, gameState.gameSpeedDelay);
}

// Keypress listener event
function handleKeypress(e) {
	if (
		(!gameState.gameStarted && e.code === "Space") ||
		(!gameState.gameStarted && e.key === " ")
	) {
		startGame();
	} else {
		switch (e.key) {
			case "ArrowUp":
				gameState.direction = "up";
				break;
			case "ArrowDown":
				gameState.direction = "down";
				break;
			case "ArrowLeft":
				gameState.direction = "left";
				break;
			case "ArrowRight":
				gameState.direction = "right";
				break;

			default:
				break;
		}
	}
}

function increaseSpeed() {
	if (gameState.gameSpeedDelay > 150) {
		gameState.gameSpeedDelay -= 5;
	} else if (gameState.gameSpeedDelay > 100) {
		gameState.gameSpeedDelay -= 3;
	} else if (gameState.gameSpeedDelay > 50) {
		gameState.gameSpeedDelay -= 2;
	} else if (gameState.gameSpeedDelay > 25) {
		gameState.gameSpeedDelay -= 1;
	}
}

function checkCollision() {
	const head = gameState.snake[0];

	// Check if snake has hit the wall
	if (
		head.x < 1 ||
		head.x > gameState.gridSize ||
		head.y < 1 ||
		head.y > gameState.gridSize
	) {
		resetGame();
	}

	// Check if snake has collided with itself
	for (let i = 1; i < gameState.snake.length; i++) {
		if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
			resetGame();
		}
	}
}

function resetGame() {
	updateHighScore();
	stopGame();

	// Set game variables back to default values
	gameState.snake = [{ x: 10, y: 10 }];
	gameState.food = generateFood();
	gameState.direction = "right";
	gameState.gameSpeedDelay = 200;

	updateScore();
	draw();
}

function updateScore() {
	const currentScore = gameState.snake.length - 1;
	score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
	clearInterval(gameState.gameInterval);
	gameState.gameStarted = false;
	instructionText.style.display = "block";
	logo.style.display = "block";
}

function updateHighScore() {
	const currentScore = gameState.snake.length - 1;
	if (currentScore > gameState.highScore) {
		gameState.highScore = currentScore;
		highScoreText.textContent = gameState.highScore.toString().padStart(3, "0");
	}

	highScoreText.style.display = "block";
}

document.addEventListener("keydown", handleKeypress);

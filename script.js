// Define HTML elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const pauseOverlay = document.getElementById("pause-overlay");

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
	gamePaused: false,
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
	}

	// Put the copy of head at the start of snake array
	gameState.snake.unshift(head);

	// Check if snake head has run into food cube
	if (head.x === gameState.food.x && head.y === gameState.food.y) {
		// Generate new food cube
		gameState.food = generateFood();
		increaseSpeed();
		resetInterval();
	} else {
		// Remove last element in snake array to give illusion of movement
		gameState.snake.pop();
	}
}

function resetInterval() {
	clearInterval(gameState.gameInterval);
	gameState.gameInterval = setInterval(() => {
		move();
		checkCollision();
		draw();
	}, gameState.gameSpeedDelay);
}

// Start game function
function startGame() {
	// Keep track of whether game is running or not
	gameState.gameStarted = true;

	// Hide logo and instruction text when the game is started
	instructionText.classList.add("hidden");
	logo.classList.add("hidden");

	resetInterval();
}

function setupEventListeners() {
	document.addEventListener("keydown", handleKeypress);
}

// Keypress listener event
function handleKeypress(e) {
	if (e.code === "Escape" && gameState.gameStarted) {
		togglePause();
	} else if (!gameState.gameStarted && (e.code === "Space" || e.key === " ")) {
		startGame();
	} else {
		changeDirection(e.key);
	}
}

function changeDirection(key) {
	if (gameState.gamePaused) return;

	switch (key) {
		case "ArrowUp":
			if (gameState.direction !== "down") gameState.direction = "up";
			break;
		case "ArrowDown":
			if (gameState.direction !== "up") gameState.direction = "down";
			break;
		case "ArrowLeft":
			if (gameState.direction !== "right") gameState.direction = "left";
			break;
		case "ArrowRight":
			if (gameState.direction !== "left") gameState.direction = "right";
			break;
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
		return;
	}

	// Check if snake has collided with itself
	for (let i = 1; i < gameState.snake.length; i++) {
		if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
			resetGame();
			return;
		}
	}
}

function togglePause() {
	if (gameState.gamePaused) {
		resumeGame();
	} else {
		pauseGame();
	}
}

function pauseGame() {
	gameState.gamePaused = true;
	clearInterval(gameState.gameInterval);
	pauseOverlay.classList.remove("hidden");
}

function resumeGame() {
	gameState.gamePaused = false;
	pauseOverlay.classList.add("hidden");
	resetInterval();
}

function resetGame() {
	updateHighScore();
	stopGame();

	// Set game variables back to default values
	Object.assign(gameState, {
		snake: [{ x: 10, y: 10 }],
		food: generateFood(),
		direction: "right",
		gameSpeedDelay: 200,
	});

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
	instructionText.classList.remove("hidden");
	logo.classList.remove("hidden");
}

function updateHighScore() {
	const currentScore = gameState.snake.length - 1;
	if (currentScore > gameState.highScore) {
		gameState.highScore = currentScore;
		highScoreText.textContent = gameState.highScore.toString().padStart(3, "0");
	}

	highScoreText.style.display = "block";
}

setupEventListeners();

// Define grid settings
const gridSize = 10;  // Grid size (10x10)
const cellSize = 50;  // Size of each grid cell

// Define grid container
const gridContainer = document.querySelector('.grid');

// Define the maze (0 = path, 1 = wall)
const maze = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
];

// Create the grid dynamically based on maze
function createGrid() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            gridContainer.appendChild(cell);

            // Add walls based on the maze definition
            if (maze[row][col] === 1) {
                cell.classList.add('wall'); // Wall
            } else {
                cell.classList.add('dot'); // Path (Dot)
            }
        }
    }
}

// Create grid and elements
createGrid();

// Find the first 0 (open path) in the maze to start Pac-Man
let pacmanRow = 0;
let pacmanCol = 0;
outerLoop: for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
        if (maze[row][col] === 0) {
            pacmanRow = row;
            pacmanCol = col;
            break outerLoop;  // Stop searching once we find the first 0
        }
    }
}

const moveDelay = 200; // Movement speed (milliseconds)

// Pac-Man images for each direction
const pacArray = [
    ["./images/PacMan1.png", "./images/PacMan2.png"], // Right movement
    ["./images/PacMan4.png", "./images/PacMan3.png"], // Left movement
    ["./images/PacMan5-up.png", "./images/PacMan6-up.png"], // Up movement
    ["./images/PacMan5-down.png", "./images/PacMan6-down.png"] // Down movement
];

// Direction variables
let direction = null; // No movement initially
let focus = 0;

// Create Pac-Man element
const pacman = document.createElement('img');
pacman.id = 'PacMan';
pacman.classList.add('pacman');
pacman.src = pacArray[0][focus]; // Set initial image
gridContainer.appendChild(pacman);

// Function to check if a move is valid (path not blocked by a wall)
function isValidMove(row, col) {
    if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) return false;
    return maze[row][col] === 0; // 0 means open path
}

// Function to move Pac-Man based on the direction
function movePacMan() {
    if (direction === null) {
        setTimeout(movePacMan, moveDelay);
        return;
    }

    let newRow = pacmanRow;
    let newCol = pacmanCol;

    // Calculate new position based on direction
    if (direction === 0) newCol += 1; // Right
    if (direction === 1) newCol -= 1; // Left
    if (direction === 2) newRow -= 1; // Up
    if (direction === 3) newRow += 1; // Down

    // Only move if it's a valid position
    if (isValidMove(newRow, newCol)) {
        pacmanRow = newRow;
        pacmanCol = newCol;

        // Check if there's a dot at the new position
        const targetCell = gridContainer.children[pacmanRow * gridSize + pacmanCol];
        if (targetCell && targetCell.classList.contains('dot')) {
            targetCell.classList.remove('dot'); // Pac-Man eats the dot
        }
    }

    // Update position with correction to ensure no skip
    pacman.style.left = `${pacmanCol * cellSize}px`;
    pacman.style.top = `${pacmanRow * cellSize}px`;
    pacman.src = pacArray[direction][focus]; // Change animation frame

    setTimeout(movePacMan, moveDelay); // Control speed
}

// Listen for arrow key input to move Pac-Man
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && isValidMove(pacmanRow, pacmanCol + 1)) {
        direction = 0; // Move right
    }
    if (event.key === "ArrowLeft" && isValidMove(pacmanRow, pacmanCol - 1)) {
        direction = 1; // Move left
    }
    if (event.key === "ArrowUp" && isValidMove(pacmanRow - 1, pacmanCol)) {
        direction = 2; // Move up
    }
    if (event.key === "ArrowDown" && isValidMove(pacmanRow + 1, pacmanCol)) {
        direction = 3; // Move down
    }
});

// Smoothly switch images for Pac-Man animation
setInterval(() => { focus = (focus + 1) % 2; }, 400);

// Start game loop with controlled speed
setTimeout(movePacMan, moveDelay);

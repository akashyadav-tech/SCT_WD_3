// Game variables
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' or 'pvc'
let scores = {
    xWins: 0,
    oWins: 0,
    draws: 0
};

// Winning combinations
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// DOM elements
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');
const xWinsElement = document.getElementById('x-wins');
const oWinsElement = document.getElementById('o-wins');
const drawsElement = document.getElementById('draws');

// Initialize the game
function initGame() {
    // Clear the board
    boardElement.innerHTML = '';
    
    // Create cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => cellClicked(i));
        boardElement.appendChild(cell);
    }
    
    // Reset game state
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    
    // Update status
    updateStatus();
    
    // Update scores display
    updateScores();
}

// Handle cell click
function cellClicked(index) {
    // Check if cell is empty and game is active
    if (board[index] !== '' || !gameActive) {
        return;
    }
    
    // Make the move
    makeMove(index);
    
    // If playing against computer and it's computer's turn
    if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
        // Wait a bit so player can see their move
        setTimeout(computerMove, 500);
    }
}

// Make a move at the given position
function makeMove(index) {
    // Update board
    board[index] = currentPlayer;
    
    // Update UI
    const cell = boardElement.children[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    // Check for win or draw
    checkGameResult();
    
    // Switch player if game is still active
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

// Computer makes a move
function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;
    
    // Simple AI: try to win, then block, then random
    let move = findWinningMove('O'); // Try to win
    
    if (move === -1) {
        move = findWinningMove('X'); // Try to block
    }
    
    if (move === -1) {
        move = findRandomMove(); // Random move
    }
    
    if (move !== -1) {
        makeMove(move);
    }
}

// Find a winning move for a player
function findWinningMove(player) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        // Count how many in this pattern belong to the player
        let count = 0;
        let emptyIndex = -1;
        
        if (board[a] === player) count++;
        else if (board[a] === '') emptyIndex = a;
        
        if (board[b] === player) count++;
        else if (board[b] === '') emptyIndex = b;
        
        if (board[c] === player) count++;
        else if (board[c] === '') emptyIndex = c;
        
        // If player has 2 in this line and there's an empty spot
        if (count === 2 && emptyIndex !== -1) {
            return emptyIndex;
        }
    }
    
    return -1; // No winning move found
}

// Find a random empty cell
function findRandomMove() {
    // Get all empty cells
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            emptyCells.push(i);
        }
    }
    
    // If there are empty cells, pick one at random
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    
    return -1; // No empty cells
}

// Check if someone won or if it's a draw
function checkGameResult() {
    // Check for win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Someone won
            gameActive = false;
            
            // Highlight winning cells
            boardElement.children[a].classList.add('winning-cell');
            boardElement.children[b].classList.add('winning-cell');
            boardElement.children[c].classList.add('winning-cell');
            
            // Update scores
            if (board[a] === 'X') {
                scores.xWins++;
                statusElement.textContent = 'Player X wins!';
            } else {
                scores.oWins++;
                if (gameMode === 'pvc') {
                    statusElement.textContent = 'Computer wins!';
                } else {
                    statusElement.textContent = 'Player O wins!';
                }
            }
            
            updateScores();
            return;
        }
    }
    
    // Check for draw
    if (!board.includes('')) {
        gameActive = false;
        scores.draws++;
        statusElement.textContent = "It's a draw!";
        updateScores();
    }
}

// Update the status message
function updateStatus() {
    if (!gameActive) return;
    
    if (gameMode === 'pvc') {
        if (currentPlayer === 'X') {
            statusElement.textContent = 'Your turn (X)';
        } else {
            statusElement.textContent = 'Computer thinking...';
        }
    } else {
        statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Update scores display
function updateScores() {
    xWinsElement.textContent = scores.xWins;
    oWinsElement.textContent = scores.oWins;
    drawsElement.textContent = scores.draws;
}

// Switch game mode
function switchMode(mode) {
    gameMode = mode;
    
    // Update button styles
    if (mode === 'pvp') {
        pvpBtn.style.backgroundColor = '#45a049';
        pvcBtn.style.backgroundColor = '#4CAF50';
    } else {
        pvpBtn.style.backgroundColor = '#4CAF50';
        pvcBtn.style.backgroundColor = '#45a049';
    }
    
    // Reset the game
    initGame();
}

// Event listeners
restartBtn.addEventListener('click', initGame);

pvpBtn.addEventListener('click', () => {
    switchMode('pvp');
});

pvcBtn.addEventListener('click', () => {
    switchMode('pvc');
});

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);
let board = [];
let currentPlayer = 1;
let players = [
  { name: "Player 1", color: "red" },
  { name: "Player 2", color: "yellow" }
];
let aiEnabled = false;

function showSetup() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
}

function startGame() {
  players[0].name = document.getElementById("player1-name").value || "Player 1";
  players[0].color = document.getElementById("player1-color").value;
  players[1].name = document.getElementById("player2-name").value || "Player 2";
  players[1].color = document.getElementById("player2-color").value;
  aiEnabled = document.getElementById("play-ai").checked;

  document.getElementById("setup-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  initBoard();
  updateTurnText();
}

function initBoard() {
  board = Array.from({ length: 6 }, () => Array(7).fill(0));
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => handleMove(c);
      boardDiv.appendChild(cell);
    }
  }
}

function handleMove(col) {
  for (let row = 5; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      updateBoardUI();
      if (checkWin(row, col)) {
        setTimeout(() => alert(`${players[currentPlayer - 1].name} wins!`), 100);
        return;
      }
      currentPlayer = 3 - currentPlayer;
      updateTurnText();
      if (aiEnabled && currentPlayer === 2) setTimeout(aiMove, 500);
      return;
    }
  }
}

function updateBoardUI() {
  document.querySelectorAll(".cell").forEach(cell => {
    const r = +cell.dataset.row;
    const c = +cell.dataset.col;
    const val = board[r][c];
    if (val === 0) {
      cell.style.backgroundColor = "#ccc";
    } else {
      cell.style.backgroundColor = players[val - 1].color;
    }
  });
}

function updateTurnText() {
  document.getElementById("turn-display").textContent = `${players[currentPlayer - 1].name}'s Turn`;
}

function checkWin(r, c) {
  const dirs = [[1,0],[0,1],[1,1],[1,-1]];
  const player = board[r][c];
  for (const [dr, dc] of dirs) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      if (board[r + dr*i]?.[c + dc*i] === player) count++;
      else break;
    }
    for (let i = 1; i < 4; i++) {
      if (board[r - dr*i]?.[c - dc*i] === player) count++;
      else break;
    }
    if (count >= 4) return true;
  }
  return false;
}

function aiMove() {
  let col;
  do {
    col = Math.floor(Math.random() * 7);
  } while (board[0][col] !== 0);
  handleMove(col);
}

function resetAll() {
  currentPlayer = 1;
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("setup-screen").classList.remove("hidden");
}

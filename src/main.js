import "./style.css";

const cells = document.querySelectorAll(".cell");
const status = document.querySelector("#status");
const winLine = document.querySelector("#win-line");
const rematchBtn = document.querySelector("#rematch-btn");
const menuBtn = document.querySelector("#menu-btn");
const gameActions = document.querySelector("#game-actions");

const menu = document.querySelector("#menu");
const game = document.querySelector("#game");

const twoPlayerBtn = document.querySelector("#two-player-btn");
const aiBtn = document.querySelector("#ai-btn");


let board = [
  "", "", "",
  "", "", "",
  "", "", ""
];

let currentPlayer = "X";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

let gameMode = "2-player";

function startGame(mode) {
  gameMode = mode;

  console.log("Game mode:", gameMode);

  menu.style.display = "none";
  game.style.display = "block";

  resetGame();
}

twoPlayerBtn.addEventListener("click", () => {
  startGame("2-player");
});

aiBtn.addEventListener("click", () => {
  startGame("ai");
});

function resetGame() {
  board = [
    "", "", "",
    "", "", "",
    "", "", ""
  ];

  currentPlayer = "X";

  cells.forEach((cell) => {
    cell.textContent = "";
  });

  winLine.style.display = "none";

  status.textContent = "Player X's turn";

  gameActions.style.display = "none";
}



function checkWinner() {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        player: board[a],
        combination: combination
      };
    }
  }

  return null;
}


function makeAIMove() {
  // Find all empty cells
  const emptyCells = board
    .map((cell, index) => cell === "" ? index : null)
    .filter((index) => index !== null);

  // No moves available
  if (emptyCells.length === 0) {
    return;
  }

  // 1. Try to win
  for (const index of emptyCells) {
    board[index] = "O";

    if (checkWinner()) {
      cells[index].textContent = "O";
      return;
    }

    board[index] = "";
  }

  // 2. Try to block Player X
  for (const index of emptyCells) {
    board[index] = "X";

    if (checkWinner()) {
      board[index] = "O";
      cells[index].textContent = "O";
      return;
    }

    board[index] = "";
  }

  // 3. Take center
  if (board[4] === "") {
    board[4] = "O";
    cells[4].textContent = "O";
    return;
  }

  // 4. Random empty cell
  const randomIndex =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

  board[randomIndex] = "O";
  cells[randomIndex].textContent = "O";
}



function finishGame() {
  const winner = checkWinner();

  if (winner) {
    status.textContent = `Player ${winner.player} wins!`;

    showWinningLine(winner.combination);

    gameActions.style.display = "flex";

    return true;
  }

  if (board.every((cell) => cell !== "")) {

  if (gameMode === "ai") {
    status.textContent = "It's a draw! Restarting...";

    setTimeout(() => {
      resetGame();
    }, 800);

    return true;
  }

  status.textContent = "It's a draw!";
  gameActions.style.display = "flex";

  return true;
}

  return false;
}



function showWinningLine(combination) {
  const linePositions = {
  "0,1,2": {
  top: "16.66%",
  left: "6%",
  width: "88%",
  height: "6px",
  transform: "translateY(-50%)"
},

"3,4,5": {
  top: "50%",
  left: "6%",
  width: "88%",
  height: "6px",
  transform: "translateY(-50%)"
},

"6,7,8": {
  top: "83.33%",
  left: "6%",
  width: "88%",
  height: "6px",
  transform: "translateY(-50%)"
},

"0,3,6": {
  top: "6%",
  left: "16.66%",
  width: "6px",
  height: "88%",
  transform: "translateX(-50%)"
},

"1,4,7": {
  top: "6%",
  left: "50%",
  width: "6px",
  height: "88%",
  transform: "translateX(-50%)"
},

"2,5,8": {
  top: "6%",
  left: "83.33%",
  width: "6px",
  height: "88%",
  transform: "translateX(-50%)"
},

 "0,4,8": {
  top: "50%",
  left: "50%",
  width: "124%",
  height: "6px",
  transform: "translate(-50%, -50%) rotate(45deg)"
},

"2,4,6": {
  top: "50%",
  left: "50%",
  width: "124%",
  height: "6px",
  transform: "translate(-50%, -50%) rotate(-45deg)"
}
  };

  const position = linePositions[combination.join(",")];

  Object.assign(winLine.style, position);

  winLine.style.display = "block";
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {

    // Don't allow overwriting
    if (board[index] !== "") {
      return;
    }

    // Don't allow clicking during AI turn
    if (gameMode === "ai" && currentPlayer === "O") {
      return;
    }

    // Player move
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Check player result
    if (finishGame()) {
      return;
    }

    // AI mode
    if (gameMode === "ai") {
      currentPlayer = "O";
      status.textContent = "AI's turn...";

      setTimeout(() => {
        makeAIMove();

        // Check AI result
        if (finishGame()) {
          return;
        }

        currentPlayer = "X";
        status.textContent = "Player X's turn";
      }, 400);

      return;
    }

    // 2-player mode
    if (currentPlayer === "X") {
      currentPlayer = "O";
    } else {
      currentPlayer = "X";
    }

    status.textContent = `Player ${currentPlayer}'s turn`;

    console.log(board);
  });
});


rematchBtn.addEventListener("click", () => {
  resetGame();
});

menuBtn.addEventListener("click", () => {
  game.style.display = "none";
  menu.style.display = "block";

  resetGame();
});
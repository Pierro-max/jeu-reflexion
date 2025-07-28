document.addEventListener("DOMContentLoaded", () => {
  // Éléments du DOM
  const setupScreen = document.getElementById("setup-screen");
  const gameScreen = document.getElementById("game-screen");
  const resultScreen = document.getElementById("result-screen");
  const startBtn = document.getElementById("start-btn");
  const guessBtn = document.getElementById("guess-btn");
  const restartBtn = document.getElementById("restart-btn");
  const maxNumberInput = document.getElementById("max-number");
  const maxAttemptsInput = document.getElementById("max-attempts");
  const guessInput = document.getElementById("guess-input");
  const rangeDisplay = document.getElementById("range-display");
  const attemptsDisplay = document.getElementById("attempts-display");
  const previousGuesses = document.getElementById("previous-guesses");
  const hint = document.getElementById("hint");
  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultMessage = document.getElementById("result-message");
  const targetNumber = document.getElementById("target-number");
  const bestScore = document.getElementById("best-score");

  // Variables du jeu
  let target;
  let maxNumber;
  let maxAttempts;
  let attemptsLeft;
  let guesses = [];
  let gameActive = false;

  // Initialiser le meilleur score depuis localStorage
  if (!localStorage.getItem("bestScore")) {
    localStorage.setItem("bestScore", "N/A");
  }

  // Événements
  startBtn.addEventListener("click", startGame);
  guessBtn.addEventListener("click", makeGuess);
  restartBtn.addEventListener("click", resetGame);
  guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") makeGuess();
  });

  // Démarrer le jeu
  function startGame() {
    maxNumber = parseInt(maxNumberInput.value);
    maxAttempts = parseInt(maxAttemptsInput.value);

    if (isNaN(maxNumber)) maxNumber = 100;
    if (isNaN(maxAttempts)) maxAttempts = 7;

    // Limites
    maxNumber = Math.min(Math.max(maxNumber, 10), 1000);
    maxAttempts = Math.min(Math.max(maxAttempts, 3), 20);

    target = Math.floor(Math.random() * maxNumber) + 1;
    attemptsLeft = maxAttempts;
    guesses = [];

    // Mettre à jour l'affichage
    rangeDisplay.textContent = `1-${maxNumber}`;
    attemptsDisplay.textContent = attemptsLeft;
    previousGuesses.textContent = "";
    hint.textContent = "";

    // Basculer vers l'écran de jeu
    setupScreen.style.display = "none";
    gameScreen.style.display = "block";
    resultScreen.style.display = "none";

    gameActive = true;
    guessInput.focus();
  }

  // Faire une supposition
  function makeGuess() {
    if (!gameActive) return;

    const guess = parseInt(guessInput.value);

    // Validation
    if (isNaN(guess)) {
      hint.textContent = "Veuillez entrer un nombre valide";
      return;
    }

    if (guess < 1 || guess > maxNumber) {
      hint.textContent = `Veuillez entrer un nombre entre 1 et ${maxNumber}`;
      return;
    }

    // Ajouter à l'historique
    guesses.push(guess);
    previousGuesses.textContent = guesses.join(", ");

    // Vérifier la supposition
    if (guess === target) {
      endGame(true);
      return;
    }

    // Donner un indice
    attemptsLeft--;
    attemptsDisplay.textContent = attemptsLeft;

    if (guess < target) {
      hint.textContent = "Trop bas! Essayez un nombre plus élevé.";
    } else {
      hint.textContent = "Trop haut! Essayez un nombre plus bas.";
    }

    // Vérifier si le jeu est terminé
    if (attemptsLeft === 0) {
      endGame(false);
    }

    guessInput.value = "";
    guessInput.focus();
  }

  // Terminer le jeu
  function endGame(win) {
    gameActive = false;

    // Mettre à jour le meilleur score
    const currentBest = localStorage.getItem("bestScore");
    const attemptsUsed = maxAttempts - attemptsLeft;

    if (win) {
      if (currentBest === "N/A" || attemptsUsed < parseInt(currentBest)) {
        localStorage.setItem("bestScore", attemptsUsed.toString());
      }
    }

    // Afficher le résultat
    gameScreen.style.display = "none";
    resultScreen.style.display = "block";

    if (win) {
      resultIcon.style.backgroundImage =
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzM0YWE1MyIgZD0iTTEyLDJBMTAsMTAgMCAwLDAgMiwxMkExMCwxMCAwIDAsMCAxMiwyMkExMCwxMCAwIDAsMCAyMiwxMkExMCwxMCAwIDAsMCAxMiwyTTEwLDE3TDUsMTJMNi40MSwxMC41OUwxMCwxNC4xN0wxNy41OSw2LjU4TDE5LDhMMTAsMTdaIi8+PC9zdmc+")';
      resultTitle.textContent = "Félicitations!";
      resultMessage.textContent = `Vous avez trouvé le nombre en ${attemptsUsed} tentative${
        attemptsUsed > 1 ? "s" : ""
      }!`;
      resultIcon.classList.add("celebration");
    } else {
      resultIcon.style.backgroundImage =
        'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2VhNDMzNSIgZD0iTTEyLDJBMTAsMTAgMCAwLDAgMiwxMkExMCwxMCAwIDAsMCAxMiwyMkExMCwxMCAwIDAsMCAyMiwxMkExMCwxMCAwIDAsMCAxMiwyTTEwLDE3TDUsMTJMNy41OSw5LjQxTDEyLDEzLjgzTDE2LjQxLDkuNDFMMTksMTJMMTQsMTdMMTAsMTdaIi8+PC9zdmc+")';
      resultTitle.textContent = "Dommage!";
      resultMessage.textContent = `Vous n'avez pas trouvé le nombre ${target}.`;
      resultIcon.classList.add("disappointed");
    }

    targetNumber.textContent = target;
    bestScore.textContent = localStorage.getItem("bestScore");
  }

  // Réinitialiser le jeu
  function resetGame() {
    resultIcon.classList.remove("celebration", "disappointed");
    setupScreen.style.display = "block";
    gameScreen.style.display = "none";
    resultScreen.style.display = "none";
  }
});

// DOM Elements (assuming you have these in your HTML)
const questionContainer = document.getElementById('question-container');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const highScoreEl = document.getElementById('high-score'); // An element to display high score

// Game Variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timerId = null;

// On page load
document.addEventListener('DOMContentLoaded', () => {
  loadQuestions();
  restartButton.addEventListener('click', startGame);

  // Display any previously saved high score
  const savedHighScore = localStorage.getItem('highScore') || 0;
  highScoreEl.textContent = `High Score: ${savedHighScore}`;
});

async function loadQuestions() {
  try {
    // Use a RAW GitHub link or any public URL that returns JSON
    const response = await fetch('https://raw.githubusercontent.com/jtb21091/PittsburghTrivia/main/questions_converted.json');
    if (!response.ok) throw new Error('Network response was not OK');
    
    const data = await response.json();
    questions = shuffleArray(data);
    startGame();
  } catch (error) {
    console.error('Error loading questions:', error);
    // Could display an error message to the user
  }
}

function startGame() {
  currentQuestionIndex = 0;
  score = 0;
  updateScore();
  nextButton.style.display = 'none';
  showQuestion();
}

function showQuestion() {
  if (currentQuestionIndex >= questions.length) {
    endGame();
    return;
  }

  clearInterval(timerId);
  timeLeft = 10;
  updateTimer();

  const questionObj = questions[currentQuestionIndex];
  questionContainer.innerHTML = `<h2>${questionObj.Question}</h2>`;

  const choices = [
    questionObj['Choice 1'],
    questionObj['Choice 2'],
    questionObj['Choice 3']
  ].filter(Boolean); // Just in case a choice is missing
  const shuffledChoices = shuffleArray(choices);

  const choicesDiv = document.createElement('div');
  shuffledChoices.forEach(choiceText => {
    const button = document.createElement('button');
    button.textContent = choiceText;
    button.classList.add('choice');
    button.addEventListener('click', () => checkAnswer(choiceText, questionObj.Answer));
    choicesDiv.appendChild(button);
  });

  questionContainer.appendChild(choicesDiv);

  timerId = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerId);
      nextQuestion();
    }
  }, 1000);
}

function checkAnswer(selected, correct) {
  clearInterval(timerId);

  document.querySelectorAll('.choice').forEach(button => {
    button.disabled = true;
    if (button.textContent === correct) {
      button.classList.add('correct');
    } else {
      button.classList.add('incorrect');
    }
  });

  if (selected === correct) {
    score++;
    updateScore();
  }

  setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

// END GAME
function endGame() {
  clearInterval(timerId);
  questionContainer.innerHTML = `
    <h2>Game Over!</h2>
    <p>Your final score: ${score}</p>
  `;

  // Check if we have a new high score
  const savedHighScore = Number(localStorage.getItem('highScore')) || 0;
  if (score > savedHighScore) {
    // We have a new high score - update localStorage
    localStorage.setItem('highScore', score);
  }

  // Display updated high score
  const updatedHighScore = localStorage.getItem('highScore');
  highScoreEl.textContent = `High Score: ${updatedHighScore}`;

  nextButton.style.display = 'none';
}

// Update score
function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

// Update timer
function updateTimer() {
  timerEl.textContent = `Time Left: ${timeLeft}s`;
}

// Shuffle helper
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

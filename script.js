let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 10;
let timer;

// Fetch the questions from JSON file hosted on GitHub Pages
fetch('https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/main/questions_converted.json')
    .then(response => response.json())
    .then(data => {
        questions = shuffleArray(data);
        startGame();
    })
    .catch(error => console.error('Error loading questions:', error));

// Utility function to shuffle questions
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start the game
function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('next-button').style.display = "none";
    showQuestion();
}

// Show the current question
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }

    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;

    const questionObj = questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `<h2>${questionObj.Question}</h2>`;

    const choicesDiv = document.createElement('div');
    [questionObj["Choice 1"], questionObj["Choice 2"], questionObj["Choice 3"]].forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice');
        button.onclick = () => checkAnswer(choice, questionObj.Answer);
        choicesDiv.appendChild(button);
    });

    questionContainer.appendChild(choicesDiv);
    
    // Start timer countdown
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Check if the selected answer is correct
function checkAnswer(selected, correct) {
    clearInterval(timer);

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
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    setTimeout(nextQuestion, 2000);
}

// Move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endGame();
    }
}

// End the game and display the final score
function endGame() {
    document.getElementById('question-container').innerHTML = `<h2>Game Over!</h2><p>Your final score: ${score}</p>`;
    document.getElementById('next-button').style.display = "none";
}

// Restart the game
document.getElementById('restart-button').addEventListener('click', startGame);

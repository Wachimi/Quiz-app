// =========================================
// APP.JS - Logika Quizu
// =========================================

import { fetchQuestions } from './api.js';
import {
    showScreen,
    renderQuestion,
    showAnswerResult,
    showTimeoutResult,
    updateTimer,
    renderResults,
    renderHistory
} from './ui.js';
import {
    decodeHTML,
    shuffleArray,
    formatDateTime,
    calcPercent,
    getRating
} from './utils.js';

// =========================================
// STAN GRY
// =========================================

const state = {
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    timerInterval: null,
    timeLeft: 0,
    totalTime: 0,
    TIMER_SECONDS: 15
};

const HISTORY_KEY = 'quizApp_history';

// =========================================
// INICJALIZACJA
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    showScreen('start');
    renderHistory(getHistory());
    initEventListeners();
    console.log('🧠 Quiz App załadowana!');
});

function initEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    document.getElementById('playAgainBtn').addEventListener('click', startQuiz);
    document.getElementById('goHomeBtn').addEventListener('click', goHome);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

    // Delegacja eventów dla odpowiedzi
    document.getElementById('answersGrid').addEventListener('click', (e) => {
        const btn = e.target.closest('.answer-btn');
        if (btn && !btn.disabled) handleAnswer(btn);
    });
}

// =========================================
// ROZPOCZĘCIE QUIZU
// =========================================

async function startQuiz() {
    const category = document.getElementById('categorySelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    const count = parseInt(document.getElementById('questionCount').value);

    showScreen('loading');

    try {
        const rawQuestions = await fetchQuestions({ count, category, difficulty });

        // Przetwórz pytania
        state.questions = rawQuestions.map(q => ({
            question: decodeHTML(decodeURIComponent(q.question)),
            correct: decodeHTML(decodeURIComponent(q.correct_answer)),
            category: decodeHTML(decodeURIComponent(q.category)),
            difficulty: q.difficulty,
            answers: shuffleArray([
                ...q.incorrect_answers.map(a => decodeHTML(decodeURIComponent(a))),
                decodeHTML(decodeURIComponent(q.correct_answer))
            ])
        }));

        // Resetuj stan
        state.currentIndex = 0;
        state.score = 0;
        state.answers = [];
        state.totalTime = 0;

        showScreen('question');
        showQuestion();

    } catch (error) {
        console.error('Błąd:', error);
        showScreen('start');
        alert(`Błąd: ${error.message}`);
    }
}

// =========================================
// PYTANIA I TIMER
// =========================================

function showQuestion() {
    const question = state.questions[state.currentIndex];
    renderQuestion(
        question,
        state.currentIndex + 1,
        state.questions.length,
        state.score
    );

    startTimer();
}

function startTimer() {
    state.timeLeft = state.TIMER_SECONDS;
    updateTimer(state.timeLeft);

    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        state.totalTime++;
        updateTimer(state.timeLeft);

        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(state.timerInterval);
    state.totalTime += (state.TIMER_SECONDS - state.timeLeft);
}

// =========================================
// OBSŁUGA ODPOWIEDZI
// =========================================

function handleAnswer(btn) {
    stopTimer();

    const question = state.questions[state.currentIndex];
    const selected = btn.dataset.answer;
    const isCorrect = selected === question.correct;

    if (isCorrect) state.score++;

    // Zapisz odpowiedź
    state.answers.push({
        question: question.question,
        selected,
        correct: question.correct,
        isCorrect
    });

    // Pokaż wynik
    showAnswerResult(btn, question.correct);

    // Następne pytanie po 1.5s
    setTimeout(nextQuestion, 1500);
}

function handleTimeout() {
    const question = state.questions[state.currentIndex];

    state.answers.push({
        question: question.question,
        selected: null,
        correct: question.correct,
        isCorrect: false
    });

    showTimeoutResult(question.correct);
    setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
    state.currentIndex++;

    if (state.currentIndex < state.questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

// =========================================
// KONIEC QUIZU
// =========================================

function endQuiz() {
    const correct = state.answers.filter(a => a.isCorrect).length;
    const total = state.questions.length;
    const percent = calcPercent(correct, total);
    const rating = getRating(percent);

    // Zapisz do historii
    saveToHistory({
        correct,
        total,
        percent,
        category: state.questions[0]?.category || 'Różne',
        difficulty: state.questions[0]?.difficulty || 'Losowa',
        date: formatDateTime()
    });

    renderResults({
        correct,
        total,
        totalTime: state.totalTime,
        answers: state.answers,
        rating
    });

    showScreen('results');
}

// =========================================
// NAWIGACJA
// =========================================

function goHome() {
    renderHistory(getHistory());
    showScreen('start');
}

// =========================================
// HISTORIA - LOCAL STORAGE
// =========================================

function getHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

function saveToHistory(result) {
    const history = getHistory();
    history.unshift(result);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory([]);
}
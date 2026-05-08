// =========================================
// UI.JS - Renderowanie interfejsu
// =========================================

import { ANSWER_LABELS } from './utils.js';

const SCREENS = ['start', 'loading', 'question', 'results'];

// ===== PRZEŁĄCZANIE EKRANÓW =====

export function showScreen(name) {
    SCREENS.forEach(s => {
        const el = document.getElementById(`screen-${s}`);
        el.classList.toggle('active', s === name);
        if (s !== name) el.style.display = 'none';
    });

    const target = document.getElementById(`screen-${name}`);
    target.style.display = 'flex';
    target.classList.add('active');
}

// ===== PYTANIE =====

export function renderQuestion(question, current, total, score) {
    // Pasek postępu
    const progress = (current / total) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionNum').textContent = `Pytanie ${current}/${total}`;
    document.getElementById('scoreDisplay').textContent = `Wynik: ${score}`;

    // Kategoria i pytanie
    document.getElementById('categoryBadge').textContent = `📂 ${question.category}`;
    document.getElementById('questionText').textContent = question.question;

    // Odpowiedzi
    const grid = document.getElementById('answersGrid');
    grid.innerHTML = question.answers.map((answer, i) => `
        <button class="answer-btn" data-answer="${answer}">
            <span class="answer-label">${ANSWER_LABELS[i]}</span>
            <span>${answer}</span>
        </button>
    `).join('');
}

// ===== WYNIK ODPOWIEDZI =====

export function showAnswerResult(selectedBtn, correctAnswer) {
    const allBtns = document.querySelectorAll('.answer-btn');

    allBtns.forEach(btn => {
        btn.disabled = true;
        const answer = btn.dataset.answer;

        if (answer === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn === selectedBtn) {
            btn.classList.add('incorrect');
        }
    });
}

export function showTimeoutResult(correctAnswer) {
    const allBtns = document.querySelectorAll('.answer-btn');

    allBtns.forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.answer === correctAnswer) {
            btn.classList.add('reveal');
        }
    });
}

// ===== TIMER =====

export function updateTimer(seconds) {
    const circle = document.getElementById('timerCircle');
    document.getElementById('timerText').textContent = seconds;

    circle.className = 'timer-circle';
    if (seconds <= 5) circle.classList.add('danger');
    else if (seconds <= 8) circle.classList.add('warning');
}

// ===== WYNIKI KOŃCOWE =====

export function renderResults(stats) {
    const { correct, total, totalTime, answers, rating } = stats;
    const percent = Math.round((correct / total) * 100);

    document.getElementById('resultEmoji').textContent = rating.emoji;
    document.getElementById('resultTitle').textContent = rating.title;
    document.getElementById('resultSubtitle').textContent = rating.sub;
    document.getElementById('finalScore').textContent = `${correct}/${total}`;
    document.getElementById('finalPercent').textContent = `${percent}%`;
    document.getElementById('finalTime').textContent = `${totalTime}s`;

    // Podsumowanie odpowiedzi
    document.getElementById('answersSummary').innerHTML =
        answers.map((a, i) => `
            <div class="summary-item">
                <div class="summary-question">${i + 1}. ${a.question}</div>
                <div class="summary-answer ${a.isCorrect ? 'correct' : 'incorrect'}">
                    ${a.isCorrect ? '✅' : '❌'}
                    ${a.isCorrect ? a.correct : `${a.selected || 'Brak odpowiedzi'} → Poprawna: ${a.correct}`}
                </div>
            </div>
        `).join('');
}

// ===== HISTORIA =====

export function renderHistory(history) {
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');

    if (!history.length) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    list.innerHTML = history.slice(0, 5).map(item => `
        <div class="history-item">
            <span>${item.category} · ${item.difficulty}</span>
            <span class="history-score">${item.correct}/${item.total} (${item.percent}%)</span>
            <span class="history-date">${item.date}</span>
        </div>
    `).join('');
}
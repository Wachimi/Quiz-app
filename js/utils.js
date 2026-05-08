// =========================================
// UTILS.JS - Funkcje pomocnicze
// =========================================

// Open Trivia DB zwraca tekst zakodowany w HTML
// np. &quot; zamiast ", &amp; zamiast &
export function decodeHTML(text) {
    const el = document.createElement('div');
    el.innerHTML = text;
    return el.textContent;
}

// Losowe przemieszanie tablicy (algorytm Fisher-Yates)
export function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Formatowanie daty do historii
export function formatDateTime() {
    return new Date().toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Procentowy wynik
export function calcPercent(correct, total) {
    return Math.round((correct / total) * 100);
}

// Ocena wyniku - emoji i tytuł
export function getRating(percent) {
    if (percent === 100) return { emoji: '🏆', title: 'Perfekcyjny wynik!', sub: 'Niesamowite! Odpowiedziałeś na wszystkie pytania poprawnie!' };
    if (percent >= 80) return { emoji: '🌟', title: 'Świetny wynik!', sub: 'Doskonała robota! Jesteś ekspertem!' };
    if (percent >= 60) return { emoji: '👍', title: 'Dobry wynik!', sub: 'Nieźle! Jest jeszcze trochę do poprawki.' };
    if (percent >= 40) return { emoji: '📚', title: 'Trzeba poćwiczyć!', sub: 'Spróbuj jeszcze raz, możesz lepiej!' };
    return { emoji: '💪', title: 'Nie poddawaj się!', sub: 'Nauka wymaga czasu. Spróbuj ponownie!' };
}

// Etykiety A, B, C, D
export const ANSWER_LABELS = ['A', 'B', 'C', 'D'];
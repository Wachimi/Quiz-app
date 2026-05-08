// =========================================
// API.JS - Open Trivia Database
// Darmowe, bez klucza API
// =========================================

const BASE_URL = 'https://opentdb.com/api.php';

export async function fetchQuestions({ count = 10, category = '', difficulty = '' }) {
    const params = new URLSearchParams({
        amount: count,
        type: 'multiple',    // Pytania wielokrotnego wyboru
        encode: 'url3986'    // Enkodowanie URL dla specjalnych znaków
    });

    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
    }

    const data = await response.json();

    // Kody odpowiedzi Open Trivia DB:
    // 0 = OK, 1 = brak pytań, 2 = zły parametr
    if (data.response_code === 1) {
        throw new Error('Brak pytań dla wybranych ustawień. Spróbuj zmienić kategorię lub trudność.');
    }

    if (data.response_code !== 0) {
        throw new Error(`Błąd API: ${data.response_code}`);
    }

    return data.results;
}
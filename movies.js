const API_KEY = '54f12556eceb4c2c8b7a94e3e8d8d787';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Variabili per gestire l'infinite scroll
let currentPage = 1;
let isLoading = false;

// Funzione per caricare i film (sia per categoria che per ricerca)
async function loadMovies(page = 1, category = 'now_playing', genreId = null) {
    if (isLoading) return;  // Evita chiamate simultanee se è già in corso il caricamento
    isLoading = true;

    let url = `${API_URL}/movie/${category}?api_key=${API_KEY}&page=${page}`;
    if (genreId) {
        url = `${API_URL}/discover/movie?api_key=${API_KEY}&page=${page}&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Funzione per visualizzare i film
    displayMovies(data.results, 'catalogContainer');
    currentPage++;

    isLoading = false;
}

// Funzione per visualizzare i film nella pagina
function displayMovies(movies, sectionId) {
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML += movies.map(movie => {
        const posterUrl = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image';
        return `
            <div class="movie-card" onclick="viewMovieDetails(${movie.id})">
                <img src="${posterUrl}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            </div>
        `;
    }).join('');
}

// Funzione per visualizzare i dettagli del film
async function viewMovieDetails(movieId) {
    const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=it`);
    const movie = await response.json();

    const detailsDiv = document.getElementById('movieDetails');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = `
        <button onclick="goBack()">Torna alla Home</button>
        <h2>${movie.title}</h2>
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <p><strong>Descrizione:</strong> ${movie.overview || 'Descrizione non disponibile'}</p>
    `;
    document.getElementById('home').style.display = 'none';
}

// Funzione per tornare alla home
function goBack() {
    document.getElementById('movieDetails').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

// Aggiungi un evento per la ricerca dei film
document.getElementById('searchBar').addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query) {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        displayMovies(data.results, 'catalogContainer');
    } else {
        loadMovies(currentPage);  // Carica i film in base alla pagina corrente
    }
});

// Aggiungi un evento per il filtro per genere
document.getElementById('genreSelect').addEventListener('change', async (e) => {
    const genreId = e.target.value;
    if (genreId) {
        loadMovies(currentPage, 'now_playing', genreId);
    } else {
        loadMovies(currentPage, 'now_playing');
    }
});

// Funzione per gestire lo scroll e caricare nuovi film
window.addEventListener('scroll', () => {
    // Quando si arriva alla fine della pagina, carica altri film
    const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
    if (nearBottom && !isLoading) {
        loadMovies(currentPage);
    }
});

// Carica inizialmente i film
loadMovies(currentPage);


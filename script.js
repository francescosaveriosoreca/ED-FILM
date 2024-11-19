const API_KEY = '54f12556eceb4c2c8b7a94e3e8d8d787';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Generi disponibili
const GENRES = {
    28: "Azione",
    35: "Commedia",
    18: "Drammatico",
    12: "Avventura", // Adventure
    14: "Fantasy", // Fantasy
    16: "Animazione", // Animation
    27: "Horror", // Horror
    53: "Thriller", // Thriller
    80: "Crimine", // Crime
    878: "Fantascienza", // Science Fiction
    9648: "Mistero", // Mystery
    10749: "Romantico", // Romance
    10402: "Musicale", // Music
    37: "Western" // Western
};

// Carica i generi nel menu a tendina
function loadGenres() {
    const genreSelect = document.getElementById('genreSelect');
    for (const [id, name] of Object.entries(GENRES)) {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = name;
        genreSelect.appendChild(option);
    }
}

// Carica le sezioni della home
async function loadHomeSections() {
    await loadMoviesByCategory('now_playing', 'latest');
    await loadMoviesByCategory('popular', 'popular');
    await loadMoviesByGenre(28, 'action'); // Azione
    await loadMoviesByGenre(35, 'comedy'); // Commedia
    await loadMoviesByGenre(18, 'drama'); // Drammatico
}

// Carica i film per categoria
async function loadMoviesByCategory(category, sectionId) {
    const response = await fetch(`${API_URL}/movie/${category}?api_key=${API_KEY}`);
    const data = await response.json();
    displayCatalog(data.results, sectionId);
}

// Carica i film per genere
async function loadMoviesByGenre(genreId, sectionId) {
    const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    const data = await response.json();
    displayCatalog(data.results, sectionId);
}

// Mostra il catalogo
function displayCatalog(movies, sectionId) {
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="viewMovieDetails(${movie.id})">
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        </div>
    `).join('');
}

// Filtra i film per genere
document.getElementById('genreSelect').addEventListener('change', async (e) => {
    const genreId = e.target.value;
    if (genreId) {
        const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
        const data = await response.json();
        displayCatalog(data.results, 'home'); // Mostra nel catalogo generale
    } else {
        loadHomeSections(); // Ricarica le sezioni della home
    }
});

// Cerca film tramite la barra di ricerca
document.getElementById('searchBar').addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query) {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        displayCatalog(data.results, 'home');
    } else {
        loadHomeSections();
    }
});

// Mostra i dettagli di un film
async function viewMovieDetails(movieId) {
    const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();

    const detailsDiv = document.getElementById('movieDetails');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = `
        <button onclick="goBack()">Torna alla Home</button>
        <h2>${movie.title}</h2>
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <p><strong>Descrizione:</strong> ${movie.overview || 'Non disponibile'}</p>
    `;
    document.getElementById('home').style.display = 'none';
}

// Torna alla home
function goBack() {
    document.getElementById('movieDetails').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

// Inizializza la pagina
loadGenres();
loadHomeSections();


const API_KEY = '54f12556eceb4c2c8b7a94e3e8d8d787';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

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

// Cerca film tramite la barra di ricerca
document.getElementById('searchBar').addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query) {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        displayCatalog(data.results, 'catalogContainer');
    } else {
        loadMoviesByCategory('now_playing', 'catalogContainer'); // Carica le ultime uscite
    }
});

// Filtra per genere selezionato
document.getElementById('genreSelect').addEventListener('change', async (e) => {
    const genreId = e.target.value;
    if (genreId) {
        loadMoviesByGenre(genreId, 'catalogContainer');
    } else {
        loadMoviesByCategory('now_playing', 'catalogContainer'); // Ricarica le ultime uscite
    }
});

// Mostra i dettagli del film
async function viewMovieDetails(movieId) {
    // Aggiungiamo il parametro language=it per ottenere la descrizione in italiano
    const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=it`);
    const movie = await response.json();

    // Ottieni il trailer del film
    const videoResponse = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=it`);
    const videoData = await videoResponse.json();

    // Trova il trailer tra i video
    const trailer = videoData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

    // Mostra i dettagli del film e il trailer (se disponibile)
    const detailsDiv = document.getElementById('movieDetails');
    detailsDiv.style.display = 'block';
    detailsDiv.innerHTML = `
        <button onclick="goBack()">Torna alla Home</button>
        <h2>${movie.title}</h2>
        <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
        <p><strong>Descrizione:</strong> ${movie.overview || 'Descrizione non disponibile'}</p>
        ${trailer ? `
            <h3>Trailer</h3>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        ` : '<p>Trailer non disponibile</p>'}
        <div>
            <label for="review">Recensione:</label>
            <textarea id="review" placeholder="Aggiungi una recensione..." rows="4" cols="50"></textarea>
            <button onclick="submitReview()">Invia Recensione</button>
        </div>
    `;
    document.getElementById('home').style.display = 'none';
}

// Torna alla home
function goBack() {
    document.getElementById('movieDetails').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

// Funzione per inviare una recensione (simulazione)
function submitReview() {
    const review = document.getElementById('review').value;
    if (review) {
        alert(`Recensione inviata: ${review}`);
    } else {
        alert('Inserisci una recensione prima di inviarla.');
    }
}

// Inizializza la pagina con le ultime uscite
loadMoviesByCategory('now_playing', 'catalogContainer');

const API_KEY = '54f12556eceb4c2c8b7a94e3e8d8d787';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let isLoading = false; 
let isSearching = false; 
const sectionId = 'catalogContainer';

// Carica i film per categoria
async function loadMoviesByCategory(category) {
    try {
        const response = await fetch(`${API_URL}/movie/${category}?api_key=${API_KEY}&page=${currentPage}`);
        const data = await response.json();
        displayCatalog(data.results, sectionId);
    } catch (error) {
        console.error('Errore durante il caricamento dei film per categoria:', error);
    }
}

// Carica i film per genere
async function loadMoviesByGenre(genreId) {
    try {
        const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${currentPage}`);
        const data = await response.json();
        displayCatalog(data.results, sectionId);
    } catch (error) {
        console.error('Errore durante il caricamento dei film per genere:', error);
    }
}

// Mostra il catalogo
function displayCatalog(movies, sectionId) {
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML += movies
        .map(
            movie => `
        <div class="movie-card" onclick="viewMovieDetails(${movie.id})">
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || 'Titolo non disponibile'}">
            <h3>${movie.title || 'Titolo non disponibile'}</h3>
        </div>`
        )
        .join('');
}

// Cerca film tramite la barra di ricerca
document.getElementById('searchBar').addEventListener('input', async (e) => {
    const query = encodeURIComponent(e.target.value.trim());
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML = '';

    if (query) {
        currentPage = 1;
        isSearching = true;
        try {
            const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
            const data = await response.json();
            displayCatalog(data.results, sectionId);
        } catch (error) {
            console.error('Errore durante la ricerca dei film:', error);
        }
    } else {
        isSearching = false;
        loadMoviesByCategory('now_playing');
    }
});

// Filtra per genere selezionato
document.getElementById('genreSelect').addEventListener('change', async (e) => {
    const genreId = e.target.value;
    currentPage = 1;
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML = '';

    if (genreId) {
        loadMoviesByGenre(genreId);
    } else {
        loadMoviesByCategory('now_playing');
    }
});

// Mostra i dettagli del film
async function viewMovieDetails(movieId) {
    try {
        const response = await fetch(`${API_URL}/movie/${movieId}?api_key=${API_KEY}&language=it`);
        const movie = await response.json();
        const videoResponse = await fetch(`${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=it`);
        const videoData = await videoResponse.json();
        const trailer = videoData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

        const detailsDiv = document.getElementById('movieDetails');
        detailsDiv.style.display = 'block';
        detailsDiv.innerHTML = `
            <button onclick="goBack()">Torna alla Home</button>
            <h2>${movie.title || 'Titolo non disponibile'}</h2>
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || 'Titolo non disponibile'}">
            <p><strong>Descrizione:</strong> ${movie.overview || 'Descrizione non disponibile'}</p>
            ${trailer ? `
                <h3>Trailer</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
            ` : '<p>Trailer non disponibile</p>'}
        `;
        document.getElementById('home').style.display = 'none';
    } catch (error) {
        console.error('Errore durante il caricamento dei dettagli del film:', error);
    }
}

// Torna alla home
function goBack() {
    document.getElementById('movieDetails').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

// Caricare l'immagine del profilo salvata
window.onload = function () {
    const savedImage = localStorage.getItem("profileImage");
    const profileImageElement = document.getElementById("profileImage");

    if (savedImage) {
        profileImageElement.src = savedImage;
    }
};

// Event listener per lo scroll
window.addEventListener('scroll', () => {
    if (!isSearching && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreMovies();
    }
});

// Inizializza la pagina con le ultime uscite
loadMoviesByCategory('now_playing');

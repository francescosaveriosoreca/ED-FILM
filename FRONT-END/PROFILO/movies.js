const API_KEY = '54f12556eceb4c2c8b7a94e3e8d8d787';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

let currentPage = 1;
let isLoading = false; // Stato di caricamento
let isSearching = false; // Controlla se è in corso una ricerca
const sectionId = 'catalogContainer'; // ID della sezione del catalogo

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
    catalog.innerHTML = ''; // Resetta il catalogo

    if (query) {
        currentPage = 1;
        isSearching = true; // Attiva modalità ricerca
        try {
            const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
            const data = await response.json();
            displayCatalog(data.results, sectionId);
        } catch (error) {
            console.error('Errore durante la ricerca dei film:', error);
        }
    } else {
        isSearching = false; // Disattiva modalità ricerca
        loadMoviesByCategory('now_playing');
    }
});

// Filtra per genere selezionato
document.getElementById('genreSelect').addEventListener('change', async (e) => {
    const genreId = e.target.value;
    currentPage = 1;
    const catalog = document.querySelector(`#${sectionId} .catalog`);
    catalog.innerHTML = ''; // Resetta il catalogo

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

        const providersResponse = await fetch(`${API_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}&language=it`);
        const providersData = await providersResponse.json();
        console.log(providersData); // Aggiungi un log per vedere i dati ricevuti dai provider

        const providers = providersData.results?.IT; // Italia

        const detailsDiv = document.getElementById('movieDetails');
        detailsDiv.style.display = 'block';
        detailsDiv.innerHTML = `
            <button onclick="goBack()">Torna alla Home</button>
            <h2>${movie.title || 'Titolo non disponibile'}</h2>
            <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title || 'Titolo non disponibile'}">
            <p><strong>Descrizione:</strong> ${movie.overview || 'Descrizione non disponibile'}</p>
            
            ${providers ? `
                <div>
                    <h3>Disponibilità in Streaming:</h3>
                    <ul>
                        ${Object.entries(providers).map(([platform, details]) => `
                            <li><strong>${platform}:</strong> ${details.link ? `<a href="${details.link}" target="_blank">Vai al sito</a>` : 'Non disponibile online'}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : '<p>Disponibilità in streaming non disponibile</p>'}

            ${trailer ? `
                <h3>Trailer</h3>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
            ` : '<p>Trailer non disponibile</p>'}
            
            <div>
                <label for="review">Recensione:</label>
                <textarea id="review" placeholder="Aggiungi una recensione..." rows="4" cols="50"></textarea>
                <button onclick="submitReview()">Invia Recensione</button>
            </div>
            <div id="reviewList">
                <h3>Recensioni Recenti:</h3>
            </div>
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

// Funzione per inviare una recensione
function submitReview() {
    const reviewInput = document.getElementById("review");
    const reviewText = reviewInput.value.trim();
    const username = localStorage.getItem("username") || "DefaultUser";

    if (reviewText) {
        const review = {
            username: username,
            text: reviewText,
            date: new Date().toLocaleString(),
        };

        // Recupera le recensioni esistenti da localStorage
        let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
        reviews.push(review); // Aggiungi la nuova recensione
        localStorage.setItem("reviews", JSON.stringify(reviews)); // Salva l'array aggiornato in localStorage

        displayReviews(); // Mostra tutte le recensioni aggiornate
        alert("Recensione inviata con successo!");
        reviewInput.value = ''; // Resetta il campo di input
    } else {
        alert("Inserisci una recensione prima di inviarla.");
    }
}

// Funzione per mostrare tutte le recensioni salvate
function displayReviews() {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || []; // Ottieni tutte le recensioni salvate
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = ''; // Resetta il contenitore

    reviews.forEach(review => {
        const reviewItem = `
            <div class="review-item">
                <p><strong>${review.username}</strong> (${review.date}):</p>
                <p>${review.text}</p>
            </div>
        `;
        reviewList.innerHTML += reviewItem; // Aggiungi ogni recensione al contenitore
    });
}

// Funzione per caricare e visualizzare tutte le recensioni salvate
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const reviewList = document.getElementById("reviewList");
    reviewList.innerHTML = ''; // Resetta il contenitore delle recensioni

    reviews.forEach(review => addReviewToDOM(review)); // Aggiungi ogni recensione al DOM
}

// Caricamento iniziale delle recensioni
window.onload = function () {
    const savedImage = localStorage.getItem("profileImage");
    const profileImageElement = document.getElementById("profileImage");

    if (savedImage) {
        profileImageElement.src = savedImage;
    }

    displayReviews(); // Mostra tutte le recensioni salvate
};

// Funzione per caricare più film
async function loadMoreMovies() {
    if (isLoading || isSearching) return;

    isLoading = true;
    try {
        const response = await fetch(`${API_URL}/movie/now_playing?api_key=${API_KEY}&page=${currentPage}`);
        const data = await response.json();
        displayCatalog(data.results, sectionId);
        currentPage++;
    } catch (error) {
        console.error('Errore durante il caricamento dei film:', error);
    } finally {
        isLoading = false;
    }
}

// Event listener per lo scroll
window.addEventListener('scroll', () => {
    if (!isSearching && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreMovies();
    }
});

// Caricare l'immagine del profilo salvata
window.onload = function () {
    const savedImage = localStorage.getItem("profileImage");
    const profileImageElement = document.getElementById("profileImage");

    if (savedImage) {
        profileImageElement.src = savedImage;
    }
};

// Inizializza la pagina con le ultime uscite
loadMoviesByCategory('now_playing');

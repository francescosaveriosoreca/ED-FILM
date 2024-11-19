// Se desideri aggiungere animazioni o altre funzionalità per la pagina principale, puoi farlo qui.

// Esempio di animazione per il caricamento del contenuto
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    container.style.opacity = 0;
    setTimeout(() => {
        container.style.transition = 'opacity 1s';
        container.style.opacity = 1;
    }, 200);
});
<<<<<<< HEAD

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

=======
>>>>>>> 2be5fdd (.)

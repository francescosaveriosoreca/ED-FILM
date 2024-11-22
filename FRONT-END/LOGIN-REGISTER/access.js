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

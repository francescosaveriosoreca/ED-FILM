// Gestione del form di registrazione
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene il comportamento predefinito del form

    // Ottieni i valori inseriti
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verifica che le password corrispondano
    if (password !== confirmPassword) {
        alert('Le password non corrispondono. Riprova!');
        return;
    }

    // Verifica che tutti i campi siano compilati
    if (username && email && password) {
        // Esegui una simulazione di registrazione
        alert('Registrazione completata con successo!');
        // Qui puoi aggiungere la logica per registrare l'utente (ad esempio, invio al server)
    } else {
        alert('Per favore, compila tutti i campi.');
    }
});

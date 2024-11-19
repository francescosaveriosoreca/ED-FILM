// Gestione del form di login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene il comportamento predefinito del form

    // Ottieni i valori inseriti
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verifica i dati (in questo caso solo una logica di esempio)
    if (email && password) {
        // Esegui una simulazione di login
        alert('Login effettuato con successo!');
        // Qui puoi aggiungere la logica per fare il login effettivo (ad esempio, invio al server)
    } else {
        alert('Per favore, inserisci email e password validi.');
    }
});

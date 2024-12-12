document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Ottieni i valori inseriti
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Verifica che i dati siano stati inseriti
    if (email && password) {
        // Invia i dati al server per il login
        fetch('http://localhost:3000/api/login', { // Assicurati che l'URL sia corretto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Errore HTTP! Stato: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Controlla se il token è presente nella risposta
            if (data.token) {
                localStorage.setItem('token', data.token); // Salva il token in localStorage
                alert('Login effettuato con successo!');
                window.location.href = '../PROFILO/movies.html';
            } else {
                alert('Errore: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Errore durante il login:', error);
            alert('Errore durante il login. Riprova più tardi.');
        });
    } else {
        alert('Per favore, inserisci email e password validi.');
    }
});
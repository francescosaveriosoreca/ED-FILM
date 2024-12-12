
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previene il comportamento predefinito del form

    // Ottieni i valori inseriti dall'utente
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;


    // Funzione per validare l'email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Verifica che tutti i campi siano compilati
    if (!username || !email || !password || !confirmPassword) {
        alert('Per favore, compila tutti i campi.');
        return;
    }

    // Verifica che l'email sia valida
    if (!validateEmail(email)) {
        alert('Inserisci un indirizzo email valido.');
        return;
    }

    // Verifica che la password e la conferma siano uguali
    if (password !== confirmPassword) {
        alert('Le password non corrispondono.');
        return;
    }

    // Oggetto utente da inviare
    const user = {
        username: username,
        email: email,
        password: password
    };

    // Invia i dati al server per la registrazione
    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        console.log('Risposta del server:', response);
        if (!response.ok) {
            throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dati ricevuti dal server:', data);
        if (data.success) {
            alert('Registrazione completata con successo!');
            window.location.href = 'login.html';
        } else {
            alert('Errore: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Errore durante la registrazione:', error);
        alert('Errore durante la registrazione. Riprova più tardi.');
    });
});

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) throw new Error('Credenziali non valide');

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        alert('Login effettuato con successo');
        window.location.href = 'profilo.html';
    } catch (err) {
        alert('Errore durante il login: ' + err.message);
    }
});

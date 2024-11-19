// Aggiungi la classe "visible" ai messaggi di errore quando necessario
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

usernameInput.addEventListener('input', () => {
    const usernameError = document.getElementById('usernameError');
    if (usernameInput.value.length < 3) {
        usernameError.textContent = 'Username troppo corto';
        usernameError.classList.add('visible');
    } else {
        usernameError.textContent = '';
        usernameError.classList.remove('visible');
    }
});

emailInput.addEventListener('input', () => {
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = 'Email non valida';
        emailError.classList.add('visible');
    } else {
        emailError.textContent = '';
        emailError.classList.remove('visible');
    }
});

passwordInput.addEventListener('input', () => {
    const passwordError = document.getElementById('passwordError');
    if (passwordInput.value.length < 6) {
        passwordError.textContent = 'Password troppo corta';
        passwordError.classList.add('visible');
    } else {
        passwordError.textContent = '';
        passwordError.classList.remove('visible');
    }
});

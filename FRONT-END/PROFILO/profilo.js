// Variabili globali
let userProfile = {
    username: localStorage.getItem("username") || "DefaultUser",
    email: "default@example.com",
    profileImage: localStorage.getItem("profileImage") || "https://via.placeholder.com/150"
};

// Caricamento iniziale
window.onload = function () {
    loadProfile();
};

// Funzione per caricare il profilo
function loadProfile() {
    document.getElementById("usernameDisplay").textContent = userProfile.username;
    document.getElementById("emailDisplay").textContent = userProfile.email;
    document.getElementById("profileImage").src = userProfile.profileImage;
}

// Funzione per cambiare l'immagine del profilo
function changeProfilePicture() {
    const newImage = prompt("Inserisci il URL della nuova immagine del profilo:");
    if (newImage) {
        userProfile.profileImage = newImage;
        localStorage.setItem("profileImage", newImage);
        loadProfile();
    }
}

// Funzione per aggiornare il nome utente
function updateUsername() {
    const newUsername = document.getElementById("usernameInput").value.trim();
    if (newUsername) {
        userProfile.username = newUsername;
        localStorage.setItem("username", newUsername);
        alert("Username aggiornato con successo!");
        loadProfile();
    } else {
        alert("Inserisci un nome utente valido.");
    }
}

// Funzione per ripristinare la password
function resetPassword() {
    alert("Una mail di ripristino è stata inviata a: " + userProfile.email);
}


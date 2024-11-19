// Variabili globali
let userProfile = {
    username: "DefaultUser",
    email: "default@example.com",
    profileImage: "https://via.placeholder.com/150"
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
        loadProfile();
    }
}

// Funzione per ripristinare la password
function resetPassword() {
    alert("Una mail di ripristino è stata inviata a: " + userProfile.email);
}

// Funzione per aggiornare l'utente (opzionale, se hai una logica di login)
function updateProfile(username, email) {
    userProfile.username = username;
    userProfile.email = email;
    loadProfile();
}

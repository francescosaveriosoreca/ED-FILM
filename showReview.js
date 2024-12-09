const mongoose = require('mongoose');
const Review = require('./models/Review'); // Assicurati che il percorso sia corretto

// Connessione a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ED-FILM')
    .then(async () => {
        console.log('Connesso a MongoDB');

        try {
            const reviews = await Review.find().populate('userId', 'username email');
            console.log('Recensioni trovate:', reviews);
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni:', error);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('Errore di connessione:', err);
    });

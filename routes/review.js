// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Assicurati di avere il modello Review

// Recupera tutte le recensioni
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero delle recensioni' });
    }
});

// Aggiungi una nuova recensione
router.post('/', async (req, res) => {
    const { movieId, reviewText, rating, userId } = req.body;  // Assumendo che tu riceva questi dati nel corpo della richiesta

    try {
        const newReview = new Review({ movieId, reviewText, rating, userId });
        await newReview.save();
        res.status(201).json({ message: 'Recensione aggiunta con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'aggiunta della recensione' });
    }
});
//midlleware recensioni 
const authMiddleware = require('./middleware/authMiddleware');

app.post('/api/reviews', authMiddleware, async (req, res) => {
    const { movieId, reviewText, rating, userId } = req.body;

    if (!movieId || !reviewText || !rating || !userId) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }

    try {
        const review = new Review({ movieId, reviewText, rating, userId });
        await review.save();
        console.log('Recensione aggiunta:', review);
        res.status(201).json({ message: 'Recensione aggiunta con successo.', review });
    } catch (error) {
        console.error('Errore durante l\'aggiunta della recensione:', error);
        res.status(500).json({ error: 'Errore durante l\'aggiunta della recensione', details: error.message });
    }
});


module.exports = router;

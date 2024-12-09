const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');  // Assicurati di avere il modello Movie
const Review = require('../models/Review');  // Aggiungi l'importazione del modello Review

// Recupera tutti i film
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei film' });
    }
});

// Recupera un film specifico con le recensioni
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Film non trovato' });

        // Recupera le recensioni per questo film
        const reviews = await Review.find({ movieId: req.params.id });

        res.json({ movie, reviews });  // Restituisce sia il film che le recensioni
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del film e delle recensioni' });
    }
});

// Aggiungi un nuovo film
router.post('/', async (req, res) => {
    const newMovie = new Movie(req.body);
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiunta del film' });
    }
});

// Aggiorna un film esistente
router.put('/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMovie) return res.status(404).json({ message: 'Film non trovato' });
        res.json(updatedMovie);
    } catch (error) {
        res.status(400).json({ message: 'Errore nell\'aggiornamento del film' });
    }
});

// Rimuovi un film
router.delete('/:id', async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).json({ message: 'Film non trovato' });
        res.json({ message: 'Film rimosso con successo' });
    } catch (error) {
        res.status(500).json({ message: 'Errore nella rimozione del film' });
    }
});

// Aggiungi una recensione per un film
router.post('/:id/review', async (req, res) => {
    const { username, reviewText } = req.body;

    if (!username || !reviewText) {
        return res.status(400).json({ message: 'Username e recensione sono obbligatori' });
    }

    try {
        const newReview = new Review({
            movieId: req.params.id,  // Collega la recensione al film
            username,
            reviewText
        });

        await newReview.save();
        res.status(201).json(newReview);  // Restituisce la recensione appena salvata
    } catch (error) {
        res.status(500).json({ message: 'Errore nel salvataggio della recensione' });
    }
});

module.exports = router;

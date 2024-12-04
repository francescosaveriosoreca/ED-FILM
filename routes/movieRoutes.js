// routes/movies.js
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie'); // Assicurati di avere il modello Movie

// Recupera tutti i film
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei film' });
    }
});

// Recupera un film specifico
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Film non trovato' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del film' });
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

module.exports = router;
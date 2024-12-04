// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db');
const User = require('./models/User');
const Review = require('./models/Review');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connessione a MongoDB
connectDB();

// Registrazione Utente
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser  = new User({ username, email, password: hashedPassword });
        await newUser .save();
        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante la registrazione' });
    }
});

// Login Utente
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Utente non trovato' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password errata' });

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante il login' });
    }
});

// Aggiunta Recensione
app.post('/api/reviews', async (req, res) => {
    const { movieId, userId, reviewText, rating } = req.body;

    try {
        const newReview = new Review({ movieId, userId, reviewText, rating });
        await newReview.save();
        res.status(201).json({ message: 'Recensione aggiunta con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante l\'aggiunta della recensione' });
    }
});

// Recupero Recensioni
app.get('/api/reviews/:movieId', async (req, res) => {
    const { movieId } = req.params;

    try {
        const reviews = await Review.find({ movieId }).populate('userId', 'username');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Errore durante il recupero delle recensioni' });
    }
});
// Recupero Utenti Registrati
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email'); // Recupera solo username ed email
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Errore durante il recupero degli utenti' });
    }
});
// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});
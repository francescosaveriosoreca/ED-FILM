require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Importa CORS
const User = require('./models/User');
const Review = require('./models/Review');



const app = express();
const PORT = process.env.PORT || 3000;



// Middleware
app.use(bodyParser.json());
app.use(cors()); // Aggiungi il middleware CORS

// Configura il middleware per servire file statici
app.use(express.static('FRONT-END')); // Assicurati che il percorso sia corretto

// Connessione a MongoDB (URI locale)
const uri = 'mongodb://127.0.0.1:27017/ED-FILM'; // Assicurati che MongoDB sia in esecuzione

mongoose.connect(uri)
    .then(() => console.log('Connesso a MongoDB'))
    .catch(err => {
        console.error('Errore di connessione a MongoDB:', err);
        process.exit(1);
    });

// Middleware per la verifica del token JWT
const verifyToken = (req, res, next) => {
    const tokenHeader = req.header('Authorization');
    
    if (!tokenHeader) {
        console.log("Token mancante");
        return res.status(401).json({ error: 'Accesso negato, token mancante' });
    }

    // Separare la parola "Bearer" e il token
    const token = tokenHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token non valido' });
    }

    try {
        console.log("Token ricevuto: ", token);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Imposta l'utente verificato
        next();
    } catch (err) {
        console.log("Errore nella verifica del token: ", err);
        res.status(400).json({ error: 'Token non valido' });
    }
};

// Registrazione Utente
app.post('/api/register', async (req, res) => {
    console.log('Ricevuta richiesta POST a /api/register');
    
    const { username, email, password } = req.body;
    console.log('Dati ricevuti:', { username, email, password });

    try {
        // Controlla se l'email è già registrata
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email già registrata');
            return res.status(400).json({ success: false, error: 'Email già registrata' });
        }

        // Crea una nuova password criptata
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password criptata:', hashedPassword);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log('Utente creato con successo');
        res.status(201).json({ success: true, message: 'Utente registrato con successo' });
    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        if (error.code === 11000) {
            console.log('Errore di email duplicata');
            return res.status(400).json({ success: false, error: 'Email già registrata' });
        }
        res.status(500).json({ success: false, error: 'Errore durante la registrazione', details: error.message });
    }
});

// Login utente 
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    console.log('Richiesta di login ricevuta:', { email }); // Log dell'email ricevuta

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Utente non trovato');
            return res.status(400).json({ error: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password errata');
            return res.status(400).json({ error: 'Password errata' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Login effettuato per l\'utente:', user.username); // Log del nome utente
        res.json({ token });        
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ error: 'Errore durante il login', details: error.message });
    }
});

// Aggiunta Recensione (protetta)
app.post('/api/reviews', async (req, res) => {
    const { movieId, reviewText, rating, userId } = req.body;

    if (!movieId || !reviewText || !rating || !userId) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }

    try {
        const review = new Review({ movieId, reviewText, rating, userId });
        await review.save();
        console.log('Recensione aggiunta:', review); // Per vedere nel terminale
        res.status(201).json({ message: 'Recensione aggiunta con successo.', review });
    } catch (error) {
        console.error('Errore durante l\'aggiunta della recensione:', error);
        res.status(500).json({ error: 'Errore durante l\'aggiunta della recensione', details: error.message });
    }
});

// Recupero tutte le recensioni
app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().populate('userId', 'username email'); // Popola i dati dell'utente
        console.log(reviews); // Mostra nel terminale
        res.json(reviews);    // Risponde al client
    } catch (error) {
        console.error('Errore durante il recupero delle recensioni:', error);
        res.status(500).json({ error: 'Errore durante il recupero delle recensioni', details: error.message });
    }
});


// Modifica recensioni 

app.put('/api/reviews/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.user.id; // Dal token

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Recensione non trovata' });
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Non sei autorizzato a modificare questa recensione' });
        }

        // Aggiorna i campi
        review.reviewText = reviewText || review.reviewText;
        review.rating = rating || review.rating;

        await review.save();
        res.json({ message: 'Recensione aggiornata con successo', review });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante l\'aggiornamento della recensione', details: error.message });
    }
});

// Elimina recensioni 

app.delete('/api/reviews/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ error: 'Recensione non trovata' });
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Non sei autorizzato a eliminare questa recensione' });
        }

        await Review.findByIdAndDelete(id);
        res.json({ message: 'Recensione eliminata con successo' });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante l\'eliminazione della recensione', details: error.message });
    }
});

// Recupero Utenti Registrati
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, 'username email'); // Recupera solo username ed email
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Errore durante il recupero degli utenti', details: error.message });
    }
});

// Calcolo rating medio di un film

app.get('/api/reviews/:movieId/average-rating', async (req, res) => {
    const { movieId } = req.params;

    try {
        const result = await Review.aggregate([
            { $match: { movieId } },
            { $group: { _id: '$movieId', averageRating: { $avg: '$rating' } } },
        ]);

        if (result.length === 0) {
            return res.json({ averageRating: 0, message: 'Nessuna recensione per questo film' });
        }

        res.json({ averageRating: result[0].averageRating });
    } catch (error) {
        res.status(500).json({ error: 'Errore durante il calcolo del rating medio', details: error.message });
    }
});

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});

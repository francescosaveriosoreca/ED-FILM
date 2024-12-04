const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Per analizzare il corpo delle richieste JSON

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/ed-film', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connesso'))
    .catch(err => console.error(err));

// Rotte
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Avvia il server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
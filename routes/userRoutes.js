const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController'); // Importa il controller

// Rotta GET per ottenere tutti gli utenti (facoltativa)
router.get('/', (req, res) => {
  // Logica per ottenere gli utenti (potresti usare User.find() per MongoDB)
  res.send('Elenco degli utenti');
});

// Rotta POST per registrare un utente
router.post('/register', authController.registerUser);  // Usa il controller per registrare l'utente

// Esporta il router
module.exports = router;

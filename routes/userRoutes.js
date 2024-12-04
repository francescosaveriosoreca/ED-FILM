const express = require('express');
const router = express.Router();

// Esempio di rotta per ottenere tutti gli utenti
router.get('/', (req, res) => {
  // Logica per ottenere gli utenti
  res.send('Elenco degli utenti');
});

// Esempio di rotta per aggiungere un utente
router.post('/', (req, res) => {
  const newUser  = req.body; // Assicurati di avere il middleware per il parsing JSON
  // Logica per aggiungere l'utente
  res.status(201).send(`Utente aggiunto: ${newUser .name}`);
});

// Esporta il router
module.exports = router;
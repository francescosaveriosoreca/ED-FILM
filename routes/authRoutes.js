const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');


// Rotta POST per il login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Logica per autenticare l'utente
        const user = await User.findOne({ username }); // Trova l'utente per username
        if (!user) {
            return res.status(401).json({ message: 'Username o password non validi' });
        }

        // Verifica la password (assicurati di utilizzare un metodo sicuro per la verifica)
        const isMatch = await user.comparePassword(password); // Assicurati di avere un metodo per confrontare le password
        if (!isMatch) {
            return res.status(401).json({ message: 'Username o password non validi' });
        }

        // Se l'autenticazione ha successo, genera un token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).json({ message: 'Errore durante il login' });
    }
});

module.exports = router;
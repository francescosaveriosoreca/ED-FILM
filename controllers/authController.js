const bcrypt = require('bcryptjs');
const User = require('../models/User');  // Importa il modello User

// Funzione per la registrazione di un utente
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Verifica se l'utente esiste già nel database
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email già registrata' });
        }

        // Cifra la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo utente
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Salva il nuovo utente nel database
        await newUser.save();

        // Risposta di successo
        res.status(201).json({ success: true, message: 'Utente registrato con successo!' });

    } catch (error) {
        console.error('Errore durante la registrazione:', error);
        res.status(500).json({ success: false, message: 'Errore interno del server' });
    }
};

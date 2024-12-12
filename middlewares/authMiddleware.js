const jwt = require('jsonwebtoken');

console.log('JWT_SECRET:', process.env.JWT_SECRET);


const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Accesso negato, token mancante o non valido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica il token
        req.user = decoded; // Salva i dati decodificati del token nella richiesta
        next(); // Passa al prossimo middleware o controller
    } catch (error) {
        console.log("errore nella verifica del token:", error);
        res.status(401).json({ error: 'Accesso negato, token non valido' });
    }
};

module.exports = authMiddleware;

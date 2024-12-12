// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/edfilms', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connesso');
    } catch (error) {
        console.error('Errore di connessione a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
const mongoose = require('mongoose');

// Définition du schéma pour les voitures
const carSchema = new mongoose.Schema({
    image: { type: String},
    marque: { type: String },
    modele: { type: String },
    description: { type: String },
    
});

module.exports = mongoose.model('Car', carSchema);

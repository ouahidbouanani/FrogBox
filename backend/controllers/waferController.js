const db = require('../config/db');

// Ajouter des données
exports.addWaferData = (req, res) => {
    const { activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment } = req.body;

    const query = `INSERT INTO data_wafer (activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment], (err, result) => {
        if (err) {
            console.error('Erreur lors de l’insertion:', err);
            return res.status(500).json({ error: 'Erreur lors de l’insertion des données' });
        }
        res.status(201).json({ message: 'Données enregistrées avec succès' });
    });
};

// Récupérer les données
exports.getWaferData = (req, res) => {
    const query = 'SELECT * FROM data_wafer';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        }
        res.status(200).json(results);
    });
};

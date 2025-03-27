const db = require('../config/db');

// Ajouter des données
exports.addTechopsData = (req, res) => {
    const { activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment } = req.body;
    
    const query = `INSERT INTO techops_data_chip (activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion:', err);
            return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
        }
        res.status(200).json({ success: true, message: 'Données enregistrées avec succès' });
    });
};

// Récupérer les données
exports.getTechopsData = (req, res) => {
    const query = 'SELECT * FROM techops_data_chip';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données:', err);
            return res.status(500).json({ success: false, message: 'Erreur dans la récupération des données' });
        }
        res.status(200).json(results);
    });
};

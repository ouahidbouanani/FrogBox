// ✅ controllers/finImpressionController.js
const db = require('../config/db');

// Ajouter une fin d'impression
dbInsertFinImpression = (req, res) => {
    const { id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires } = req.body;

    const query = `INSERT INTO fin_impression (id_lot,num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires) 
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion:", err);
            return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
        }
        res.status(200).json({ success: true, message: 'Données enregistrées avec succès' });
    });
};

// Récupérer tous les numéros de lot
const getAllLots = (req, res) => {
    const query = 'SELECT id FROM nouvelle_impression';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.json(results);
    });
};

// Récupérer détails d'un lot
const getLotDetails = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT nb_pieces, num_lot_wafer FROM nouvelle_impression WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.json(results[0]);
    });
};

module.exports = {
    dbInsertFinImpression,
    getAllLots,
    getLotDetails
};
const db = require('../config/db');


// Ajouter une fin d'impression + mise à jour de lot_status
dbInsertFinImpression = (req, res) => {
    const { id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires } = req.body;

    const insertQuery = `
        INSERT INTO fin_impression (id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const updateStatusQuery = `
        INSERT INTO lot_status (id_lot, current_step)
        VALUES (?, 'fin_impression')
        ON DUPLICATE KEY UPDATE current_step = 'fin_impression'`;

    // 1. Insertion dans fin_impression
    db.query(insertQuery, [id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion dans fin_impression:", err);
            return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
        }

        // 2. Mise à jour ou insertion dans lot_status
        db.query(updateStatusQuery, [id_lot], (err2, result2) => {
            if (err2) {
                console.error("Erreur lors de la mise à jour du statut:", err2);
                return res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du statut' });
            }

            res.status(200).json({ success: true, message: 'Données et statut enregistrés avec succès' });
        });
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
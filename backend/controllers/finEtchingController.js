const db = require('../config/db');

// récuperer les lots qui sont dans le début etching et qui les leur cotes sont déja prises s
exports.getLots = (req, res) => {
    const sql = 'SELECT DISTINCT d.id_lot FROM debut_etching d INNER JOIN prise_de_cotes p ON d.id_lot = p.id_lot;';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des lots:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

// Récupérer numéro de lot wafer et nb passage d'un lot a partir de son id 
exports.getLotInfo = (req, res) => {
    const lotId = req.params.lotId;
    const sql = `
    SELECT num_lot_wafer, nb_passage 
    FROM debut_etching 
    WHERE id_lot = ? 
    ORDER BY nb_passage DESC 
    LIMIT 1
  `;
    db.query(sql, [lotId], (err, results) => {
        if (err) {
            console.error('Erreur récupération lot:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Lot introuvable' });
        }

        res.json(results[0]);
    });
};

// function insertion les données du formulaire fin etching dans la table fin_etching
exports.addFinEtching = (req, res) => {
    const {
        id_lot,
        num_lot_wafer,
        nb_passage,
        date_fin,
        heure_fin,
        nb_piece_conforme,
        operateur,
        commentaire,
    } = req.body;

    const insertFinEtchingSQL = `
        INSERT INTO fin_etching (
            id_lot, num_lot_wafer, nb_passage, date_fin, 
            heure_fin, nb_piece_conforme, operateur, commentaire
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const updateStatusSQL = `
        INSERT INTO lot_status (id_lot, current_step)
        VALUES (?, 'fin_etching')
        ON DUPLICATE KEY UPDATE current_step = 'fin_etching'
    `;

    db.query(
        insertFinEtchingSQL,
        [
            id_lot,
            num_lot_wafer,
            nb_passage,
            date_fin,
            heure_fin,
            nb_piece_conforme,
            operateur,
            commentaire,
        ],
        (err, result) => {
            if (err) {
                console.error('Erreur ajout fin etching:', err);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            // Mise à jour du statut du lot
            db.query(updateStatusSQL, [id_lot], (err2) => {
                if (err2) {
                    console.error('Erreur mise à jour lot_status:', err2);
                    return res.status(500).json({ error: 'Erreur mise à jour du statut' });
                }

                res.status(200).json({ message: 'Fin Etching enregistrée et statut mis à jour' });
            });
        }
    );
};

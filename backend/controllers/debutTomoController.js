const db = require('../config/db');

//inserer les données "Formulaire début Tomo"
exports.create = (req, res) => {
    const {
        id_lot,
        nb_pieces,
        etage,
        date,
        heure_debut,
        operateur,
        num_machine,
        version,
        separation,
        commentaire
    } = req.body;

    const sqlInsert = `
        INSERT INTO debut_tomo (
            id_lot, nb_pieces, etage, date, heure_debut, operateur,
            num_machine, version, separation, commentaire
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id_lot, nb_pieces, etage, date, heure_debut, operateur,
        num_machine, version, separation, commentaire
    ];

    db.query(sqlInsert, values, (err, result) => {
        if (err) {
            console.error('Erreur d\'insertion :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
        }

        // Ensuite mise à jour ou insertion dans lot_status
        const updateStatusSQL = `
            INSERT INTO lot_status (id_lot, current_step)
            VALUES (?, 'prise_de_cotes')
            ON DUPLICATE KEY UPDATE current_step = 'prise_de_cotes'
        `;

        db.query(updateStatusSQL, [id_lot], (err2) => {
            if (err2) {
                console.error('Erreur mise à jour lot_status :', err2);
                return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
            }

            res.status(201).json({ message: 'Début de tomographie enregistré et statut mis à jour' });
        });
    });
};

// récuperer tous les données a partir de la table "debut_tomo"
exports.getAll = (req, res) => {
    const sql = 'SELECT * FROM debut_tomo';

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Erreur de récupération :', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(rows);
    });
};

// récupérer tous les lots qui sont arrivé a la phase fin_etching 
exports.getLots = (req, res) => {
    const sql = 'SELECT id_lot from fin_etching';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des lots:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

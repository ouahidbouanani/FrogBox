const db = require('../config/db'); // Connexion MySQL avec mysql2 (non promise)

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

    const sql = `
        INSERT INTO debut_tomo (
            id_lot, nb_pieces, etage, date, heure_debut, operateur,
            num_machine, version, separation, commentaire
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id_lot, nb_pieces, etage, date, heure_debut, operateur,
        num_machine, version, separation, commentaire
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur d\'insertion :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
        }
        res.status(201).json({ message: 'Début de tomographie enregistré' });
    });
};

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

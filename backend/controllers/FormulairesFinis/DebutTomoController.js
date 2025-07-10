const db = require('../../config/db')


//inserer les données "Formulaire début Tomo"
exports.create = (req, res) => {
    const {
        id,
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
        INSERT INTO debuttomo_finis (
            id, nb_pieces, etage, date, heure_debut, operateur,
            num_machine, version, separation, commentaire
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        id, nb_pieces, etage, date, heure_debut, operateur,
        num_machine, version, separation, commentaire
    ];

    db.query(sqlInsert, values, (err, result) => {
        if (err) {
            console.error('Erreur d\'insertion :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
        }



            res.status(201).json({ message: 'Début de tomographie enregistré et statut mis à jour' });
        });
};

//récupérer les lots de la table assemblage pour le forms debut tomo finis
exports.getLots = (req, res) => {
    const sql = 'SELECT id from assemblage';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des lots:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};



const db = require('../../config/db')

/*exports.create = (req, res) => {
    const { id_lot, quantite, date, heure, operateur } = req.body

    const sql = `
        INSERT INTO fin_tomo (
            id_lot, quantite, date, heure, operateur
        ) VALUES (?, ?, ?, ?, ?)
    `
    const values = [id_lot, quantite, date, heure, operateur]

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erreur insertion :', err)
            return res.status(500).json({ error: 'Erreur serveur' })
        }
        res.status(201).json({ message: 'Fin de tomographie enregistrée' })
    })
}
*/
// function insertion les données du formulaire fin tomo dans la table fin_tomo
exports.create = (req, res) => {
    const { id_lot, quantite, date, heure, operateur } = req.body;

    const insertFinTomoSQL = `
        INSERT INTO fin_tomo (
            id_lot, quantite, date, heure, operateur
        ) VALUES (?, ?, ?, ?, ?)
    `;
    const updateStatusSQL = `
        INSERT INTO lot_status (id_lot, current_step)
        VALUES (?, 'fin_tomo')
        ON DUPLICATE KEY UPDATE current_step = 'fin_tomo'
    `;

    const values = [id_lot, quantite, date, heure, operateur];

    db.query(insertFinTomoSQL, values, (err, result) => {
        if (err) {
            console.error('Erreur insertion fin_tomo :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'insertion fin_tomo' });
        }

        // Mise à jour du statut dans lot_status
        db.query(updateStatusSQL, [id_lot], (err2, result2) => {
            if (err2) {
                console.error('Erreur mise à jour lot_status :', err2);
                return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut' });
            }

            res.status(201).json({ message: 'Fin de tomographie enregistrée et statut mis à jour' });
        });
    });
};


exports.getAll = (req, res) => {
    db.query('SELECT * FROM fin_tomo', (err, results) => {
        if (err) {
            console.error('Erreur récupération :', err)
            return res.status(500).json({ error: 'Erreur serveur' })
        }
        res.json(results)
    })
}

// récupérer tous les lots dans la table debut_tomo
exports.getLots = (req, res) => {
    const sql = 'SELECT id_lot from debut_tomo';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des lots:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

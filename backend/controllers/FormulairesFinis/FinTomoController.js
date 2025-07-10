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
    const { id, quantite, date, heure, operateur } = req.body;

    const insertFinTomoSQL = `
        INSERT INTO fintomo_finis (
            id, quantite, date, heure, operateur
        ) VALUES (?, ?, ?, ?, ?)
    `;

    const values = [id, quantite, date, heure, operateur];

    db.query(insertFinTomoSQL, values, (err, result) => {
        if (err) {
            console.error('Erreur insertion fin_tomo :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de l\'insertion fin_tomo' });
        }
        res.status(201).json({ message: 'Fin de tomographie enregistrée et statut mis à jour' });
       
    });
};


exports.getAll = (req, res) => {
    db.query('SELECT * FROM fintomo_finis', (err, results) => {
        if (err) {
            console.error('Erreur récupération :', err)
            return res.status(500).json({ error: 'Erreur serveur' })
        }
        res.json(results)
    })
}

// récupérer tous les lots dans la table debut_tomo
exports.getLots = (req, res) => {
    const sql = 'SELECT id from debuttomo_finis';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des lots:', err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
        res.json(results);
    });
};

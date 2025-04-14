const db = require('../config/db')

exports.create = (req, res) => {
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

exports.getAll = (req, res) => {
    db.query('SELECT * FROM fin_tomo', (err, results) => {
        if (err) {
            console.error('Erreur récupération :', err)
            return res.status(500).json({ error: 'Erreur serveur' })
        }
        res.json(results)
    })
}

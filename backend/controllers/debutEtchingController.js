const db = require('../config/db')

// GET : Récupération des lots depuis la table fin_impression
exports.getLots = (req, res) => {
  const query = 'SELECT id_lot, num_lot_wafer FROM fin_impression'

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des lots:', err)
      return res.status(500).json({ success: false, message: 'Erreur serveur' })
    }
    res.status(200).json(results)
  })
}

// POST : Ajout des données dans debut_etching
exports.addDebutEtching = (req, res) => {
  const {
    numeroLot,
    num_lot_wafer,
    operateur,
    nb_passage,
    date_debut,
    heure_debut,
    temps_reel,
    koh,
    bain,
    position,
    commentaire
  } = req.body

  const query = `
    INSERT INTO debut_etching (
      id_lot, num_lot_wafer, operateur, nb_passage, date_debut, heure_debut,
      temps_reel, koh, bain, position, commentaire
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [
      numeroLot, num_lot_wafer, operateur, nb_passage, date_debut, heure_debut,
      temps_reel, koh, bain, position, commentaire
    ],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans debut_etching:', err)
        return res.status(500).json({ success: false, message: 'Erreur serveur' })
      }
      res.status(200).json({ success: true, message: 'Données enregistrées avec succès' })
    }
  )
}

const db = require('../config/db')

// Ajouter une nouvelle impression
exports.addImpression = (req, res) => {
  const {
    activity,
    typePieces,
    versionPiece,
    num_lot_wafer,
    nbPieces,
    imprimante,
    dateImpression,
    operateur,
    commentaire
  } = req.body

  const query = `
    INSERT INTO nouvelle_impression (
      activity, type_pieces, version_piece, num_lot_wafer, nb_pieces,
      imprimante, date_impression, operateur, commentaire
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    query,
    [activity, typePieces, versionPiece, num_lot_wafer, nbPieces, imprimante, dateImpression, operateur, commentaire],
    (err, result) => {
      if (err) {
        console.error('❌ Erreur lors de l\'insertion:', err)
        return res.status(500).json({ success: false, message: 'Erreur dans la base de données' })
      }
      res.status(200).json({ success: true, message: 'Données enregistrées avec succès' })
    }
  )
}

// Récupérer toutes les impressions (optionnel)
exports.getImpressions = (req, res) => {
  const query = 'SELECT * FROM nouvelle_impression'

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des données:', err)
      return res.status(500).json({ success: false, message: 'Erreur dans la récupération des données' })
    }
    res.status(200).json(results)
  })
}

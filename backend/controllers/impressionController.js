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
  } = req.body;

  const insertImpressionQuery = `
    INSERT INTO nouvelle_impression (
      activity, type_pieces, version_piece, num_lot_wafer, nb_pieces,
      imprimante, date_impression, operateur, commentaire
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertImpressionQuery,
    [activity, typePieces, versionPiece, num_lot_wafer, nbPieces, imprimante, dateImpression, operateur, commentaire],
    (err, result) => {
      if (err) {
        console.error('❌ Erreur lors de l\'insertion:', err);
        return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
      }

      // Récupérer l'ID du lot inséré
      const id_lot = result.insertId;

      // Mettre à jour ou insérer le suivi dans `lot_status`
      const updateStatusQuery = `
        INSERT INTO lot_status (id_lot, nb_pieces, current_step)
        VALUES (?, ?, 'nouvelle_impression')
        ON DUPLICATE KEY UPDATE current_step = 'nouvelle_impression'
      `;

      db.query(updateStatusQuery, [id_lot, nbPieces], (err2) => {
        if (err2) {
          console.error('❌ Erreur lors de la mise à jour de lot_status:', err2);
          return res.status(500).json({ success: false, message: 'Erreur mise à jour lot_status' });
        }

        res.status(200).json({ success: true, message: 'Données enregistrées et statut mis à jour' });
      });
    }
  );
};


// Récupérer toutes les impressions 
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

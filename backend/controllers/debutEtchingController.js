const db = require('../config/db')

// GET : Récupération des lots depuis la table fin_impression
exports.getLots = (req, res) => {
  const query = 'SELECT id_lot, num_lot_wafer, nb_imprimees FROM fin_impression'

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
    nb_pieces,
    operateur,
    nb_passage,
    date_debut,
    heure_debut,
    temps_reel,
    koh,
    bain,
    position,
    commentaire
  } = req.body;

  const insertQuery = `
    INSERT INTO debut_etching (
      id_lot, num_lot_wafer, nb_pieces, operateur, nb_passage,
      date_debut, heure_debut, temps_reel, koh, bain, position, commentaire
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const updateStatusQuery = `
    INSERT INTO lot_status (id_lot, current_step)
    VALUES (?, 'debut_etching')
    ON DUPLICATE KEY UPDATE current_step = 'debut_etching'
  `;

  db.query(
    insertQuery,
    [
      numeroLot, num_lot_wafer, nb_pieces, operateur, nb_passage,
      date_debut, heure_debut, temps_reel, koh, bain, position, commentaire
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion dans debut_etching:", err);
        return res.status(500).json({ success: false, message: 'Erreur serveur' });
      }

      // Mise à jour du statut du lot
      db.query(updateStatusQuery, [numeroLot], (err2, result2) => {
        if (err2) {
          console.error("Erreur lors de la mise à jour du statut:", err2);
          return res.status(500).json({ success: false, message: 'Données insérées, mais erreur statut' });
        }

        res.status(200).json({ success: true, message: 'Données et statut enregistrés avec succès' });
      });
    }
  );
};

// récuperer tous les données de table début_etching
exports.getAllDebutEtching = (req, res) => {
  const query = `
    SELECT 
      id_lot,
      num_lot_wafer,
      nb_pieces,
      operateur,
      nb_passage,
      date_debut,
      heure_debut,
      temps_reel,
      koh,
      bain,
      position,
      commentaire
    FROM debut_etching
  `

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données :', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }

    // Formater les dates et heures
    const formattedResults = results.map(row => {
      const date = new Date(row.date_debut)
      const formattedDate = date.toISOString().split('T')[0].replace(/-/g, '/')

      return {
        ...row,
        date_debut: formattedDate,
        heure_debut: row.heure_debut.slice(0, 5) // hh:mm
      }
    })

    res.json(formattedResults)
  })
}

// Contrôleur pour récupérer le nombre de passages
exports.getNbPassages = (req, res) => {
    const lotId = req.params.lotId

    db.query(
        'SELECT COUNT(*) AS count FROM debut_etching WHERE id_lot = ?',
        [lotId],
        (err, results) => {
            if (err) {
                console.error('Erreur lors du comptage des passages :', err)
                return res.status(500).json({ error: 'Erreur serveur' })
            }

            const count = results[0]?.count || 0
            res.json({ count })
        }
    )
}

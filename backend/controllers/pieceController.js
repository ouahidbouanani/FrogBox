const db = require('../config/db');

// Enregistrer une pièce et ses côtés
exports.ajouterPiece = (req, res) => {
  const { nom_piece, nb_cotes, version, cotes } = req.body;

  if (!nom_piece || !nb_cotes || !version || !Array.isArray(cotes)) {
    return res.status(400).json({ message: 'Champs invalides' });
  }

  const insertPieceQuery = 'INSERT INTO piece (nom, nb_cotes, version) VALUES (?, ?, ?)';

  db.query(insertPieceQuery, [nom_piece, nb_cotes, version], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de la pièce :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    const pieceId = result.insertId;

    const insertCoteQuery = `
      INSERT INTO cote_piece (piece_id, nom_cote, tolerance_min, tolerance_max)
      VALUES ?
    `;

    const coteValues = cotes.map(cote => [
      pieceId,
      cote.nom_cote,
      cote.tolerance_min,
      cote.tolerance_max,
    ]);

    db.query(insertCoteQuery, [coteValues], (err2) => {
      if (err2) {
        console.error('Erreur lors de l\'insertion des côtés :', err2);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      return res.status(201).json({ message: 'Pièce et côtés enregistrés avec succès.' });
    });
  });
};


// récupérer tous les pieces dispo
exports.getAllPieces = (req, res) => {
  const query = `
    SELECT 
      p.id AS piece_id, p.nom AS nom_piece, p.nb_cotes, p.version,
      c.id AS cote_id, c.nom_cote, c.tolerance_min, c.tolerance_max
    FROM piece p
    LEFT JOIN cote_piece c ON c.piece_id = p.id
    ORDER BY p.id, c.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des pièces :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    const piecesMap = {};

    results.forEach(row => {
      if (!piecesMap[row.piece_id]) {
        piecesMap[row.piece_id] = {
          id: row.piece_id,
          nom: row.nom_piece,
          nb_cotes: row.nb_cotes,
          version : row.version,
          cotes: [],
        };
      }

      if (row.cote_id) {
        piecesMap[row.piece_id].cotes.push({
          id: row.cote_id,
          nom_cote: row.nom_cote,
          tolerance_min: row.tolerance_min,
          tolerance_max: row.tolerance_max,
        });
      }
    });

    const pieces = Object.values(piecesMap);
    return res.status(200).json(pieces);
  });
};

// récuperer les infos d'une pièce donné a partir de son id

exports.getPieceById = (req, res) => {
  const pieceId = req.params.id;

  const query = `
    SELECT 
      p.id AS piece_id, p.nom AS nom_piece, p.nb_cotes, p.version,
      c.id AS cote_id, c.nom_cote, c.tolerance_min, c.tolerance_max
    FROM piece p
    LEFT JOIN cote_piece c ON c.piece_id = p.id
    WHERE p.id = ?
    ORDER BY c.id;
  `;

  db.query(query, [pieceId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de la pièce :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Pièce non trouvée' });
    }

    const piece = {
      id: results[0].piece_id,
      nom: results[0].nom_piece,
      nb_cotes: results[0].nb_cotes,
      version: results[0].version,
      cotes: [],
    };

    results.forEach(row => {
      if (row.cote_id) {
        piece.cotes.push({
          id: row.cote_id,
          nom_cote: row.nom_cote,
          tolerance_min: row.tolerance_min,
          tolerance_max: row.tolerance_max,
        });
      }
    });

    return res.status(200).json(piece);
  });
};


// modifier une pièce
exports.updatePiece = (req, res) => {
  const pieceId = req.params.id;
  const { nom_piece, nb_cotes, version, cotes } = req.body;

  if (!nom_piece || !nb_cotes || !version || !Array.isArray(cotes) || cotes.length === 0) {
    return res.status(400).json({ message: 'Champs invalides' });
  }

  const updatePieceQuery = 'UPDATE piece SET nom = ?, nb_cotes = ? , version = ? WHERE id = ?';

  db.query(updatePieceQuery, [nom_piece, nb_cotes, version, pieceId], (err) => {
    if (err) {
      console.error('Erreur update piece:', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    const deleteCotesQuery = 'DELETE FROM cote_piece WHERE piece_id = ?';
    db.query(deleteCotesQuery, [pieceId], (err) => {
      if (err) {
        console.error('Erreur suppression anciens côtés:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      const insertCoteQuery = `
        INSERT INTO cote_piece (piece_id, nom_cote, tolerance_min, tolerance_max) VALUES ?
      `;

      const values = cotes.map(cote => [
        pieceId,
        cote.nom_cote,
        cote.tolerance_min,
        cote.tolerance_max,
      ]);

      db.query(insertCoteQuery, [values], (err) => {
        if (err) {
          console.error('Erreur insertion nouveaux côtés:', err);
          return res.status(500).json({ message: 'Erreur serveur' });
        }

        return res.status(200).json({ message: 'Pièce mise à jour avec succès' });
      });
    });
  });
};



//supprimer une pièce

exports.deletePiece = (req, res) => {
  const pieceId = req.params.id;

  // 1. Supprimer d'abord dans la table cote_piece
  const deleteCotePieceQuery = 'DELETE FROM cote_piece WHERE piece_id = ?';
  db.query(deleteCotePieceQuery, [pieceId], (err) => {
    if (err) {
      console.error('Erreur suppression dans cote_piece:', err);
      return res.status(500).json({ message: 'Erreur serveur (cote_piece)' });
    }

    // 2. Ensuite supprimer la pièce elle-même
    const deletePieceQuery = 'DELETE FROM piece WHERE id = ?';
    db.query(deletePieceQuery, [pieceId], (err, result) => {
      if (err) {
        console.error('Erreur suppression pièce:', err);
        return res.status(500).json({ message: 'Erreur serveur (piece)' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Pièce non trouvée' });
      }

      return res.status(200).json({ message: 'Pièce et ses cotes supprimées avec succès' });
    });
  });
};


// récupérer les tous les noms des pièces 
exports.getTypePieces = (req, res) => {
  const query = " select DISTINCT nom From piece "
     
  db.query(query, (err, results) => {
    if (err){
      console.err("erreur lors de la récupération des types:",err)
      return res.status(500).json ({error: "erreur lors de la récupération des types"})
    }
    const types = results.map(row => row.nom)
    res.json(types)
  } )
}

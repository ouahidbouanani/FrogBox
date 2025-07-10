const db = require('../../config/db'); 

// POST - Déclarer une nouvelle non-conformité
exports.declarerNc = (req, res) => {
  const {
    id_lot,
    operateur,
    date,
    pieces // tableau de pièces
  } = req.body;

  if (!id_lot || !Array.isArray(pieces) || pieces.length === 0 || !operateur || !date) {
    return res.status(400).json({ message: 'Champs requis manquants ou invalides.' });
  }

  let errors = [];
  let completed = 0;

  pieces.forEach((piece, index) => {
    const { id_piece, denomination, produit, description, proud, type } = piece;

    const pieceSql = `
      INSERT INTO nc_pieces (id_lot, id_piece, operateur, date, denomination, produit, description, proud, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ici, on utilise les mêmes valeurs id_lot, operateur, date pour chaque pièce
    const pieceValues = [
      id_lot,
      id_piece,
      operateur,
      date,
      denomination,
      produit,
      description,
      proud,
      type
    ];

    db.query(pieceSql, pieceValues, (err2) => {
      completed++;

      if (err2) {
        errors.push({ index, error: err2 });
      }

      if (completed === pieces.length) {
        if (errors.length > 0) {
          return res.status(500).json({ message: 'Certaines pièces n’ont pas pu être insérées.', errors });
        } else {
          return res.status(201).json({ message: 'Déclaration NC enregistrée avec succès.' });
        }
      }
    });
  });
};



// GET - Toutes les NC
exports.getAllNc = (req, res) => {
  db.query('SELECT * FROM nc_pieces ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// GET - NC non traitées
exports.getNcNonTraitees = (req, res) => {
  db.query('SELECT * FROM nc_pieces WHERE statut = "Non traité"', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
};

// GET - Une seule NC par ID
exports.getNcById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM nc_pieces WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'NC non trouvée' });
    res.status(200).json(result[0]);
  });
};

// PUT - Mise à jour d'une NC (traitement)
exports.updateNc = (req, res) => {
  const id = req.params.id;
  const {
    action, impact, decision, cause_racine,
    action_corrective, statut
  } = req.body;

  const sql = `
    UPDATE nc_pieces SET 
      action = ?, impact = ?, decision = ?, 
      cause_racine = ?, action_corrective = ?, statut = ? 
    WHERE id = ?
  `;
  const values = [action, impact, decision, cause_racine, action_corrective, statut, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'NC mise à jour' });
  });
};

//** */
exports.storeNcPieces = (req, res) => {
  const { piece_info, lots_selections, operateur, date, commentaire = '' } = req.body;

  if (!piece_info || !lots_selections || !operateur || !date) {
    return res.status(400).json({ message: 'Données manquantes.' });
  }

  const insertData = [];

  lots_selections.forEach(lot => {
    const { id_lot, type_pieces, pieces_selectionnees } = lot;

    if (Array.isArray(pieces_selectionnees)) {
      pieces_selectionnees.forEach(id_piece => {
        insertData.push([
          id_lot,
          id_piece,
          operateur,
          date,
          piece_info.denomination,
          piece_info.produit,
          type_pieces,
          piece_info.description,
          commentaire,
          '', // impact
          '', // decision
          '', // cause_racine
          '', // action_corrective
          'En attente', // statut
          new Date(),
          new Date()
        ]);
      });
    }
  });

  if (insertData.length === 0) {
    return res.status(400).json({ message: 'Aucune pièce à insérer.' });
  }

  const sql = `INSERT INTO nc_pieces (
    id_lot, id_piece, operateur, date,
    denomination, produit, type, description,
    action, impact, decision, cause_racine,
    action_corrective, statut, created_at, updated_at
  ) VALUES ?`;

  
  db.query(sql, [insertData], (err, result) => {
    if (err) {
      console.error('Erreur insertion:', err);
      return res.status(500).json({ message: 'Erreur enregistrement en base.' });
    }
    return res.status(201).json({ message: 'Pièces insérées avec succès', insertedRows: result.affectedRows });
  });
};



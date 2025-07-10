const db = require('../../config/db'); // adapte selon ton projet

// GET all denominations
exports.getAllDenominations = (req, res) => {
  db.query('SELECT name FROM denomination_options', (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur serveur', error: err });
    }
    res.json(results);
  });
};

// POST a new denomination
exports.createDenomination = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Nom requis' });

  db.query('INSERT INTO denomination_options (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de l\'insertion', error: err });
    }
    res.status(201).json({ id: result.insertId, name });
  });
};

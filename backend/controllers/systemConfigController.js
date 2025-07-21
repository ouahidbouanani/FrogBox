const db = require('../config/db');

// -----------------------------
// ACTIVITÉS
// -----------------------------

exports.getAllActivities = (req, res) => {
  db.query('SELECT * FROM activites', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createActivity = (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  db.query('INSERT INTO activites (nom) VALUES (?)', [nom], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, nom });
  });
};

// -----------------------------
// IMPRIMANTES
// -----------------------------

exports.getAllPrinters = (req, res) => {
  db.query('SELECT * FROM imprimantes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createPrinter = (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  db.query('INSERT INTO imprimantes (nom) VALUES (?)', [nom], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, nom });
  });
};

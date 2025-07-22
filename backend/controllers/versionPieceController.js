const db = require('../config/db'); 

// Récupérer toutes les versions
exports.getAllVersions = (req, res) => {
  const sql = 'SELECT * FROM version_piece';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de  récupération des versions :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(200).json(results);
  });
};

// Créer une nouvelle version
exports.createVersion = (req, res) => {
  const { version } = req.body;
  if (!version) {
    return res.status(400).json({ error: 'Version est requise' });
  }

  const sql = 'INSERT INTO version_piece (version) VALUES (?)';
  db.query(sql, [version], (err, result) => {
    if (err) {
      console.error('Erreur ajout version :', err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Cette version existe déjà' });
      }
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Version ajoutée' });
  });
};

// Supprimer une version
exports.deleteVersion = (req, res) => {
  const version = req.params.version;

  const sql = 'DELETE FROM version_piece WHERE version = ?';
  db.query(sql, [version], (err, result) => {
    if (err) {
      console.error('Erreur suppression version :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Version non trouvée' });
    }
    res.status(200).json({ message: 'Version supprimée' });
  });
};

const db = require('../config/db')
exports.getLotsProgress = async (req, res) => {
  try {
    const query = `
      SELECT id_lot, nb_pieces, current_step FROM lot_status;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des lots :", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



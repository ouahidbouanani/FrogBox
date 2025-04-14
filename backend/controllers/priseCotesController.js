// controllers/piecesController.js
const db = require('../config/db');

//  Récupération des lots
exports.getLots = (req, res) => {
  db.query('SELECT id_lot, nb_imprimees FROM fin_impression', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Soumission des pièces
exports.submitPieces = (req, res) => {
  const { id_lot, date, nombre_pieces, pieces } = req.body;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json({ error: err.message });
      }

      conn.query(
        'INSERT INTO prise_de_cotes (id_lot, date, nombre_pieces) VALUES (?, ?, ?)',
        [id_lot, date, nombre_pieces],
        (err) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: err.message });
            });
          }

          const values = pieces.map(p => [p.id_piece, p.id_lot, p.coteA, p.coteB, p.coteC]);

          conn.query(
            'INSERT INTO cotes (id_piece, id_lot, coteA, coteB, coteC) VALUES ?',
            [values],
            (err) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  res.status(500).json({ error: err.message });
                });
              }

              conn.commit(err => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    res.status(500).json({ error: err.message });
                  });
                }

                conn.release();
                res.sendStatus(200);
              });
            }
          );
        }
      );
    });
  });
};

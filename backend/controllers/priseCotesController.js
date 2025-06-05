const db = require('../config/db');

//  Récupération des lots disponible dans la table debut_etching , et les nombres de passage pour chaque lot 
// et puis vérifier si ils sont diponible déja dans la table prise_de_cotes, et aussi récupérer le nombre de pièce imprimées dans la table fin_impression
exports.getLots = (req, res) => {
  const query = `
    SELECT 
      d.id_lot,
      GROUP_CONCAT(d.nb_passage ORDER BY d.nb_passage) AS nb_passages,
      f.nb_imprimees
    FROM 
      debut_etching d
    LEFT JOIN 
      prise_de_cotes p 
      ON d.id_lot = p.id_lot AND d.nb_passage = p.nb_passage
    JOIN 
      fin_impression f 
      ON d.id_lot = f.id_lot
    WHERE 
      p.id_lot IS NULL AND p.nb_passage IS NULL
    GROUP BY 
      d.id_lot, f.nb_imprimees
  `;

  db.query(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

/*
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
*/
exports.submitPieces = (req, res) => {
  const { id_lot, passage, date, nombre_pieces, pieces } = req.body;

  db.getConnection((err, conn) => {
    if (err) return res.status(500).json({ error: err.message });

    conn.beginTransaction(err => {
      if (err) {
        conn.release();
        return res.status(500).json({ error: err.message });
      }

      // 1. Insérer dans `prise_de_cotes`
      conn.query(
        'INSERT INTO prise_de_cotes (id_lot, nb_passage, date, nombre_pieces) VALUES (?, ?, ?, ?)',
        [id_lot, passage, date, nombre_pieces],
        (err) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: err.message });
            });
          }

          // 2. Insérer dans `cotes`
          const values = pieces.map(p => [p.id_lot, passage, p.id_piece, p.coteA, p.coteB, p.coteC]);

          conn.query(
            'INSERT INTO cotes (id_lot, nb_passage, id_piece, coteA, coteB, coteC) VALUES ?',
            [values],
            (err) => {
              if (err) {
                return conn.rollback(() => {
                  conn.release();
                  res.status(500).json({ error: err.message });
                });
              }

              // 3. Mettre à jour le statut dans `lot_status`
              const updateStatusQuery = `
               UPDATE lot_status
               SET current_step = 'prise_de_cotes'
               WHERE id_lot = ?`;

              conn.query(updateStatusQuery, [id_lot], (err) => {
                if (err) {
                  return conn.rollback(() => {
                    conn.release();
                    res.status(500).json({ error: err.message });
                  });
                }

                // 4. Commit final
                conn.commit(err => {
                  if (err) {
                    return conn.rollback(() => {
                      conn.release();
                      res.status(500).json({ error: err.message });
                    });
                  }

                  conn.release();
                  res.status(200).json({ success: true, message: 'Données et statut enregistrés avec succès' });
                });
              });
            }
          );
        }
      );
    });
  });
};


//récuperer le type de pièce a partir de son id dans la table nouvelle_impression
exports.GetTypePiece = (req, res) => {
  const id_lot = req.params.id_lot;

  // Étape 1 : Récupérer le type de pièce depuis nouvelle_impression
  const query1 = "SELECT type_pieces FROM nouvelle_impression WHERE id = ?";
  db.query(query1, [id_lot], (err, lotRows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (lotRows.length === 0) {
      return res.status(404).json({ message: "Lot introuvable." });
    }

    const nom_piece = lotRows[0].type_pieces;

    // Étape 2 : Trouver l'id de cette pièce dans table 'piece'
    const query2 = "SELECT id FROM piece WHERE nom = ?";
    db.query(query2, [nom_piece], (err, pieceRows) => {
      if (err) return res.status(500).json({ error: err.message });

      if (pieceRows.length === 0) {
        return res.status(404).json({ message: "Pièce introuvable." });
      }

      const piece_id = pieceRows[0].id;

      // Étape 3 : Récupérer les cotes associées à cette pièce
      const query3 = "SELECT id, nom_cote, tolerance_min, tolerance_max FROM cote_piece WHERE piece_id = ?";
      db.query(query3, [piece_id], (err, cotes) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          nom_piece,
          cotes
        });
      });
    });
  });
};

exports.ajouterPriseCotes = (req, res) => {
  const { id_lot, nb_passage, date, type_piece, nombre_pieces, pieces } = req.body;

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Erreur de connexion à la base de données' });

    connection.beginTransaction(err => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: 'Erreur lors du démarrage de la transaction' });
      }

      const insertPriseCotes = `
        INSERT INTO prise_de_cotes (id_lot, nb_passage, type_piece, date, nombre_pieces)
        VALUES (?, ?, ?, ?, ?)`;

      connection.query(insertPriseCotes, [id_lot, nb_passage, type_piece, date, nombre_pieces], (err) => {
        if (err) return rollbackWithError(err, connection, res, 'Erreur insertion prise_de_cotes');

        connection.query(`SELECT id FROM piece WHERE nom = ?`, [type_piece], (err, pieceRows) => {
          if (err || pieceRows.length === 0)
            return rollbackWithError(err || new Error('Type pièce non trouvé'), connection, res, 'Erreur récupération pièce');

          const pieceId = pieceRows[0].id;

          connection.query(`SELECT id, nom_cote FROM cote_piece WHERE piece_id = ?`, [pieceId], (err, cotes) => {
            if (err) return rollbackWithError(err, connection, res, 'Erreur récupération des côtes');

            let remaining = 0;
            let errorOccurred = false;

            for (const piece of pieces) {
              for (const cote of cotes) {
                const valeur = piece[cote.nom_cote];
                if (valeur !== undefined) {
                  remaining++;
                  connection.query(
                    `INSERT INTO mesure_cote_piece (id_lot, nb_passage, id_piece_locale, id_cote_piece, valeur)
                     VALUES (?, ?, ?, ?, ?)`,
                    [id_lot, nb_passage, piece.id_piece, cote.id, valeur],
                    err => {
                      if (err && !errorOccurred) {
                        errorOccurred = true;
                        return rollbackWithError(err, connection, res, 'Erreur insertion mesure');
                      }
                      remaining--;
                      if (remaining === 0 && !errorOccurred) {
                        connection.commit(err => {
                          if (err) return rollbackWithError(err, connection, res, 'Erreur commit');
                          connection.release();
                          return res.status(201).json({ message: 'Mesures enregistrées avec succès' });
                        });
                      }
                    }
                  );
                }
              }
            }

            // Aucun champ mesuré ?
            if (remaining === 0) {
              connection.commit(err => {
                if (err) return rollbackWithError(err, connection, res, 'Erreur commit (aucune mesure)');
                connection.release();
                return res.status(201).json({ message: 'Prise de côtes enregistrée, aucune mesure fournie' });
              });
            }
          });
        });
      });
    });
  });
};


function rollbackWithError(err, connection, res, msg) {
  console.error(msg, err);
  connection.rollback(() => {
    connection.release();
    res.status(500).json({ error: msg });
  });
}

//récuperer les messeurs des pièces 
exports.getMesuresByLotAndPassage = (req, res) => {
  const { id_lot, nb_passage } = req.params;
  const requet = "SELECT  m.id_piece_locale, c.nom_cote, c.tolerance_min, c.tolerance_max, m.valeur FROM mesure_cote_piece m JOIN cote_piece c ON m.id_cote_piece = c.id WHERE m.id_lot = ? AND m.nb_passage = ? ORDER BY m.id_piece_locale, c.nom_cote"

  db.query(
    requet,
    [id_lot, nb_passage],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de la récupération des mesures" });
      }
      res.status(200).json(results);
    }
  );
};


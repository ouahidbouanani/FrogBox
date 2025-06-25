const db = require('../config/db');


// Ajouter une fin d'impression + mise à jour de lot_status
const dbInsertFinImpression = (req, res) => {
    const {
        id_lot,
        num_lot_wafer,
        nb_lancees,
        nb_imprimees,
        operateur,
        date_fin,
        commentaires,
        non_conformes = []
    } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            console.error("Erreur de connexion à la base :", err);
            return res.status(500).json({ success: false, message: "Erreur de connexion à la base de données" });
        }

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                console.error("Erreur début transaction :", err);
                return res.status(500).json({ success: false, message: "Erreur de transaction" });
            }

            const insertQuery = `
                INSERT INTO fin_impression (id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;

            connection.query(insertQuery, [id_lot, num_lot_wafer, nb_lancees, nb_imprimees, operateur, date_fin, commentaires], (err, result) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        console.error("Erreur insertion fin_impression:", err);
                        res.status(500).json({ success: false, message: "Erreur insertion fin_impression" });
                    });
                }

                const updateStatusQuery = `
                    INSERT INTO lot_status (id_lot, current_step)
                    VALUES (?, 'fin_impression')
                    ON DUPLICATE KEY UPDATE current_step = 'fin_impression'`;

                connection.query(updateStatusQuery, [id_lot], (err2, result2) => {
                    if (err2) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error("Erreur mise à jour statut:", err2);
                            res.status(500).json({ success: false, message: "Erreur mise à jour statut" });
                        });
                    }

                    if (non_conformes.length > 0) {
                        const insertNCQuery = `
                            INSERT INTO gestion_non_conformes (id_piece, denomination, produit, description, proud, type, date, statut) 
                            VALUES ?`;

                        const ncValues = non_conformes.map(piece => [
                            piece.id_piece,
                            piece.denomination,
                            piece.produit,
                            piece.description,
                            piece.proud,
                            piece.type,
                            date_fin,
                            'non traité'
                        ]);

                        connection.query(insertNCQuery, [ncValues], (err3, result3) => {
                            if (err3) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error("Erreur insertion non conformes:", err3);
                                    res.status(500).json({ success: false, message: "Erreur insertion non conformes" });
                                });
                            }

                            connection.commit(errCommit => {
                                if (errCommit) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.error("Erreur commit:", errCommit);
                                        res.status(500).json({ success: false, message: "Erreur commit final" });
                                    });
                                }

                                connection.release();
                                res.status(200).json({ success: true, message: "Toutes les données enregistrées avec succès" });
                            });
                        });
                    } else {
                        connection.commit(errCommit => {
                            if (errCommit) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.error("Erreur commit:", errCommit);
                                    res.status(500).json({ success: false, message: "Erreur commit final" });
                                });
                            }

                            connection.release();
                            res.status(200).json({ success: true, message: "Données enregistrées sans non-conformes" });
                        });
                    }
                });
            });
        });
    });
};



// Récupérer tous les numéros de lot
const getAllLots = (req, res) => {
    const query = 'SELECT id FROM nouvelle_impression';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.json(results);
    });
};

// Récupérer détails d'un lot
const getLotDetails = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT nb_pieces, num_lot_wafer, type_pieces FROM nouvelle_impression WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.json(results[0]);
    });
};

module.exports = {
    dbInsertFinImpression,
    getAllLots,
    getLotDetails
};
const db = require('../config/db'); 


//récuperer tous les les cotes a partir de son id et so, le nombre de passage 
exports.getCotesByLotId = (req, res) => {
    const { id_lot, nb_passage } = req.params;

    db.query(
        'SELECT id_piece, id_lot, coteA, coteB, coteC FROM cotes WHERE id_lot = ? AND nb_passage = ?',
        [id_lot, nb_passage], 
        (error, results) => {
            if (error) {
                console.error('Erreur lors de la récupération des cotes :', error);
                return res.status(500).json({ error: 'Erreur serveur' });
            }

            res.json(results);
        }
    );
};

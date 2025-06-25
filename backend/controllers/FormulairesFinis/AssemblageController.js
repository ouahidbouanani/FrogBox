const db = require('../../config/db')

exports.addAssemblage=(req, res)=> {
    const{activity, quantite, id_nozzle, id_body, date, operateur, commentaire} = req.body;
    const query  = 'INSERT INTO assemblage(activity, quantite, id_nozzle, id_body, date, operateur, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [activity, quantite, id_nozzle, id_body, date, operateur, commentaire], (err, result)=>{
        if (err) {
        console.error('❌ Erreur lors de l\'insertion:', err);
        return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
      }
      res.status(200).json(result);
    })
}
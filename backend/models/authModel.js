const db = require('../config/db');
const bcrypt = require('bcrypt');

const createUser  = (nom, email, mot_de_passe, callback) => {
  bcrypt.hash(mot_de_passe, 10, (err, hashedmot_de_passe) => {
    if (err) {
      return callback(err);
    }

    const sql = 'INSERT INTO users (nom, email, mot_de_passe) VALUES (?, ?, ?)';
    db.query(sql, [nom, email, hashedmot_de_passe], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return callback(new Error('L\'email est déjà utilisé.'));
        }
        return callback(err);
      }
      callback(null, result);
    });
  });
};

const findUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  
  try {
    const [rows] = await db.promise().query(sql, [email]); 
    return rows; 
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createUser ,
  findUserByEmail
};

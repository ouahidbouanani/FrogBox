const db = require('../config/db');
const transporter = require('../config/mailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//function d'inscription 
exports.register = (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!email.endsWith('@treefrog.fr')) {
    return res.status(400).json({ error: 'Email non autorisé.' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Erreur de hachage.' });

    const sql = 'INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [nom, prenom, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email déjà utilisé.' });
        }
        return res.status(500).json({ message: 'Erreur serveur.' });
      }

      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const link = `http://localhost:${process.env.PORT}/api/auth/verify?token=${token}`;

      const mailOptions = {
        from: '"FrogBox" <noreply@frogbox.com>',
        to: email,
        subject: 'Validez votre compte FrogBox',
        html: `
    <p>Bonjour ${prenom},</p>
    <p>Merci de vous être inscrit. Cliquez sur le lien ci-dessous pour valider votre compte :</p>
    <p>
      <a href="http://localhost:3000/api/auth/verify-email?token=${token}">
        Valider mon compte
      </a>
    </p>
    <p>Ou copiez/collez ce lien dans votre navigateur :<br/>
      http://localhost:3000/api/auth/verify-email?token=${token}
    </p>
  `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return res.status(500).json({ message: 'Erreur envoi email.' });

        res.status(200).json({ message: 'Inscription réussie. Vérifiez votre boîte mail.' });
      });
    });
  });
};

//la function de vérifiaction de mail
exports.verifyEmail = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token manquant.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ message: 'Lien invalide ou expiré.' });
    }

    const email = decoded.email;

    const sql = 'UPDATE users SET is_verified = 1 WHERE email = ?';
    db.query(sql, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Erreur serveur.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      res.status(200).json({ message: 'Email vérifié avec succès.' });
    });
  });
};

//la function de connexion 
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, users) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (users.length === 0) return res.status(401).json({ error: 'Email invalide' });

    const user = users[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) return res.status(401).json({ error: 'Mot de passe invalide' });

      // Génération du token JWT
      const token = jwt.sign({ id: user.id, email: user.email}, process.env.JWT_SECRET, {
        expiresIn: '24h'
      });

      // Retourner le token et d'autres informations utilisateur
      res.status(200).json({
        message: 'Connexion réussie',
        token: token,
        user: {
          nom: user.nom,
          prenom: user.prenom,
          email: user.email
        }
      });
    });
  });
};

exports.protectedRoute = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Non autorisé' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token invalide' });

    res.json({ message: 'Contenu protégé', user: decoded });
  });
};

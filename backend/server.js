
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const multer = require('multer');
const fs = require('fs');
const XLSX = require('xlsx');
const upload = multer();
const FILE_PATH = './uploads/form_data.xlsx';
const db = require('./config/db');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173'
];

app.use(cors({
  origin: function(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());
app.use('/', authRoutes);


app.post('/data-chip', (req, res) => {
  const { activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment } = req.body;

  const query = `
    INSERT INTO techops_data_chip (activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [activity, qtyLaunch, idNozzle, idBody, asmDate, asmUser, comment],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la base de données:', err.stack);
        return res.status(500).json({ success: false, message: 'Erreur dans la base de données' });
      }
      res.status(200).json({ success: true, message: 'Données enregistrées avec succès' });
    }
  );
});


app.get('/get-techops-data', (req, res) => {
  const query = 'SELECT * FROM techops_data_chip';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des données:', err.stack);
      return res.status(500).json({ success: false, message: 'Erreur dans la récupération des données' });
    }
    res.status(200).json(results); // Envoi des données récupérées au frontend
  });
});


app.post('/api/data-wafer', (req, res) => {
  const { activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment } = req.body;

  const query = `
      INSERT INTO data_wafer (activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [activity, choixWafer, numberOfParts, refPrinter, Date, printing2, comment], (err, result) => {
      if (err) {
          console.error('Erreur lors de l’insertion des données :', err);
          return res.status(500).json({ error: 'Erreur lors de l’insertion des données' });
      }
      res.status(201).json({ message: 'Données enregistrées avec succès' });
  });
});


app.get('/api/data-wafer', (req, res) => {
  const query = `SELECT * FROM data_wafer`;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération des données :', err);
          return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
      }
      res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
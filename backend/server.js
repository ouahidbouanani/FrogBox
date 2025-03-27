
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const techopsRoutes = require('./routes/techopsRoutes');
const waferRoutes = require('./routes/waferRoutes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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

// Utilisation des routes
app.use('/api', techopsRoutes);
app.use('/api', waferRoutes);
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const techopsRoutes = require('./routes/techopsRoutes');
const waferRoutes = require('./routes/waferRoutes');
const impressionRoutes = require('./routes/impressionRoutes')
const finImpressionRoutes = require('./routes/finImpressionRoutes');
const debutEtchingRoutes = require('./routes/debutEtchingRoutes');
const priseCotesRoute = require('./routes/priseCotesRoute')
const debutTomoRoutes = require('./routes/debutTomoRoutes');
const finTomoRoutes = require('./routes/finTomoRoutes')
const passport = require('./config/passport');
const cors = require('cors');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/db');

const allowedOrigins = [
  'http://localhost:5173',
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
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/', authRoutes);


// Utilisation des routes
app.use('/api', techopsRoutes);
app.use('/api', waferRoutes);
app.use('/api/impression', impressionRoutes)
app.use('/api/fin-impression', finImpressionRoutes);
app.use('/api/debut-etching', debutEtchingRoutes);
app.use('/api/debut-tomo', debutTomoRoutes);
app.use('/api/fin-tomo', finTomoRoutes)
app.use('/api', priseCotesRoute)
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
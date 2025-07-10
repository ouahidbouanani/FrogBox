
const express = require('express');
const bodyParser = require('body-parser');
/*const authRoutes = require('./routes/authRoutes');*/
const authRoutes = require('./routes/auth.Routes');
const suiviRoutes = require("./routes//FormsSemiRoutes/suiviRoutes");
const impressionRoutes = require('./routes/FormsSemiRoutes/impressionRoutes')
const finImpressionRoutes = require('./routes/FormsSemiRoutes/finImpressionRoutes');
const debutEtchingRoutes = require('./routes/FormsSemiRoutes/debutEtchingRoutes');
const priseCotesRoute = require('./routes/FormsSemiRoutes/priseCotesRoute')
const debutTomoRoutes = require('./routes/FormsSemiRoutes/debutTomoRoutes');
const debutTomoFinisRoute = require('./routes/FromsFinisRoutes/DebutTomoRoutes')
const finTomoRoutes = require('./routes/FormsSemiRoutes/finTomoRoutes');
const finTomoFinisRoutes = require ('./routes/FromsFinisRoutes/FinTomoRoutes')
const assemblage = require('./routes/FromsFinisRoutes/AssemeblageRoute')
//const passport = require('./config/passport');
const cotesRoutes = require('./routes/FormsSemiRoutes/cotesRoutes');
const finEtchingRoutes = require('./routes/FormsSemiRoutes/finEtchingRoutes');
const denominationRoutes = require('./routes/FormsSemiRoutes/denominationRoutes')
const pieceRoutes = require("./routes/pieceRoutes");
const cors = require('cors');
const ncRoutes = require('./routes/FormsSemiRoutes/gestionNcRoutes');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:2718'
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
//app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(bodyParser.json());
// app.use('/', authRoutes);
app.use(cookieParser());


// Utilisation des routes
app.use('/api/impression', impressionRoutes)
app.use('/api/fin-impression', finImpressionRoutes);
app.use('/api/debut-etching', debutEtchingRoutes);
app.use('/api/debut-tomo', debutTomoRoutes);
app.use('/api/fin-tomo', finTomoRoutes);
app.use('/api/fin-tomo-finis', finTomoFinisRoutes)
app.use('/api', priseCotesRoute)
app.use('/api/cotes', cotesRoutes);
app.use('/api/fin-etching', finEtchingRoutes);
app.use("/api/suivi", suiviRoutes);
app.use('/api/auth', authRoutes);
app.use("/api", pieceRoutes);
app.use("/api/assemblage",assemblage);
app.use('/api', ncRoutes);
app.use('/api/debut-tomo-finis', debutTomoFinisRoute)
app.use('/api/denominations', denominationRoutes);



app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
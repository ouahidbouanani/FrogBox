// routes/debutEtchingRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/debutEtchingController');

// Récupérer les lots depuis la table fin_impression
router.get('/lots', controller.getLots)

// Ajouter un nouvel enregistrement dans debut_etching
router.post('/add', controller.addDebutEtching)

module.exports = router

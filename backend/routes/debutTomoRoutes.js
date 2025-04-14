const express = require('express');
const router = express.Router();
const debutTomoController = require('../controllers/debutTomoController');

// Enregistrer un début de tomographie
router.post('/', debutTomoController.create);

// Récupérer tous les débuts tomographie (optionnel)
router.get('/', debutTomoController.getAll);

module.exports = router;

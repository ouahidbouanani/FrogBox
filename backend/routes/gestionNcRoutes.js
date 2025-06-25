const express = require('express');
const router = express.Router();
const controller  = require('../controllers/gestionNcController');

// POST - Déclarer une nouvelle NC
router.post('/nc/add', controller.declarerNc);

// GET - Obtenir toutes les NC
router.get('/nc', controller.getAllNc);

// GET - NC non traitées
router.get('/nc/non-traitees', controller.getNcNonTraitees);

// GET - Détails d’une NC
router.get('/nc/:id', controller.getNcById);

// PUT - Mise à jour d’une NC (traitement par admin)
router.put('/nc/:id', controller.updateNc);

module.exports = router;

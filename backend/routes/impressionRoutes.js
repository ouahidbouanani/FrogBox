const express = require('express')
const router = express.Router()
const impressionController = require('../controllers/impressionController')

// Routes
router.post('/ajouter', impressionController.addImpression)
router.get('/', impressionController.getImpressions) 

module.exports = router

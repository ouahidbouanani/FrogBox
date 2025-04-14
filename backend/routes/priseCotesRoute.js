// routes/pieces.js
const express = require('express')
const router = express.Router()
const piecesController = require('../controllers/priseCotesController')

router.get('/lots', piecesController.getLots)
router.post('/pieces/submit', piecesController.submitPieces)

module.exports = router

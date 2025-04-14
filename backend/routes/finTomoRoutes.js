const express = require('express')
const router = express.Router()
const finTomoController = require('../controllers/finTomoController')

router.post('/add', finTomoController.create)
router.get('/all', finTomoController.getAll)

module.exports = router

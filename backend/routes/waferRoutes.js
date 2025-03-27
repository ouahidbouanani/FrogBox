const express = require('express');
const router = express.Router();
const waferController = require('../controllers/waferController');

router.post('/data-wafer', waferController.addWaferData);
router.get('/data-wafer', waferController.getWaferData);

module.exports = router;

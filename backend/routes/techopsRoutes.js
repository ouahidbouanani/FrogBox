const express = require('express');
const router = express.Router();
const techopsController = require('../controllers/techopsController');

router.post('/data-chip', techopsController.addTechopsData);
router.get('/get-techops-data', techopsController.getTechopsData);

module.exports = router;

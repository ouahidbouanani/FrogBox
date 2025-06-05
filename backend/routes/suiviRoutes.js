const express = require("express");
const router = express.Router();
const suiviController = require("../controllers/suiviController");

router.get("/lots", suiviController.getLotsProgress);

module.exports = router;

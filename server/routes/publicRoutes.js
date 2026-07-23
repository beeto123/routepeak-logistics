const express = require("express");
const router = express.Router();
const getShipmentByTracking = require("../controllers/getShipmentByTracking");

// Public tracking - no auth required
router.get("/:trackingNumber", getShipmentByTracking);

module.exports = router;
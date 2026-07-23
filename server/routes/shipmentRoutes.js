const express = require("express");

const router = express.Router();

const createShipment = require("../controllers/createShipment");
const getShipmentById = require("../controllers/getShipmentById");
const getAllShipments = require("../controllers/getAllShipments");
const updateShipmentStatus = require("../controllers/updateShipmentStatus");
const deleteShipment = require("../controllers/deleteShipment");

router.post("/", createShipment);

router.get("/", getAllShipments);

router.get("/:id", getShipmentById);

router.put("/:id", updateShipmentStatus);

router.delete("/:id", deleteShipment);

module.exports = router;
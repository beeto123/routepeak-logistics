const express = require("express");

const router = express.Router();

const getDashboardStats = require("../controllers/getDashboardStats");

router.get("/", getDashboardStats);

module.exports = router;
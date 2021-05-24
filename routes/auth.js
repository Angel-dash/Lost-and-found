const express = require("express");
const authController = require("../controllers/auth")
const router = express.Router();

router.post('/index', authController.index)
router.post('/postandclaim', authController.index)
module.exports = router;
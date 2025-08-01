const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/total', mapController.totalMap);
router.get('/heart', mapController.heartMap);

module.exports = router;

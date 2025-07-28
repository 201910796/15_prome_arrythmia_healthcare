const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const etcController = require('../controllers/etcController');

router.get('/description', auth, etcController.description);
router.get('/live', auth, etcController.live);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const diagController = require('../controllers/diagController');

router.post('/', auth, diagController.diagnose);
router.get('/:diag_id', auth, diagController.diagResult);

module.exports = router;
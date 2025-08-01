const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const hospitalController = require('../controllers/hospitalController');

router.post('/ask', auth, hospitalController.findHospital);
router.get('/calendar', auth, hospitalController.getCalendar);
router.get('/calendar/:calendar_id', auth, hospitalController.getCalendarDetail);
router.post('/reservation', auth, hospitalController.reserveHospital);
router.post('/schedule', auth, hospitalController.scheduleHospital);
router.get('/', auth, hospitalController.getHospital);
router.get('/:hospital_id', auth, hospitalController.getHospitalDetail); // ← 맨 아래로

module.exports = router;
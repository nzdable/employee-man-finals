const express = require('express');
const router = express.Router();
const LeaveController = require('../controllers/leaveController');


router.post('/leave', LeaveController.createLeave);
router.get('/leave', LeaveController.getAllLeave); 
router.get('/leave/:id/edit', LeaveController.editLeaveForm);
router.post('/leave/:id/edit', LeaveController.updateLeave);

module.exports = router;

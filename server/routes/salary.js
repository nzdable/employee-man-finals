const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');

router.get('/salaryList', salaryController.viewSalaryList); // View the list of all salaries
router.post('/addSalary', salaryController.addSalary); // Add a new salary entry
router.get('/addSalary', salaryController.renderAddSalaryPage); // Render the page to add a new salary
router.put('/editSalary/:id', salaryController.editSalary); // Edit an existing salary entry
router.get('/viewSalary/:id', salaryController.viewSalary); // View a specific salary detail

module.exports = router;
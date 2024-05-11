const Leave = require('../models/Leave');
const Customer = require('../models/Customer');

exports.createLeave = async (req, res) => {
  try {
    const { employeeName, superiorName, leaveType, leaveStatus, startDate, endDate } = req.body;

    if (!employeeName || !superiorName) {
      return res.status(400).json({ error: 'Invalid employee or superior name' });
    }

    const managerSuperiors = await Customer.find({ position: 'manager' });

    const newLeave = new Leave({
      employeeName,
      superiorName,
      leaveType,
      leaveStatus,
      startDate,
      endDate,
    });

    await newLeave.save();

    const leaveRequests = await Leave.find({ /* Add any conditions if necessary */ });
    res.render('leave', { leaveRequests, managerSuperiors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving leave details' });
  }
};


exports.getAllLeave = async (req, res) => {
  try {
    const leaveRequests = await Leave.find({ /* Add any conditions if necessary */ });

    const managerSuperiors = await Customer.find({ position: 'manager' });

    res.render('leave', { leaveRequests, managerSuperiors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching leave details' });
  }
};


exports.editLeave = async (req, res) => {
  try {

    const { id } = req.params;
    const leave = await Leave.findById(id);
    const managerSuperiors = await Customer.find({ position: 'manager' });
    const customers = await Customer.find(); 

    res.render('editLeave', { leave, managerSuperiors, customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rendering edit leave form' });
  }
};

exports.editLeaveForm = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    res.render('editLeave', { leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while rendering the edit form' });
  }
};

exports.updateLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    leave.employeeName = req.body.employeeName;
    leave.superiorName = req.body.superiorName;
    leave.leaveType = req.body.leaveType;
    leave.leaveStatus = req.body.leaveStatus;
    leave.startDate = req.body.startDate;
    leave.endDate = req.body.endDate;

    await leave.save();

    res.redirect('/leave');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating leave details' });
  }
};

exports.saveSignatory = async (data) => {
  try {
    // Save signatory logic goes here
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while saving signatory');
  }
};
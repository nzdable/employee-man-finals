const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
  employeeName: {
    type: String,
    required: false,
  },
  superiorName: {
    type: String,
    required: false,
  },
  leaveType: {
    type: String,
    required: false,
  },
  leaveStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  startDate: {
    type: Date,
    required: false,
  },
  endDate: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Leave = mongoose.model('Leave', LeaveSchema);
module.exports = Leave;
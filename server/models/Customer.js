const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
  employeeId: {
    type: String,
    required: false,
    unique: true,
    default: generateEmployeeId
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  tel: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  department: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  destination: {
    type: String,
    required: false
  },
  position: {
    type: String,
    required: false
  },
  addressLine: {
    type: String,
    required: false
  },
  barangay: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  province: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  zipcode: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

function generateEmployeeId() {
  // Generate employee ID with leading zeros
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return '0000' + randomNumber.toString();
}

module.exports = mongoose.model('Customer', CustomerSchema);
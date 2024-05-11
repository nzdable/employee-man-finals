const Department = require("../models/Department");

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
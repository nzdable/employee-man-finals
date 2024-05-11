const Type = require("../models/Type");

exports.getAllDestinations = async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

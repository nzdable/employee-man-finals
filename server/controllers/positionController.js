const Position = require("../models/Position");

exports.getAllPositions= async (req, res) => {
  try {
    const position = await Position.find();
    res.json(positions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


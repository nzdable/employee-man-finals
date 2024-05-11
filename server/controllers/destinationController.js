const Destination = require("../models/Destination");

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
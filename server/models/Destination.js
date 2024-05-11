const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({


  name: {
    type: String,
    required: true,
  },

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },

});

module.exports = mongoose.model('Destination', destinationSchema);
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    rut: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', ContactSchema);

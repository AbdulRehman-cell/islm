const mongoose = require('mongoose');

const contactmessagesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      trim: true,
      default: ''
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contactmessages', contactmessagesSchema);
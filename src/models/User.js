const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    ext: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    register: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        login: {
          type: Date,
          default: Date.now,
        },
        logout: {
          type: Date,
        },
      },
    ],
    pauses: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        pauseType: {
          type: String,
        },
        start: {
          type: Date,
          default: Date.now,
        },
        end: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

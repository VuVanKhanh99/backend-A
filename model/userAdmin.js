const mongoose = require("mongoose");

const userAdmin =new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your username"],
    },
    firstName: {
      type: String,
      required: [true, "Please enter your firstname"],
    },
    lastName: {
      type: String,
      require: [true, "Please enter your lastname"],
    },
    password: {
      type: String,
      require: [true, "Please enter your password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userAdmin", userAdmin);

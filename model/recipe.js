const mongoose = require("mongoose");

const Recipe = new mongoose.Schema(
  {
    output: String,
    input: String,
    quantity: Number,
    unit: String,
    recipe: Array,
    material: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", Recipe);

const mongoose = require("mongoose");

const materialPrice = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    unit: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const stuffPrice = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    quantity: {
      type: String,
    },
    unit: {
      type: String,
    },
    totalPrice: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const incompleteProd = new mongoose.Schema({
  codeReq: String,
  quantity: Number,
});

const MaterialPrice = mongoose.model("MaterialPrice", materialPrice);
const StuffPrice = mongoose.model("StuffPrice", stuffPrice);
const IncompleteProd = mongoose.model("IncompleteProd", incompleteProd);

module.exports = { MaterialPrice, StuffPrice, IncompleteProd };

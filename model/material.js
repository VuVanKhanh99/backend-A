const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const unitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please enter your material"],
    },
    type: {
      type: String,
      require: [true, "Please enter type material"],
    },
    code: {
      type: Number,
    },
    unit: {
      type: String,
    },
    redundantThe: {
      type: String,
    },
    redundantRe: {
      type: String,
    },
    process: {
      type: String,
    },
    durable: {
      type: Number,
    },
    amountPerson: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", unitSchema);
const Process = mongoose.model("Process", processSchema);
const Material = mongoose.model("Material", materialSchema);

module.exports = { Process, Material, Unit };

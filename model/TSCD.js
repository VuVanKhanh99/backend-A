const mongoose = require("mongoose");

const tscd = new mongoose.Schema(
  {
    typeTSCD: String,
    peak: String,
    payCost: String,
  },
  {
    timestamps: true,
  }
);

const accountTSCD = new mongoose.Schema(
  {
    typeTSCD: String,
    totalPeak: String,
  },
  {
    timestamps: true,
  }
);
const TSCD = mongoose.model("TSCD", tscd);
const AccountTSCD = mongoose.model("AccountTSCD", accountTSCD);

module.exports = { TSCD, AccountTSCD };

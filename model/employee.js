const mongoose = require("mongoose");

const categoryEmployee = new mongoose.Schema({
  name: {
    type: String,
  },
  indexPayslip: {
    type: Number,
  },
  incomeGross: {
    type: String,
  },
});

const manageEmployee = new mongoose.Schema({
  typeEm: {
    type: String,
  },
  quantityEm: {
    type: Number,
  },
  BHXH: {
    type: Number,
  },
  BHYT: {
    type: Number,
  },
  BHTN: {
    type: Number,
  },
});

const accountantEm = new mongoose.Schema({
  red334: {
    type: String,
  },
  green3383: {
    type: String,
  },
  green3384: {
    type: String,
  },
  green3385: {
    type: String,
  },
  red154:{
    type: String
  }
});

const consultInfo133 = new mongoose.Schema({
  red154: {
    type: String,
  },
  red6412: {
    type: String,
  },
  red6422: {
    type: String,
  },
  green334: {
    type: String,
  },
})

const costConsultInfo133 = new mongoose.Schema({
  red154: {
    type: String,
  },
  red6412: {
    type: String,
  },
  red6422: {
    type: String,
  },
  green3382: {
    type: String,
  },
  green3383: {
    type: String,
  },
  green3384: {
    type: String,
  },
  green3385: {
    type: String,
  },
})


const CostConsultInfo133 = mongoose.model("CostConsultInfo133",costConsultInfo133);
const ConsultInfo133 = mongoose.model("ConsultInfo133", consultInfo133);
const CategoryEmployee = mongoose.model("CategoryEmployee", categoryEmployee);
const ManageEmployee = mongoose.model("ManageEmployee", manageEmployee);
const AccountantEm = mongoose.model("AccountantEm", accountantEm);

module.exports = { CategoryEmployee, ManageEmployee, AccountantEm,ConsultInfo133,CostConsultInfo133 };

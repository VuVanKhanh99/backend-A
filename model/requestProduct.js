const mongoose = require("mongoose");

const requestProduct = new mongoose.Schema(
  {
    codeReq: {
      type: String,
    },
    nameProduct: {
      type: String,
    },
    statusReq: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    typeReq: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const reqMaterialProd = new mongoose.Schema({
  codeReq: String,
  materials: Array,
});

const reqEmployeeProd = new mongoose.Schema({
  codeReq: String,
  amountPersonNe: Number,
  productMade: Number,
  redanduntMadeProd: Number,
  incompleteProd:Number,
});

const RequestProduct = mongoose.model("RequestProduct", requestProduct);
const ReqMaterialProd = mongoose.model("ReqMaterialProd", reqMaterialProd);
const ReqEmployeeProd = mongoose.model("ReqEmployeeProd", reqEmployeeProd);

module.exports = {
  RequestProduct,
  ReqMaterialProd,
  ReqEmployeeProd
};

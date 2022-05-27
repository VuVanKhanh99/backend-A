const asyncHandler = require("express-async-handler");
const listTypePeak = require("../../contants/typeTSCD");
const { TSCD, AccountTSCD } = require("../../model/TSCD");
const { IncompleteProd } = require("../../model/price");
const { RequestProduct } = require("../../model/requestProduct");
const {typeCreateRe} = require("../../contants/createReq");

const {
  convertCurrencyToNumber,
  formartToCurrency,
} = require("../../utils/function");

const createTSCD = asyncHandler(async (req, res) => {
  const { nameType, peak, payCost } = req.body;
  await TSCD.create(
    {
      typeTSCD: nameType,
      peak,
      payCost,
    },
    (err, res) => {
      if (err) return res.status(403).json({ message: err });
    }
  );

  return res.status(201).json({ message: "Tạo khấu hao thành công !" });
});

const getTSCD = asyncHandler(async (req, res) => {
  const data = await TSCD.find();
  return res.status(201).json({ data });
});

const createAccountTSCD = asyncHandler(async (req, res) => {
  await AccountTSCD.remove({});

  const data = await TSCD.find();
  let arr1 = [];
  let arr2 = [];
  let arr3 = [];

  data.map((item) => {
    if (item?.typeTSCD === listTypePeak[0])
      arr1 = [...arr1, convertCurrencyToNumber(item?.payCost)];
    if (item?.typeTSCD === listTypePeak[1])
      arr2 = [...arr2, convertCurrencyToNumber(item?.payCost)];
    if (item?.typeTSCD === listTypePeak[2])
      arr3 = [...arr3, convertCurrencyToNumber(item?.payCost)];
  });
  const reducer = (accum, curr) => +accum + +curr;
  const total1 = arr1.length > 0 && arr1.reduce(reducer);
  const total2 = arr2.length > 0 && arr2.reduce(reducer);
  const total3 = arr3.length > 0 && arr3.reduce(reducer);

  await AccountTSCD.create(
    {
      typeTSCD: listTypePeak[0],
      totalPeak: formartToCurrency(total1),
    },
    {
      typeTSCD: listTypePeak[1],
      totalPeak: formartToCurrency(total2),
    },
    {
      typeTSCD: listTypePeak[2],
      totalPeak: formartToCurrency(total3),
    },
    (err, res) => {
      if (err) return res.status(403).send({ message: err });
    }
  );

  return res
    .status(201)
    .send({ message: "Kế toán chi phí TSCĐ theo loại thành công !" });
});

const deleteTSCD = asyncHandler(async (req, res) => {
  const { id } = req.body;
  await TSCD.findByIdAndRemove(id);
  return res.status(201).send({ message: "Xóa TSCD thành công !" });
});

const getAccountTSCD = asyncHandler(async (req, res) => {
  const data = await AccountTSCD.find();
  return res.status(201).json({ data });
});

const createIncompleteProd = asyncHandler(async (req, res) => {
  const { codeReq, quantity } = req.body;
  const check = await RequestProduct.findOne({ codeReq });
  if(+quantity > Math.ceil(+check?.quantity / 15)) return res.status(403).send({message: 'Số lượng sản phẩm dở dang bị vượt chuẩn ,không thể lưu !'})

  const checkExsist = await IncompleteProd.findOne({codeReq});
  if(checkExsist) return res.status(403).send({message: 'Sản phẩm dở dang của đơn hàng này đã tồn tại !'});

  await IncompleteProd.create(
    {
      codeReq,
      quantity,
    },
    (err, res) => {
      if (err) return res.status(403).json({ message: err });
    }
  );

  return res.status(201).json({ message: "Tạo sản phẩm dở dang thành công !" });
});

const getListIncompleteProd = asyncHandler(async (req, res) => {
  const data = await IncompleteProd.find();
  return res.status(201).json({ data });
});

const deleteIncompleteProd = asyncHandler(async (req, res) => {
  const { codeReq } = await req.body;
  await IncompleteProd.remove({ codeReq });
  return res.status(201).json({ message: "Xóa sản phẩm dở dang thành công !" });
});

module.exports = {
  createTSCD,
  createAccountTSCD,
  getAccountTSCD,
  getTSCD,
  deleteTSCD,
  createIncompleteProd,
  getListIncompleteProd,
  deleteIncompleteProd,
};

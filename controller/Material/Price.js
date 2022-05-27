const { MaterialPrice, StuffPrice } = require("../../model/price");
const asyncHandler = require("express-async-handler");
const {
  convertCurrencyToNumber,
  formartToCurrency,
} = require("../../utils/function");

const createItemPrice = asyncHandler(async (req, res) => {
  const { name, price, unit } = req.body;
  const checkExit = await MaterialPrice.findOne({ name });
  if (checkExit)
    return res.status(403).send({ message: "Giá nguyên liệu đã tồn tại !" });
  MaterialPrice.create(
    {
      name,
      price,
      unit,
    },
    (err, res) => {
      return err && res.status(402).send({ message: err });
    }
  );
  return res.status(201).send({ message: "Tạo định giá thành công !" });
});

const getListItemPrice = asyncHandler(async (req, res) => {
  const data = await MaterialPrice.find();
  return res.status(201).json({ data });
});

const deleteItemPrice = asyncHandler(async (req, res) => {
  const { nameItem } = req.body;
  await MaterialPrice.remove({ name: nameItem });
  return res
    .status(201)
    .json({ message: "Xóa định giá nguyên liệu thành công !" });
});

const createStuffPrice = asyncHandler(async (req, res) => {
  const { name, price, quantity, unit } = req.body;
  const checkExit = await StuffPrice.findOne({ name });
  if (checkExit)
    return res.status(403).send({ message: "Định giá vật tư đã tồn tại !" });

  const total = +convertCurrencyToNumber(price) * +quantity;

  StuffPrice.create(
    { name, price, quantity, unit, totalPrice: formartToCurrency(total) },
    (err, res) => {
      return err && res.status(402).send({ message: err });
    }
  );

  return res
    .status(201)
    .send({ message: "Tạo định giá vật liệu phụ thành công !" });
});

const getListStuffPrice = asyncHandler(async (req, res) => {
  const data = await StuffPrice.find();
  return res.status(201).json({ data });
});

const deleteStuffPrice = asyncHandler(async (req, res) => {
  const { nameStuff } = req.body;
  await StuffPrice.remove({ name: nameStuff });
  return res
    .status(201)
    .send({ message: "Xóa định giá vật liệu thành công !" });
});

module.exports = {
  createItemPrice,
  getListItemPrice,
  deleteItemPrice,
  createStuffPrice,
  getListStuffPrice,
  deleteStuffPrice,
};

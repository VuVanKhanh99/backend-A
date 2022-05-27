const { Unit } = require("../../model/material");
const asyncHandler = require("express-async-handler");

const createUnit = asyncHandler(async (req, res) => {
  const { nameUnit } = req.body;

  const checkUnitExist = await Unit.findOne({ name: nameUnit });
  if (checkUnitExist) {
    return res.status(401).send({ message: "Đơn vị này đã tồn tại !" });
  }
  
  Unit.create({ name: nameUnit }, (err, res) => {
    return err && res.status(402).json({ message: err });
  });

  res.status(201).send({ message: "Tạo đơn vị thành công !" });
});

const getListUnit = asyncHandler(async (req, res) => {
  const dataList = await Unit.find();
  return res.status(201).json({ data: dataList });
});

const deleteUnit = asyncHandler(async (req, res) => {
  const { nameUnit } = req.body;
  await Unit.remove({ name: nameUnit });
  return res.status(201).json({ message: "Xóa đơn vị thành công !" });
});

module.exports = { createUnit, getListUnit, deleteUnit };

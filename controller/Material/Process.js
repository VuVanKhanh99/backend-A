const { Process } = require("../../model/material");
const asyncHandler = require("express-async-handler");

const createProcess = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const checkExist = await Process.findOne({ name });

  if (checkExist)
    return res.status(401).send({ message: "Công đoạn đã tồn tại !" });

  Process.create({ name }, (err, res) => {
    return err && res.status.json({ message: err });
  });

  res.status(201).send({ message: "Tạo công đoạn thành công !" });
});

const getListProcess = asyncHandler(async (req,res)=>{
  const data = await Process.find();
  return res.status(201).json({data})
})

const deleteProcess = asyncHandler(async (req, res) => {
  const { nameProcess } = req.body;
  await Process.remove({ name: nameProcess });
  return res.status(201).json({ message: "Xóa công đoạn thành công !" });
});

module.exports = { createProcess,getListProcess,deleteProcess };

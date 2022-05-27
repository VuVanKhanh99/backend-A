const asyncHandler = require("express-async-handler");
const { Material, Process } = require("../../model/material");
const Recipe = require("../../model/recipe");

const addMaterial = asyncHandler(async (req, res) => {
  const { obj } = req.body;
  const {
    name,
    type,
    code,
    unit,
    redundantThe,
    redundantRe,
    process,
    durable,
    amountPerson,
  } = JSON.parse(obj);

  if (name && type && code && unit) {
    const checkCode = await Material.findOne({ code });
    const checkName = await Material.findOne({ name });
    if (checkCode) {
      return res.status(401).send({
        message: "Mã vật tư đã tồn tại !",
      });
    }

    if (checkName) {
      return res.status(401).send({
        message: "Tên vật tư đã tồn tại !",
      });
    }

    const newMa = new Material({
      name,
      type,
      code,
      unit,
      redundantThe,
      redundantRe,
      process,
      durable,
      amountPerson,
    });

    newMa.save().catch((err) => {
      console.log(err);
      return res.status(401).json({ message: err });
    });

    return res.status(201).send({
      message: "Tạo vật tư thành công !",
    });
  } else {
    res.status(400);
    throw new Error(res.err);
  }
});

const getAllMaterial = asyncHandler(async (req, res) => {
  const dataList = await Material.find();
  return res.status(201).json({ data: dataList });
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const dataRecipe = await Recipe.find();
  const checkData = dataRecipe.filter(
    (item) => item.input === name || item.output === name
  );
  console.log(checkData);
  if (checkData?.length > 0)
    return res
      .status(403)
      .send({
        message:
          "Không thể xóa vật tư này vì nó đang nằm trong định mức vật tư !",
      });

  await Material.remove({ name });
  return res.status(201).json({ message: "Xóa vật liệu thành công" });
});


module.exports = { addMaterial, getAllMaterial,deleteMaterial };

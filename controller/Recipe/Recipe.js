const Recipe = require("../../model/recipe");
const asyncHandler = require("express-async-handler");
const { removeDuplicates } = require("../../utils/function");

const createRecipe = asyncHandler(async (req, res) => {
  const { output, input, quantity, unit } = req.body;
  const checkOutput = await Recipe.findOne({ output });

  if (checkOutput?.input === input) {
    return res.status(403).send({ message: "Định mức vật tư đã tồn tại !" });
  }

  const data = await Recipe.find();
  const checkData = data.filter((item) => item?.output === input);
  let recipe = [];
  let arrMaterial = [];

  if (!checkData[0]) {
    recipe = [input, "multi", +quantity];
    arrMaterial = [...arrMaterial, output, input];

    const recipes = new Recipe({
      output,
      input,
      quantity,
      unit,
      recipe,
      material: arrMaterial,
    });

    recipes.save((err, res) => {
      return err && res.status(403).send({ message: err });
    });

    return res
      .status(201)
      .send({ message: "Tạo định mức vật tư thành công !" });
  } else {
    //console.log(checkData);

    let arr = [];
    let gu = [];
    checkData.map((item) => {
      let test = item?.recipe;
      if (!Array.isArray(test[0])) {
        test[2] = +test[2] * quantity;
        arr = [...arr, test];
      } else {
        test.map((i) => {
          i[2] = +i[2] * +quantity;
          arr = [...arr, i];
        });

        //console.log(arr);
      }
    });

    let dataRe = [];
    checkData.map((item) => {
      arrMaterial = item.material.concat(arrMaterial);
    });

    arrMaterial = [...arrMaterial, output];

    if (arr?.length > 0) {
      const valueArr = arr.map(function (item) {
        return item[0];
      });
      const isDuplicate = valueArr.filter(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });

      if (isDuplicate?.length > 0) {
        isDuplicate.map((em) => {
          let ta = 0;
          arr.map((item) => {
            if (item[0] === em) {
              ta += +item[2];
            }
          });
          let maoc = [em, "multi", ta];
          dataRe = [...dataRe, maoc];
        });

        const dataRel = valueArr.filter((item) => !isDuplicate.includes(item));

        dataRel.map((em) => {
          arr.map((item) => {
            if (item[0] === em) {
              let maoc = [em, "multi", +item[2]];
              dataRe = [...dataRe, maoc];
            }
          });
        });

        const recipes = new Recipe({
          output,
          input,
          quantity,
          unit,
          recipe: dataRe,
          material: removeDuplicates(arrMaterial),
        });

        recipes.save((err, res) => {
          return err && res.status(403).send({ message: err });
        });

        return res
          .status(201)
          .send({ message: "Tạo định mức vật tư thành công !" });
      } else {
        const recipes = new Recipe({
          output,
          input,
          quantity,
          unit,
          recipe: arr,
          material: removeDuplicates(arrMaterial),
        });

        recipes.save((err, res) => {
          return err && res.status(403).send({ message: err });
        });

        return res
          .status(201)
          .send({ message: "Tạo định mức vật tư thành công !" });
      }
    }
  }
});

const getListRecipe = asyncHandler(async (req, res) => {
  const listData = await Recipe.find();
  return res.status(201).send({ data: listData });
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.body;
  await Recipe.findByIdAndRemove(id);
  return res.status(201).send({ message: "Xóa định mức vật tư thành công !" });
});


module.exports = { createRecipe, getListRecipe, deleteRecipe };

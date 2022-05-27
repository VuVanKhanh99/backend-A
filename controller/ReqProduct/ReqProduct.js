const asyncHandler = require("express-async-handler");
const { Material } = require("../../model/material");
var moment = require("moment");
const Recipe = require("../../model/recipe");
const {
  RequestProduct,
  ReqMaterialProd,
  ReqEmployeeProd,
} = require("../../model/requestProduct");
const { TSCD, AccountTSCD } = require("../../model/TSCD");
const {
  convertToDate,
  convertCurrencyToNumber,
  formartToCurrency,
  isFloat,
} = require("../../utils/function");
const {
  ManageEmployee,
  AccountantEm,
  CategoryEmployee,
} = require("../../model/employee");
const listTypeEm = require("../../contants/typeEm");
const listTypePeak = require("../../contants/typeTSCD");
const { MaterialPrice } = require("../../model/price");
const taxGTGT = require("../../contants/taxGTGT");

const createNewReqProduct = asyncHandler(async (req, res) => {
  const { obj } = req.body;
  const { codeReq, product, statusReq, quanTity, dayStart, dayEnd, typeReq } =
    JSON.parse(obj);

  if (codeReq && product) {
    const checkCodeReq = await RequestProduct.findOne({ codeReq });

    if (checkCodeReq) {
      return res.status(401).send({
        message: "Mã yêu cầu đã tồn tại !",
      });
    }

    await RequestProduct.create(
      {
        codeReq,
        nameProduct: product,
        statusReq,
        quantity: quanTity,
        startDate: dayStart,
        endDate: dayEnd,
        typeReq,
      },
      (err, res) => {
        if (err) return res.status(403).send({ message: err });
      }
    );

    return res.status(201).send({
      message: "Tạo yêu cầu sản xuất thành công !",
    });
  } else {
    res.status(400);
    throw new Error(res.err);
  }
});

const getReqProduct = asyncHandler(async (req, res) => {
  const data = await RequestProduct.find();
  return res.status(201).json({ data });
});

const deleteReqProduct = asyncHandler(async (req, res) => {
  const { codeReq } = req.body;
  await RequestProduct.remove({ codeReq });
  return res.status(201).send({ message: "Xóa yêu cầu sản xuất thành công !" });
});

const getRedanduntProd = asyncHandler(async (codeReq, isDelete) => {
  const dataEm = await ReqEmployeeProd.find();
  const dataReqProd = await RequestProduct.find();

  const dataCheck = dataReqProd.filter((item) => item.codeReq === codeReq)[0]
    ?.nameProduct;
  const dataCurrent = dataReqProd.filter((item) => item.codeReq === codeReq)[0];
  const startCurrent = dataCurrent.startDate;

  const listCheck = dataReqProd.filter(
    (item) => item.nameProduct === dataCheck
  );

  const listCheckDate = dataReqProd.filter((item) => {
    return convertToDate(item.endDate) < convertToDate(startCurrent);
  });

  const listCodeReq = listCheck.map((item) => {
    return item.codeReq;
  });

  const listCodeStart = listCheckDate.map((item) => {
    return item.codeReq;
  });

  let totalRe = 0;

  dataEm.map(async (item) => {
    if (
      listCodeReq.includes(item.codeReq) &&
      listCodeStart.includes(item.codeReq)
    ) {
      totalRe += +item.redanduntMadeProd;
      isDelete &&
        (await ReqEmployeeProd.findOneAndUpdate(
          { codeReq: item.codeReq },
          { $set: { redanduntMadeProd: 0 } },
          { useFindAndModify: false }
        ));
    }
  });

  return totalRe;
});

const calculatorProcessProduct = asyncHandler(async (req, res) => {
  const { product, codeReq, amount } = req.body;

  const dataRecipe = await Recipe.find();
  const dataMaterials = await Material.find();

  const totalRe = await getRedanduntProd(codeReq, false);

  const checkData = dataRecipe.filter((item) => item?.output === product);

  if (checkData?.length === 0)
    return res
      .status(403)
      .send({ message: "Bạn chưa có định mức vật tư cho sản phẩm này !" });

  let data = checkData[0]?.recipe;
  let dataArr = [];

  data.map((item) => {
    const check = dataMaterials.filter((te) => te.name === item[0]);
    if (check?.length > 0) {
      item = [...item, check[0]?.unit];
    }
    dataArr = [...dataArr, item];
  });

  const amountRe = req.body?.incompleteProd ? req.body?.incompleteProd : 0;

  console.log(amount, totalRe, amountRe);

  dataArr.map((item) => {
    item[2] = +item[2] * (+amount - totalRe - amountRe);
  });

  await ReqMaterialProd.create(
    {
      codeReq,
      materials: dataArr,
    },
    (err, res) => {
      if (err) return res.status(403).send({ message: err });
    }
  );

  return res.status(201).json({ message: "Tính vật liệu thành công !" });
});

const calculatorEmployeeProduct = asyncHandler(async (req, res) => {
  const { product, amount, date, codeReq } = req.body;
  const totalRe = await getRedanduntProd(codeReq, true);
  const leftProcess = +amount - totalRe;

  const dataEm = await ManageEmployee.find();
  const quantityEmTotal = dataEm.filter(
    (item) => item.typeEm === listTypeEm[1]
  )[0]?.quantityEm;
  const dataEmProd = await ReqEmployeeProd.find();
  const listAmountEm = dataEmProd.map((item) => {
    return item.amountPersonNe;
  });

  const checkTotal = (acumula, curr) => +acumula + +curr;

  let totalCurr = 0;

  if (listAmountEm?.length > 0) {
    totalCurr = listAmountEm.reduce(checkTotal);
  }

  const totalLeft = +quantityEmTotal - totalCurr;

  //console.log(totalRe, leftProcess);

  // const product = "Áo thành phẩm";
  // const amount = 320;
  // const date = 24;

  const dataMaterial = await Material.find();
  const dataRecipe = await Recipe.find();

  const dataCheck = dataRecipe.filter((item) => item?.output === product)[0]
    ?.material;
  let totalTimeOne = 0;
  dataMaterial.map((item) => {
    if (dataCheck?.includes(item.name)) {
      let time = +item.amountPerson * +item.durable;
      totalTimeOne += time;
    }
  });

  //mỗi người làm 1 cái áo (ngày)
  const productTimePerson = totalTimeOne / 480;
  const amountPersonNe = Math.ceil((leftProcess * productTimePerson) / date);
  const productMade = Math.floor((amountPersonNe * date) / productTimePerson);
  const redanduntMadeProd = productMade - leftProcess;
  const checkFloat = isFloat((amountPersonNe * date) / productTimePerson);

  console.log(
    leftProcess,
    productTimePerson,
    redanduntMadeProd,
    date,
    checkFloat,
    (amountPersonNe * date) / productTimePerson
  );

  if (amountPersonNe > totalLeft) {
    await ReqMaterialProd.remove({ codeReq });
    return res.status(403).send({
      message: "Số lượng công nhân không đủ để hoàn thành đơn hàng này !",
    });
  } else {
    await ReqEmployeeProd.create(
      {
        codeReq,
        amountPersonNe,
        productMade,
        redanduntMadeProd,
        incompleteProd: checkFloat ? 1 : 0,
      },
      (err, res) => {
        if (err) return res.status(403).send({ message: err });
      }
    );

    return res.status(201).json({ message: "Tính vật liệu thành công !" });
  }
});

const getMaterialOneProd = asyncHandler(async (req, res) => {
  const { codeReq } = req.params;
  const data = await ReqMaterialProd.findOne({ codeReq });

  return res.status(201).send({ data });
});

const getEmployeeOneProd = asyncHandler(async (req, res) => {
  const { codeReq } = req.params;
  const data = await ReqEmployeeProd.findOne({ codeReq });

  return res.status(201).send({ data });
});

const getDataMaterialProd = asyncHandler(async (req, res) => {
  const data = await ReqMaterialProd.find();

  return res.status(201).send({ data });
});

const getDataEmployeeProd = asyncHandler(async (req, res) => {
  const data = await ReqEmployeeProd.find();

  return res.status(201).send({ data });
});

const getReqCurrentProd = asyncHandler(async (req, res) => {
  const dataMaterial = await ReqMaterialProd.find();
  const dataEmployee = await ReqEmployeeProd.find();
  const listReqProduct = await RequestProduct.find();

  const dataMate = dataMaterial.map((item) => {
    return item.codeReq;
  });
  const dataEm = dataEmployee.map((item) => {
    return item.codeReq;
  });
  const dataReq = listReqProduct.map((item) => {
    return item.codeReq;
  });
  //console.log(dataEm,listReqProduct);
  let data = [];
  dataEm.map((item) => {
    if (dataMate?.includes(item) && dataReq?.includes(item)) {
      const val = listReqProduct.filter((net) => net.codeReq === item)[0];
      data = [...data, val];
    }
  });
  return res.status(201).send({ data });
});

const getDataReqProd = asyncHandler(async (req, res) => {
  const dataMaterial = await ReqMaterialProd.find();
  const dataEmployee = await ReqEmployeeProd.find();
  const listReqProduct = await RequestProduct.find();

  const dataMate = dataMaterial.map((item) => {
    return item.codeReq;
  });
  const dataEm = dataEmployee.map((item) => {
    return item.codeReq;
  });
  const dataReq = listReqProduct.map((item) => {
    return item.codeReq;
  });
  //console.log(dataEm,listReqProduct);
  let data = [];
  dataEm.map((item) => {
    if (dataMate?.includes(item) && dataReq?.includes(item)) {
      const val = listReqProduct.filter((net) => net.codeReq === item)[0];
      data = [...data, val];
    }
  });
  return data;
});

const handleGetCurr = asyncHandler(async (codeReq) => {
  const data = await getDataReqProd();
  const checkData = await RequestProduct.findOne({ codeReq });
  const listTSCD = await TSCD.find();
  const dayReqStart = checkData.startDate;
  const dayReqEnd = checkData.endDate;

  let dataTSCD = [];
  listTSCD.map((item) => {
    if (item.typeTSCD === listTypePeak[0]) {
      let dayCreate = item.createdAt;
      let dayFormat = moment(new Date(dayCreate), "DD-MM-YYYY")
        .utc()
        .format("DD-MM-YYYY");
      if (
        convertToDate(dayReqStart) < convertToDate(dayFormat) &&
        convertToDate(dayFormat) < convertToDate(dayReqEnd)
      ) {
        dataTSCD = [...dataTSCD, item];
      }
    }
  });
  //dataTSCD
  let dataLeft = [];
  if (dataTSCD?.length === 1) {
  } else if (dataTSCD?.length >= 2) {
    //console.log(dataTSCD);
    dataTSCD.map((item) => {
      let time = moment(new Date(item.createdAt), "DD-MM-YYYY")
        .utc()
        .format("DD-MM-YYYY");
      data.map((val) => {
        let dayReqStart = val.startDate;
        let dayReqEnd = val.endDate;
        if (
          convertToDate(dayReqStart) < convertToDate(time) &&
          convertToDate(time) < convertToDate(dayReqEnd)
        ) {
          dataLeft = [...dataLeft, val];
        }
      });
    });
  }

  const listId = dataLeft.map((item) => {
    return item.codeReq;
  });

  const length = handleDuplicate(listId)?.length;

  return length;
});

const handleDuplicate = (arr) => {
  if (arr) {
    const result = arr.filter((item, i) => {
      return arr.indexOf(item) === i;
    });
    return result;
  }
};

const deleteMaterialProd = asyncHandler(async (req, res) => {
  const { codeReq } = req.body;
  await ReqMaterialProd.remove({ codeReq });
  return res.status(201).send({ message: "Xóa kế toán vật tư thành công !" });
});

const deleteEmployeeProd = asyncHandler(async (req, res) => {
  const { codeReq } = req.body;
  await ReqEmployeeProd.remove({ codeReq });
  return res
    .status(201)
    .send({ message: "Xóa kế toán nhân công thành công !" });
});

const calcalatorAccountProductMa = asyncHandler(async (req, res) => {
  const { codeReq } = req.body;
  // const codeReq = "004";
  const dataMateProd = await ReqMaterialProd.find();
  const dataEmProd = await ReqEmployeeProd.find();
  const dataPriceMa = await MaterialPrice.find();
  const dataListTypeEm = await ManageEmployee.find();
  const dataCateEm = await CategoryEmployee.find();
  const dataTSCD = await AccountTSCD.find();
  const dataReqProd = await RequestProduct.find();

  const listMate = dataMateProd.filter((item) => item.codeReq === codeReq)[0]
    ?.materials;
  let priceMa = 0;

  listMate.map((item) => {
    let mate = item[0];
    let check = dataPriceMa.filter((val) => val.name === mate)[0];
    if (check) {
      priceMa += convertCurrencyToNumber(check.price) * +item[2];
    } else {
      return res.status.json({ message: `${mate} đang thiếu giá đầu vào` });
    }
  });

  const amountEm = dataEmProd.filter((item) => item.codeReq === codeReq)[0]
    ?.amountPersonNe;

  const amountManaHouse = dataListTypeEm.filter(
    (item) => item.typeEm === listTypeEm[0]
  )[0]?.quantityEm;

  let totalEm = 0;

  dataCateEm.map((item) => {
    if (item.name === listTypeEm[0]) {
      totalEm +=
        (+convertCurrencyToNumber(item.incomeGross) * amountManaHouse) / 3;
    }
    if (item.name === listTypeEm[1]) {
      totalEm += +convertCurrencyToNumber(item.incomeGross) * amountEm;
    }
  });

  // console.log(formartToCurrency(totalEm), amountEm, amountManaHouse);

  const tk154Company = (totalEm * 24) / 100;

  const lengthCurr =await handleGetCurr(codeReq);

  const tk154TSCD = dataTSCD.filter(
    (item) => item?.typeTSCD == listTypePeak[0]
  )[0]?.totalPeak;
  
  //console.log(priceMa, totalEm, tk154Company, tk154TSCD,(+convertCurrencyToNumber(tk154TSCD)/+lengthCurr));

  const resultTotal133 =
    +priceMa + +totalEm + +tk154Company + (+convertCurrencyToNumber(tk154TSCD)/+lengthCurr);

  const amountProdRe = +dataEmProd.filter((item) => item.codeReq === codeReq)[0]
    ?.incompleteProd;

  const quantiProcess = +dataEmProd.filter(
    (item) => item.codeReq === codeReq
  )[0]?.productMade;

  const costRedantdunt =
    (resultTotal133 / (amountProdRe + quantiProcess)) * amountProdRe;

  const costAccumlator = (resultTotal133 - costRedantdunt) / quantiProcess;

 // console.log(resultTotal133,amountProdRe,quantiProcess,costRedantdunt)
  //console.log(resultTotal133, costRedantdunt, costAccumlator,amountProdRe);

  //console.log(resultTotal, formartToCurrency(Math.ceil(resultTotal133)));

  const data = {
    result133: resultTotal133,
    costRedantdunt, 
    costAccumlator,
    amountProd: quantiProcess,
    taxGTGT:taxGTGT,
  };

  return res.status(201).json({ data });
});

const updateEmProd = asyncHandler(async (req, res) => {
  const { codeReq, incompleteProd } = req.body;

  // console.log(codeReq,incompleteProd);
  // (await ReqEmployeeProd.findOneAndUpdate(
  //   { codeReq: item.codeReq },
  //   { $set: { redanduntMadeProd: 0 } },
  //   { useFindAndModify: false }
  // ));

  const dataMade = await RequestProduct.findOne({ codeReq });

  console.log(dataMade);

  await ReqEmployeeProd.findOneAndUpdate(
    { codeReq: codeReq },
    {
      $set: {
        productMade: +dataMade.quantity - +incompleteProd,
        redanduntMadeProd: 0,
        incompleteProd: incompleteProd,
      },
    },
    { useFindAndModify: false }
    // (err, res) => {
    //   if (err) return res.status(403).send({ message: err });
    // }
  );
  return res
    .status(201)
    .send({ message: "Cập nhật lại nhân công thành công !" });
});

//calcalatorAccountProductMa();
module.exports = {
  createNewReqProduct,
  getReqProduct,
  deleteReqProduct,
  calculatorProcessProduct,
  calculatorEmployeeProduct,
  getMaterialOneProd,
  getEmployeeOneProd,
  getDataMaterialProd,
  getDataEmployeeProd,
  deleteEmployeeProd,
  deleteMaterialProd,
  getReqCurrentProd,
  calcalatorAccountProductMa,
  updateEmProd,
};

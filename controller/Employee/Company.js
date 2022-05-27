const asyncHandler = require("express-async-handler");
const { indexInsurenceCom } = require("../../contants/payslip");
const listTypeEm = require("../../contants/typeEm");
const {
  ConsultInfo133,
  CategoryEmployee,
  ManageEmployee,
  CostConsultInfo133
} = require("../../model/employee");
const { getToListName } = require("../../utils/function");
const {
  formartToCurrency,
  convertCurrencyToNumber,
} = require("../../utils/function");

const createConsultInfo133 = asyncHandler(async (req, res) => {
  const dataCategoryEm = await CategoryEmployee.find();
  const arrCateEm = getToListName(dataCategoryEm);

  const check1 = arrCateEm.includes(listTypeEm[0]);
  const check2 = arrCateEm.includes(listTypeEm[1]);
  const check3 = arrCateEm.includes(listTypeEm[2]);
  const check4 = arrCateEm.includes(listTypeEm[3]);

  const dataCateEm = await CategoryEmployee.find();
  const dataManageEm = await ManageEmployee.find();

  let arrTotal = [];

  dataCateEm.map((item) => {
    const incomeGross = item?.incomeGross;
    const checkDataExsist = dataManageEm.filter(
      (val) => item?.name === val.typeEm
    );

    if (checkDataExsist?.length > 0) {
      let quan = +checkDataExsist[0]?.quantityEm;
      let gross = +convertCurrencyToNumber(incomeGross) * quan;

      if (check1 && item?.name === listTypeEm[0]) {
        arrTotal[0] = gross;
      }
      if (check2 && item?.name === listTypeEm[1]) {
        arrTotal[1] = gross;
      }
      if (check3 && item?.name === listTypeEm[2]) {
        arrTotal[2] = gross;
      }
      if (check4 && item?.name === listTypeEm[3]) {
        arrTotal[3] = gross;
      }
    }
  });

  const reducer = (accumulator, im) => accumulator + im;
  const total = arrTotal.reduce(reducer);

  const red154 = arrTotal[0] + arrTotal[1];
  await ConsultInfo133.remove({});

  await ConsultInfo133.create(
    {
      red154: formartToCurrency(red154),
      red6412: formartToCurrency(+arrTotal[2]),
      red6422: formartToCurrency(+arrTotal[3]),
      green334: formartToCurrency(total),
    },
    (err, res) => {
      if (err) return res.status(405).json({ message: err });
    }
  );

  return res
    .status(201)
    .json({ message: "Hạch toán theo Thông tư 133 thành công !" });
});

const getConsultInfo133 = asyncHandler(async (req, res) => {
  const dataEm = await ConsultInfo133.find();
  const data = dataEm[dataEm?.length - 1];

  return res.status(201).json({ data });
});

const createCostConsult133 = asyncHandler(async (req, res)=>{
  const {BHXH,BHYT,BHTN,KPCD} = indexInsurenceCom;

  const data133 = await ConsultInfo133.find();
  const data = data133[data133?.length - 1];

  const totalInsu = +BHXH + +BHYT + +BHTN + +KPCD;
  const red154 = (convertCurrencyToNumber(data?.red154) * totalInsu)/100;
  const red6412 = (convertCurrencyToNumber(data?.red6412) * totalInsu)/100;
  const red6422 = (convertCurrencyToNumber(data?.red6422) * totalInsu)/100;
  const green3382 = (convertCurrencyToNumber(data?.green334) * KPCD)/100;
  const green3383 = (convertCurrencyToNumber(data?.green334) * indexInsurenceCom.BHXH)/100;
  const green3384 = (convertCurrencyToNumber(data?.green334) * indexInsurenceCom.BHYT)/100;
  const green3385 = (convertCurrencyToNumber(data?.green334) * indexInsurenceCom.BHTN)/100;
  
  await CostConsultInfo133.remove({});

  await CostConsultInfo133.create({
    red154:formartToCurrency(red154),
    red6412:formartToCurrency(red6412),
    red6422:formartToCurrency(red6422),
    green3382:formartToCurrency(green3382),
    green3383:formartToCurrency(green3383),
    green3384:formartToCurrency(green3384),
    green3385:formartToCurrency(green3385)
  },(err, res) =>{
    if(err) return res.status(403).json({message:err})
  })

  return res.status(201).json({ message:'Kế toán chi phí doanh nghiệp tài khoản 133 thành công !' });

})

const getCostConsult133 = asyncHandler(async (req, res) => {
  const dataEm = await CostConsultInfo133.find();
  const data = dataEm[dataEm?.length - 1];

  return res.status(201).json({ data });
});

module.exports = { getConsultInfo133, createConsultInfo133,createCostConsult133,getCostConsult133 };

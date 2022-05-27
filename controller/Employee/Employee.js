const asyncHandler = require("express-async-handler");
const {
  CategoryEmployee,
  ManageEmployee,
  AccountantEm,
  ConsultInfo133,
  CostConsultInfo133,
} = require("../../model/employee");

const { payslip, indexInsurenceEm } = require("../../contants/payslip");
const {
  formartToCurrency,
  convertCurrencyToNumber,
} = require("../../utils/function");
const listTypeEm = require("../../contants/typeEm");

const createCategoryEmployee = asyncHandler(async (req, res) => {
  const { name, indexPayslip } = req.body;

  const checkData = await CategoryEmployee.findOne({ name });

  if (checkData)
    return res.status(403).send({ message: "Mục nhân viên đã tồn tại !" });

  const income = payslip.baseIncome * +indexPayslip;

  await CategoryEmployee.create(
    { name, indexPayslip, incomeGross: formartToCurrency(income) },
    (err, res) => {
      err && res.status(402).json({ message: res });
    }
  );

  return res.status(201).send({ message: "Tạo mục nhân viên thành công !" });
});

const getListCategoryEmployee = asyncHandler(async (req, res) => {
  const dataList = await CategoryEmployee.find();
  return res.status(201).json({ data: dataList });
});

const deleteCategoryEmployee = asyncHandler(async (req, res) => {
  const { typeEmployee } = req.body;
  await CategoryEmployee.remove({ name: typeEmployee });
  await ManageEmployee.remove({ typeEm: typeEmployee });
  await AccountantEm.remove({});
  return res
    .status(201)
    .json({ message: "Xóa danh mục nhân viên thành công !" });
});

const createManageEmployee = asyncHandler(async (req, res) => {
  const { typeEm, quantityEm } = req.body;
  const { BHXH, BHYT, BHTN } = indexInsurenceEm;

  const dataCateEm = await CategoryEmployee.find();
  const dataManageEm = await ManageEmployee.find();

  const checkExsist = await ManageEmployee.findOne({ typeEm });

  if (checkExsist)
    return res.status(403).json({
      message: "Tài khoản của loại nhân viên đã tồn tại !",
    });

  if (dataManageEm?.length >= dataCateEm?.length)
    return res.status(403).json({
      message: "Đã nhập đủ ,không thể nhập thêm thông tin các loại nv !",
    });

  ManageEmployee.create(
    {
      typeEm,
      quantityEm,
      BHXH,
      BHYT,
      BHTN,
    },
    (err, res) => {
      err && res.status(402).json({ message: err });
    }
  );

  await AccountantEm.remove({});
  await ConsultInfo133.remove({});
  await CostConsultInfo133.remove({});

  return res.status(201).json({
    message: "Tạo thông tin loại nhân viên thành công !",
  });
});

const getIndexInsurance = asyncHandler(async (req, res) => {
  const data = await ManageEmployee.find();
  const dataCateEm = await CategoryEmployee.find();
  const dataManageEm = await ManageEmployee.find();
  const message =
    dataManageEm?.length >= dataCateEm?.length
      ? null
      : "Bạn phải điền đầy đủ thông tin của các loại nhân viên để hệ thống kế toán !";
  return res.status(201).json({ data, message });
});

const createAccountantEm = asyncHandler(async (req, res) => {
  const { BHXH, BHYT, BHTN } = indexInsurenceEm;


  const totalInsurace = +BHXH + +BHYT + +BHTN;
  const dataCateEm = await CategoryEmployee.find();
  const dataManageEm = await ManageEmployee.find();

  let arrTotal = [];
  let red154 = 0;
  dataCateEm.map((item) => {
    const incomeGross = item?.incomeGross;
    const checkDataExsist = dataManageEm.filter(
      (val) => item?.name === val.typeEm
    );

    if (checkDataExsist?.length > 0) {
      let quan = +checkDataExsist[0]?.quantityEm;
      let gross = +convertCurrencyToNumber(incomeGross) * quan;
      if (item?.name === listTypeEm[0] || item?.name === listTypeEm[1])
        red154 += gross;
      arrTotal = [...arrTotal, gross];
    }
  });

  const reducer = (accumulator, curr) => accumulator + curr;
  const totalIncome = arrTotal.reduce(reducer);

  const red334 = (totalIncome * totalInsurace) / 100;
  const green3383 = (totalIncome * BHXH) / 100;
  const green3384 = (totalIncome * BHYT) / 100;
  const green3385 = (totalIncome * BHTN) / 100;
  await AccountantEm.remove({});

  await AccountantEm.create(
    {
      red334: formartToCurrency(red334),
      green3383: formartToCurrency(green3383),
      green3384: formartToCurrency(green3384),
      green3385: formartToCurrency(green3385),
      red154: formartToCurrency(red154),
    },
    (err, res) => {
      if (err) return res.status(403).json({ message: err });
    }
  );

  return res.status(201).json({ message: "Kế toán bảo hiểm thành công !" });
});

const getAccountantEm = asyncHandler(async (req, res) => {
  const dataEm = await AccountantEm.find();
  const data = dataEm[dataEm?.length - 1];
  return res.status(201).json({ data });
});

const deleteIndexInsurance = asyncHandler(async (req, res) => {
  const { typeEm } = req.body;
  await ManageEmployee.remove({ typeEm });
  await AccountantEm.remove({});
  await ConsultInfo133.remove({});
  await CostConsultInfo133.remove({});

  return res
    .status(201)
    .json({ message: "Xóa danh tài khoản nhân viên thành công !" });
});

const createEm = asyncHandler;
module.exports = {
  createCategoryEmployee,
  getListCategoryEmployee,
  deleteCategoryEmployee,
  createManageEmployee,
  getIndexInsurance,
  createAccountantEm,
  getAccountantEm,
  deleteIndexInsurance,
};

const express = require("express");
const { route } = require("express/lib/router");
const router = express.Router();
const {
  createNewReqProduct,
  getReqProduct,
  deleteReqProduct,
  calculatorProcessProduct,
  calculatorEmployeeProduct,
  getEmployeeOneProd,
  getMaterialOneProd,
  getDataEmployeeProd,
  getDataMaterialProd,
  deleteEmployeeProd,
  deleteMaterialProd,
  getReqCurrentProd,
  calcalatorAccountProductMa,
  updateEmProd
} = require("../controller/ReqProduct/ReqProduct");

router.post("/create-new-req", createNewReqProduct);
router.get("/list-req-product", getReqProduct);
router.delete("/delete-request-product", deleteReqProduct);

router.post("/calcalator-process-product", calculatorProcessProduct);
router.post("/calcalator-employee-product", calculatorEmployeeProduct);

router.get("/get-info-employee-prod/:codeReq", getEmployeeOneProd);
router.get("/get-info-material-prod/:codeReq", getMaterialOneProd);

router.get("/get-data-material", getDataMaterialProd);
router.get("/get-data-employee", getDataEmployeeProd);

router.delete("/delete-material-req", deleteMaterialProd);
router.delete("/delete-employee-req", deleteEmployeeProd);

router.get('/get-list-req-current',getReqCurrentProd);

router.post('/calcul-account-product',calcalatorAccountProductMa);
router.post('/update-em-prod', updateEmProd);

module.exports = router;

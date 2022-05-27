const express = require("express");
const { getConsultInfo133,createConsultInfo133,createCostConsult133,getCostConsult133 } = require("../controller/Employee/Company");
const router = express.Router();
const {
  createCategoryEmployee,
  getListCategoryEmployee,
  deleteCategoryEmployee,
  createManageEmployee,
  getIndexInsurance,
  getAccountantEm,
  deleteIndexInsurance,
  createAccountantEm
} = require("../controller/Employee/Employee");



router.post("/create-caterory-employee", createCategoryEmployee);
router.get("/list-category-employee", getListCategoryEmployee);
router.delete("/delete-category-employee", deleteCategoryEmployee);

router.post("/create-manage-employee", createManageEmployee);
router.get("/get-index-insurance",getIndexInsurance);
router.get('/create-accountant-em',createAccountantEm);
router.get('/get-accountant-em',getAccountantEm);
router.delete('/delete-index-insurance',deleteIndexInsurance);

router.get('/create-consult-info133',createConsultInfo133);
router.get('/get-consult-info133',getConsultInfo133);

router.get('/create-cost-consult133',createCostConsult133);
router.get('/get-cost-consult133',getCostConsult133);
module.exports = router;

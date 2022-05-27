const express = require("express");
const router = express.Router();
const {
  createTSCD,
  createAccountTSCD,
  getAccountTSCD,
  getTSCD,
  deleteTSCD,
  createIncompleteProd,
  getListIncompleteProd,
  deleteIncompleteProd,
} = require("../controller/TSCD/TSCD");

router.post("/create-TSCD", createTSCD);
router.get("/create-account-TSCD", createAccountTSCD);
router.get("/get-account-TSCD", getAccountTSCD);
router.get("/get-TSCD", getTSCD);
router.delete("/delete-TSCD", deleteTSCD);

router.post('/create-incomplete-prod', createIncompleteProd);
router.get('/get-list-incomplete-prod', getListIncompleteProd);
router.delete('/delete-incomplete-prod', deleteIncompleteProd);

module.exports = router;

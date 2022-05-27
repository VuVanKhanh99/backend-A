const express = require("express");
const router = express.Router();
const {
  createUnit,
  getListUnit,
  deleteUnit,
} = require("../controller/Material/Unit");

router.post("/create-unit", createUnit);
router.get("/list-unit", getListUnit);
router.delete('/delete-unit', deleteUnit);


module.exports = router;

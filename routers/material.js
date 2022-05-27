const express = require("express");
const router = express.Router();
const {
  addMaterial,
  getAllMaterial,
  deleteMaterial,
} = require("../controller/Material/Item");
const {
  createItemPrice,
  getListItemPrice,
  deleteItemPrice,
  createStuffPrice,
  getListStuffPrice,
  deleteStuffPrice,
} = require("../controller/Material/Price");

router.post("/add-new", addMaterial);
router.get("/list-material", getAllMaterial);
router.post("/price-item", createItemPrice);
router.get("/list-price-item", getListItemPrice);
router.delete("/delete-price-item", deleteItemPrice);
router.post("/price-stuff", createStuffPrice);
router.get("/list-price-stuff", getListStuffPrice);
router.delete("/delete-price-stuff", deleteStuffPrice);
router.delete("/delete-material", deleteMaterial);

module.exports = router;

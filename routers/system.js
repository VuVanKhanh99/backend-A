const express = require("express");
const router = express.Router();
const { createRecipe, getListRecipe,deleteRecipe } = require("../controller/Recipe/Recipe");

router.post("/create-recipe", createRecipe);
router.get("/list-recipe", getListRecipe);
router.delete('/delete-recipe',deleteRecipe);

module.exports = router;

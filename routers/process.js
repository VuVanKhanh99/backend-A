const express = require('express');
const router = express.Router();
const {createProcess,getListProcess,deleteProcess} = require('../controller/Material/Process')

router.post('/create-process',createProcess)
router.get('/list-process',getListProcess)
router.delete("/delete-process", deleteProcess);

module.exports = router;
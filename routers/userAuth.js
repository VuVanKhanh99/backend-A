const express = require('express');
const router = express.Router();
const {createUserAdmin,login,refreshTokenFunc} =  require('../controller/Auth/userAdmin');


router.post('/register',createUserAdmin);
router.post('/login',login);
router.post('/refresh-token',refreshTokenFunc);

module.exports = router
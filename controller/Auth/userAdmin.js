const asyncHandler = require("express-async-handler");
const userAdmin = require("../../model/userAdmin");
const { generatedKey,verifyToken } = require("../../middleware/auth");
const bcrypt = require("bcryptjs");


const createUserAdmin = asyncHandler(async (req, res) => {

  const { firstName, lastName, username, password } = req.body;
  
  if (firstName && lastName && username && password) {
    const oldUser = await userAdmin.findOne({ username });
    if (oldUser)
      return res
        .status(409)
        .send("Username đã tồn tại ,vui lòng thử tên khác !");

    const encryptPass = await bcrypt.hash(password, 10);

    const user = await userAdmin.create({
      firstName,
      lastName,
      username,
      password:encryptPass,
    });

    const accessToken = await generatedKey(user, process.env.ACCESS_TOKEN_SECRET,'2h');
    const refreshToken = await generatedKey(user, process.env.REFRESH_TOKEN_SECRET,'3650d');

    res.status(201).json({
      accessToken,refreshToken
    });
  } else {
    res.status(400);
   throw new Error(res.err);
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    const user =await userAdmin.findOne({ username });
    if(!user) return res.status(403).json({message:'Username không tồn tại !'})

    const checkPass = await bcrypt.compare(password, user.password);
    if(!checkPass) return res.status(403).json({message:'Bạn đã nhập sai mật khẩu !'})
    
    const accessToken =await generatedKey(user, process.env.ACCESS_TOKEN_SECRET,'2h');
    const refreshToken =await generatedKey(user, process.env.REFRESH_TOKEN_SECRET,'3650d');
    return res.status(201).json({accessToken, refreshToken})
  } else {
    res.status(403).send({message:'Bạn đang thiếu tài khoản và mật khẩu để đăng nhập !'});
  }
});

const refreshTokenFunc = asyncHandler(async (req, res)=>{
  const refreshTokenClient = req.body.refreshToken;
  const refreshToken = process.env.REFRESH_TOKEN_SECRET
  const decodeData = verifyToken(refreshTokenClient, refreshToken);
  const dataUser = decodeData.data;
  if(decodeData){
    const accessToken = generatedKey(dataUser,process.env.ACCESS_TOKEN_SECRET,'2h')
    return res.status(201).json({accessToken})
  }
  return res.json(401).json({
    message:'Invalid refresh token !'
  })
})

module.exports = { createUserAdmin,login,refreshTokenFunc };

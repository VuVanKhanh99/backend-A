const jwt = require("jsonwebtoken");

const generatedKey = (data, secretKey, tokenLife) => {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(
      { data: data },
      secretKey,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (err, token) => {
        err && reject(err)
        return resolve(token)
      }
    );
  });
};

const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decode) => {
      if (err) return reject(err);
      return resolve;
    });
  });
};

const isAuth = async (req, res, next) => {
  const tokenFromClient = req.body.token || req.headers["x-access-token"];
  if (tokenFromClient) {
    try {
      const decoded = await verifyToken(
        tokenFromClient,
        process.env.ACCESS_TOKEN_SECRET
      );
      req.jwtDecoded = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unaithorized",
      });
    }
  } else {
    return res.status(403).json({
      message: "No token provided.",
    });
  }
};

module.exports = { verifyToken, isAuth, generatedKey };

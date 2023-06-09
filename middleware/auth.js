const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    let token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      res.send("Authorization Needed");
    }
    let token_verify = jwt.verify(token, "secret");
    if (!token_verify) {
      res.send("Token Invalid");
    }
    req.idUser = token_verify.id;

    next();
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = auth;

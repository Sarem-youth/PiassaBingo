const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const supabase = require("../config/supabase.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Admin Role!"
  });
};

isSuperAgent = (req, res, next) => {
  if (req.userRole === "agent") {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Agent Role!"
  });
};

isShop = (req, res, next) => {
  if (req.userRole === "shop") {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Shop Role!"
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isSuperAgent: isSuperAgent,
  isShop: isShop
};
module.exports = authJwt;

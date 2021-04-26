const jwt = require("jsonwebtoken");
const path = require("path");
const layout = path.join("layouts", "index");
const auth = async (req, res, next) => {
  try {
    console.log(req.cookies.token);
    if (req.cookies.token) {
      const decoded = await jwt.verify(req.cookies.token, "my_secret");

      if (decoded) {
        req.body = decoded;
        next();
      } else {
        res.render("login", {
          title: "Unauthorised!",
          layout,
          message: "Unauthorised entry",
        });
      }
    } else {
      res.render("login", {
        title: "Unauthorised!",
        layout,
        message: "Auth Token not found",
      });
    }
  } catch (error) {
    res.render("login", {
      title: "Error!",
      layout,
      message: "Error during authentication",
    });
  }
};

module.exports = auth;

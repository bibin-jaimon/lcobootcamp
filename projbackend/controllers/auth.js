const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout successfully",
  });
};

exports.signin = (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array()[0].msg,
    });
  }
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "Email does not exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Please enter valid creadentials",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", token, { expire: new Date() + 999 });

    const { _id, name, email, role } = user;

    return res.json({
      token: token,
      user: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: `${req.profile.email} has no admin privilage, Access denied!`,
    });
  }
  next();
};

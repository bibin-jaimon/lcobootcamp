var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator')
const { signin, signout, signup } = require("../controllers/auth")

router.post('/signup', [
    check("password", "Password need more than 3 letters").isLength({ min: 3 }),
    check("email", "Invalid email").isEmail()
], signup)

router.post('/signin', [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 1 })
], signin)

router.get('/signout', signout)

module.exports = router; 
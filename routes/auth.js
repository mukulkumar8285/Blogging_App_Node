const express = require("express");
const authcontroller = require("../controller/auth")

const router = express.Router();


router.post("/signup" , authcontroller.signup);


router.post("/signin" , authcontroller.signin);
router.post("/logout" ,authcontroller.checkTokenBlacklist ,authcontroller.logout);


module.exports = router;
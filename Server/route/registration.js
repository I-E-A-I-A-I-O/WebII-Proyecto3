const express = require("express");
const router = express.Router();

const {checkDuplicate} = require('../controller/registration');
const {verify, LoggedIn, LogOut} = require("../controller/login");

router.post("/SingUp", checkDuplicate);
router.post("/Login", verify);
router.get("/LoggedIn", LoggedIn);
router.get("/Logout", LogOut);

module.exports = router;
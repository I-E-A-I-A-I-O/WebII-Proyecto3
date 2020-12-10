const express = require("express");
const router = express.Router();
const {getUserData, getUsernames, isFollowing, Follow} = require("../controller/profileData");

router.post("/userProfile", getUserData);
router.post("/userList", getUsernames);
router.post("/following", isFollowing);
router.post("/follow", Follow);

module.exports = router;
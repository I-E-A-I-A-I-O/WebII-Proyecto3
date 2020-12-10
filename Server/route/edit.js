const express = require("express");
const router = express.Router();
const {editTweetText, editTweetMedia, changeUserData, deleteAccount, deleteTweet, verifyInput} = require("../controller/edit");

router.post("/editText", editTweetText);
router.post("/editMedia", editTweetMedia);
router.post("/deleteTweet", deleteTweet);
router.post("/verify", verifyInput);
router.post("/submitChanges", changeUserData);
router.get("/deleteAccount", deleteAccount);

module.exports = router;
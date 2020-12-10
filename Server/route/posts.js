const express = require("express");
const router = express.Router();
const {
    postTweetText, 
    getComments, 
    getTweetByText, 
    getUserList, 
    postTweetMedia, 
    getUserTweets,
    getTweetById, 
    verifyLikeStatus,
    InteractionCount
} = require("../controller/posts");

router.post("/postText", postTweetText);
router.post("/postMedia", postTweetMedia);
router.post("/getUserTweets", getUserTweets);
router.post("/getTweetById", getTweetById);
router.post("/getFeedTweets", getUserList);
router.post("/getTweetByText", getTweetByText);
router.post("/getTweetComments", getComments);
router.post("/LikeDislike", verifyLikeStatus);
router.post("/Interactions", InteractionCount);

module.exports = router;
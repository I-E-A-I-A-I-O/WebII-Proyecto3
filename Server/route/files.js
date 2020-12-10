const express = require("express");
const router = express.Router();
const {changeAvatar, downloadAvatar, downloadMedia} = require("../controller/files")

router.post("/upload", changeAvatar);
router.post("/getAvatar", downloadAvatar);
router.post("/getPostMedia", downloadMedia);

module.exports = router;
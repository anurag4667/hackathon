const express = require("express");
const { isauthenticated  } = require("../middlewares/auth.js");
const { register ,login ,logout} = require("../controllers/user.js");
const upload = require("../middlewares/multer.js");
const router = express.Router();

router.route("/register").post(upload.single("file"),register);
router.route("/login").post(login);
router.route("/logout").get(isauthenticated,logout);
module.exports = router;



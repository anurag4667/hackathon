const express = require("express");
const {getservices ,addservice , buyservice} = require("../controllers/service");
const { isauthenticated } = require("../middlewares/auth");

const router = express.Router();


router.route("/services").get(isauthenticated,getservices);
router.route("/service/add").post(isauthenticated,addservice);
router.route("/service/buy/:id").post(isauthenticated,buyservice);

module.exports = router;
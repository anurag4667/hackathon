const express = require("express");
const {getjobs , addJobs} = require("../controllers/jobs");
const { isauthenticated } = require("../middlewares/auth");

const router = express.Router();


router.route("/jobs").get(isauthenticated,getjobs);
router.route("/job/add").post(isauthenticated,addJobs);

module.exports = router;
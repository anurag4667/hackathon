const express = require("express");
const {getjobs , addJobs , applyjob} = require("../controllers/jobs");
const { isauthenticated } = require("../middlewares/auth");

const router = express.Router();


router.route("/jobs").get(isauthenticated,getjobs);
router.route("/job/add").post(isauthenticated,addJobs);
router.route("/job/apply/:id").post(isauthenticated,applyjob);

module.exports = router;
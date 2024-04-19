const Jobs = require("../models/jobs");
const User = require("../models/user");
exports.getjobs = async (req, res) => {
    try {
        const { title, tags, location, salaryMin, salaryMax, page = 1, limit = 10 } = req.query;

        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (tags) {
            query.tags = { $in: tags.split(',') };
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (salaryMin || salaryMax) {
            query.salary = {};
            if (salaryMin) query.salary.$gte = parseFloat(salaryMin);
            if (salaryMax) query.salary.$lte = parseFloat(salaryMax);
        }

        const jobs = await Jobs.find(query)
            .sort({ salary: -1 }) // Sort by salary, descending
            .skip((page - 1) * limit) // Pagination: skip records
            .limit(parseInt(limit)); // Pagination: limit records per page

        res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.addJobs = async (req,res) =>{
    try {
        const userid = req.user._id;
        const {title , tags , location , description ,salary} = req.body;

        const job = await Jobs.create({userid,title , tags , location , description ,salary});
        
        const user = await User.findById(userid);
        user.myJobs.push(job);
        await user.save();
        console.log(job);
        res.status(200).json({
            success : true,
            message : "job created"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
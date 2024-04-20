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

exports.applyjob = async (req, res) => {
    try {
        const jobid = req.params.id;

        // Find the job by its ID
        const findjob = await Jobs.findById(jobid);
        console.log(findjob);

        // Check if the job exists
        if (!findjob) {
            return res.status(404).json({
                success: false,
                message: "This job does not exist"
            });
        }

        // Check if the user is the owner of the job
        if (findjob.userid.equals(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot apply for your own job"
            });
        }

        // Find the user by their ID
        const user = await User.findById(req.user._id);

        // Check if the user has already applied for this job
        const isAlreadyApplied = user.myJobApplications.some(application => application.equals(findjob._id));

        if (isAlreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Add the user to the job's applicants and add the job to the user's applications
        findjob.applicants.push(req.user._id);
        user.myJobApplications.push(findjob._id);

        // Save changes to the database
        await user.save();
        await findjob.save();

        return res.status(200).json({
            success: true,
            message: "Job applied successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

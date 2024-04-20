const Service = require("../models/service.js");
const User = require("../models/user.js");
exports.getservices = async (req, res) => {
    try {
        const { title, tags, location, ratingMin, ratingMax, page = 1, limit = 10 } = req.query;

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

        if (ratingMin || ratingMax) {
            query.ratingAvg = {};
            if (ratingMin) query.ratingAvg.$gte = parseFloat(ratingMin);
            if (ratingMax) query.ratingAvg.$lte = parseFloat(ratingMax);
        }

        const services = await Service.find(query)
            .sort({ ratingAvg: -1 }) 
            .skip((page - 1) * limit) 
            .limit(parseInt(limit)); 

        return res.status(200).json({
            success: true,
            services,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.addservice = async (req,res) =>{
    try {
        const userid = req.user._id;
        const {title , tags , location , description ,timeAvailable , ratesRange} = req.body;

        const service = await Service.create({userid,title,tags,location,description,timeAvailable,ratesRange});
        
        const user = await User.findById(userid);
        user.myServices.push(service);
        await user.save();
        console.log(service);
        return res.status(200).json({
            success : true,
            message : "service created"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.buyservice = async (req, res) => {
    try {
        const serviceid = req.params.id;

        // Find the service by its ID
        const findservice = await Service.findById(serviceid);
        // console.log(findservice);

        // Check if the service exists
        if (!findservice) {
            return res.status(404).json({
                success: false,
                message: "This service does not exist"
            });
        }

        // Check if the user is the owner of the service
        if (findservice.userid.equals(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot buy your own service"
            });
        }

        const user = await User.findById(req.user._id);
        const isAlreadyApplied = user.myOrders.some(application => application.equals(findservice._id));

        if (isAlreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this service"
            });
        }

        // Add the user to the service's applicants and add the service to the user's orders
        findservice.applicants.push(req.user._id);
        user.myOrders.push(findservice._id);

        // Save changes to the database
        await user.save();
        await findservice.save();

        return res.status(200).json({
            success: true,
            message: "Service added"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

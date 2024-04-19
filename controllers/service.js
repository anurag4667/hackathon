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

        res.status(200).json({
            success: true,
            services,
        });
    } catch (error) {
        res.status(500).json({
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
        res.status(200).json({
            success : true,
            message : "service created"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
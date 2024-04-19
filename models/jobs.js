const mongoose = require("mongoose");
const {Schema} = mongoose;

const jobSchema = new Schema({
    userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    location: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: Number, required: true },
    applicants: [{
      userid: { type: Schema.Types.ObjectId, ref: 'User' }
    }]
});


const Jobs = mongoose.model('Jobs', jobSchema);

module.exports = Jobs;

const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  tags: [{ type: String }],
  location: { type: String, required: true },
  description: { type: String, required: true },
  timeAvailable: { type: String }, 
  ratesRange: { type: [Number] }, 
  ratingAvg: { type: Number, default: 0 },
  reviews: [{ 
    userid: { type: Schema.Types.ObjectId, ref: 'User' }, 
    review: { type: String },
    stars: { type: Number , required : true}
  }],
  applicants: [{
    userid: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
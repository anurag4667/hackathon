const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;


const userSchema = new Schema({
    avatar :{
        public_id :String,
        url : String,
    },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password : {
    type:String,
    required: true,
    minlength : 6,
    select : false,
    },
  myServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  myOrders: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
  myJobs : [{type : Schema.Types.ObjectId, ref : 'Jobs'}],
  myJobApplications : [{type : Schema.Types.ObjectId, ref : 'Jobs'}],
  resetPasswordToken : String,
    resetPasswordExpire : Date,
});

userSchema.pre("save" , async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }        
    next();
})

userSchema.methods.matchpassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generatetoken = function(){
    return jwt.sign({_id:this._id },process.env.JWT_SECRET);
}

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10*60*1000;

    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  location: {
    lattitude:{
      type:Number,
      default:null
    },
    longitude:{
      type:Number,
      default:null
    },
   
  },
  imageUrl:{
    type:String,
    default:null,
  }
},
 {timestamps:true}
);


module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
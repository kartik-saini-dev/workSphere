import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required:true,
    validate: {
      validator: async function (value) {
        if (!value) {
          // If the value is null or empty, treat it as valid
          return true;
        }
    
        const count = await mongoose.models.User.countDocuments({
          name: { $regex: new RegExp(`^${value}$`, 'i') },
        });
        return count === 0;
      },
      message: 'Username must be unique.',
    },
  },
  fullname:{
    type: String,
    unique: false,
    required:false,
  },
  description:{
    type: String,
    unique: false,
    required:false,
  },
 
  email: {
    type: String,
    unique: false,
    required:false,
  },
  password: {
    type: String,
    required:false
  },
 
  profilePic: {
    type: String,
    required: false,
  },
  lastSeen :{
      type:Date,
      required: false,
      default: Date.now(),
  },
  online :{
    type:Boolean,
    default: false,
},
  isVerified:{
    type: Boolean,
    default: false
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date
},{
  timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; 
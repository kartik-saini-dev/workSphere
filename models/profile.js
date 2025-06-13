import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema({
  

  username: {
    type: String,
    unique: true,
    required:true,
  },
  fullname: {
    type: String,
    unique: true,
    required:true,
  },
  desc: {
    type: String,
    unique: true,
    required:true,
  },
 
  img: {
    type: String,
    required: false,
  },


},{
  timestamps: true
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile; 
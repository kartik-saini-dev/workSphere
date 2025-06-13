import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
  to: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: ["Text", "Media", "Document", "Link","File"],
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
  },
  file: {
    type: String,
  },
  seen:{
    type:Boolean,
    default:false
  }
});

const Message =  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;

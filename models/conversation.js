

import mongoose from "mongoose";
import Message from "./message";
import User from "./user";
const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages : [
    {
        type : mongoose.Schema.ObjectId,
        ref : 'Message'
    }
],
unseenMessages: {
  type: Map,
  of: [mongoose.Schema.Types.ObjectId], // Key: userId, Value: Array of unseen messageIds
  default: () => new Map(),
}
});

const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;

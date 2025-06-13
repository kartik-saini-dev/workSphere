import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import mongoose from "mongoose";
import Message from "../../../../models/message";



export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("sender");
    const receiverId = searchParams.get("receiver");
    const messageId = searchParams.get("messageId");

    if (!senderId || !receiverId || !messageId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const objectIdMessageId = new mongoose.Types.ObjectId(messageId);

  

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Pull the message from the messages array
    const result = await Conversation.updateOne(
      { _id: conversation._id },
      { $pull: { messages: objectIdMessageId } }
    );

    if (result.modifiedCount > 0) {
      // Delete the message from the Message collection
      await Message.deleteOne({ _id: objectIdMessageId });

      // Update unseenMessages to remove this specific message from both sender and receiver
      const unseenMessages = conversation.unseenMessages || new Map();

      // Remove messageId from the unseen list for each user
      [senderId, receiverId].forEach((userId) => {
        if (unseenMessages.has(userId)) {
          const unseenArray = unseenMessages.get(userId) || [];
          // Filter out the deleted message from the unseen array
          unseenMessages.set(
            userId,
            unseenArray.filter((id) => id.toString() !== messageId)
          );
        }
      });

      // Save the updated unseenMessages
      conversation.unseenMessages = unseenMessages;
      await conversation.save();
      const unseenMessagesUpdate = conversation.unseenMessages.get(receiverId) || [];
        const unseenMessCount = unseenMessagesUpdate.length;
      return NextResponse.json({
        success: true,
        message: "Message deleted successfully",
        unseenMessCount
      });
    }

    return NextResponse.json({
      success: false,
      message: "Message deletion failed",
    });
  } catch (error) {
    console.error("Error in deleting message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

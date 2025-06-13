import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message"; // Import the Message model


export async function PUT(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const senderId = searchParams.get("sender");
    const receiverId = searchParams.get("receiver");
    const messageId = searchParams.get("messageId");

    const { text } = await req.json();

    if (!senderId || !receiverId || !messageId || !text) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }
   
    // Check if the conversation exists
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }
  
    // Update the message in the Message collection
    const result = await Message.updateOne(
      { _id: messageId },
      { $set: { text: String(text) } }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Message updated successfully",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Message could not be updated",
    });
  } catch (error) {
    console.error("Error in updating message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

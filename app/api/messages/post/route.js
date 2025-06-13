import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";

export async function POST(req) {
  try {
    await connectToDB();

    const { to, from, message, type, createdAt,seen = false } = await req.json();

    if (!to || !from || !type) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }
   console.log(message,seen)
    // Create a new message
    const newMessage = await Message.create({
      to,
      from,
      text:message,
      type,
      seen,
      createdAt
    });

    // Check if a conversation exists between the participants
    let existingConversation = await Conversation.findOne({
      participants: { $all: [to, from] },
    });

    if (existingConversation) {
      // Update the existing conversation
      existingConversation.messages.push(newMessage._id);

      // Handle unseen messages
      if (!seen) {
        const unseenMessages = existingConversation.unseenMessages || new Map();

        // Ensure the `to` user has an entry in the map
        if (!unseenMessages.has(to)) {
          unseenMessages.set(to, []);
        }

        // Add the new message ID to the receiver's unseen messages
        const receiverUnseenMessages = unseenMessages.get(to);
        receiverUnseenMessages.push(newMessage._id);

        // Update the unseen messages map
        existingConversation.unseenMessages = unseenMessages;
      }

      await existingConversation.save();
    } else {
      // Create a new conversation if none exists
      const unseenMessages = new Map();
      if (!seen) {
        unseenMessages.set(to, [newMessage._id]); // Initialize with the new message ID
      }

      existingConversation = await Conversation.create({
        participants: [to, from],
        messages: [newMessage._id],
        unseenMessages,
      });
    }
 // Get the unseen messages for the user
 const unseenMessages = existingConversation.unseenMessages.get(to) || [];
 const unseenMessageCount = unseenMessages.length; // Count unseen messages for the user

    return NextResponse.json({
      success: true,
      message: newMessage,
      unseenMessageCount,
    });
  } catch (error) {
    console.error("Error in sending message:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

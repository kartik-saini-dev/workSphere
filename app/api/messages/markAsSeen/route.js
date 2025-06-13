// import { NextResponse } from "next/server";
// import connectToDB from "../../../../database/index";
// import Conversation from "../../../../models/conversation";
// import Message from "../../../../models/message";

// export async function PUT(req) {
//   try {
//     await connectToDB();

//     const { conversationId, userId } = await req.json();

//     if (!conversationId || !userId) {
//       return NextResponse.json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     // Find the conversation
//     const conversation = await Conversation.findById(conversationId).populate("messages");

//     if (!conversation) {
//       return NextResponse.json({
//         success: false,
//         message: "Conversation not found",
//       });


//     } const unseenMessages = conversation.unseenMessages.get(userId) || [];
//     const unseenMessCount = unseenMessages.length;
               


//     // Get unseen messageIds for the specific user from the unseenMessages map
//     const unseenMessageIds = conversation.unseenMessages.get(userId) || [];

//     if (unseenMessageIds.length === 0) {
//       return NextResponse.json({
//         success: true,
//         message: "No unseen messages for the user",
//       });
//     }

//     // Find and update each message as seen
//     for (const messageId of unseenMessageIds) {
//       const message = await Message.findById(messageId);
//       if (message) {
//         message.seen = true;
//         await message.save(); // Save the message with the seen status updated
//       }
//     }

//     // Remove these messageIds from the unseenMessages map for the user
//     conversation.unseenMessages.set(userId, []);

//     // Save the updated conversation
//     await conversation.save();

//     return NextResponse.json({
//       success: true,
//       message: "Messages marked as seen successfully",
//       unseenMessCount
//     });
//   } catch (error) {
//     console.error("Error in marking messages as seen:", error);
//     return NextResponse.json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// }


import { NextResponse } from "next/server";
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";

export async function PUT(req) {
  try {
    await connectToDB();

    const { conversationId, userId } = await req.json();

    if (!conversationId || !userId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the conversation
    const conversation = await Conversation.findById(conversationId).populate("messages");

    if (!conversation) {
      return NextResponse.json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Get unseen messageIds for the specific user from the unseenMessages map
    const unseenMessageIds = conversation.unseenMessages.get(userId) || [];

    if (unseenMessageIds.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No unseen messages for the user",
      });
    }

    // Update the unseen messages as seen
    for (const messageId of unseenMessageIds) {
      const message = await Message.findById(messageId);
      if (message) {
        message.seen = true;
        await message.save(); // Save the message with the seen status updated
      }
    }

    // Clear unseen messages for the user
    conversation.unseenMessages.set(userId, []);

    // Save the updated conversation
    await conversation.save();

    const unseenMessCount = unseenMessageIds.length;

    return NextResponse.json({
      success: true,
      message: "Messages marked as seen successfully",
      unseenMessCount,
      unseenMessageIds, // Send the list of message IDs for real-time updates
    });
  } catch (error) {
    console.error("Error in marking messages as seen:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

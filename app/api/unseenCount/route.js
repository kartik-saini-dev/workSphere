import { NextResponse } from "next/server";
import connectToDB from "@/database/index";
import Conversation from "@/models/conversation";
export const dynamic = "force-dynamic";
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required.",
      });
    }
       

    // Fetch all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    }).lean() // to treat it as object unseenmessag[userid] for this

  
    // Calculate total unseen messages for the user across all conversations
    let totalUnseenMessages = 0;
 
    conversations.forEach((conversation) => {
      const unseenMessages = conversation.unseenMessages[userId] || [];
    
      totalUnseenMessages += unseenMessages.length;
    });
   
    return NextResponse.json({
      success: true,
      unseenMessageCount: totalUnseenMessages,
    });
  } catch (error) {
    console.error("Error in fetching unseen messages:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

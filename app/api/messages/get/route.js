import { NextResponse } from 'next/server';
import connectToDB from "../../../../database/index";
import Conversation from "../../../../models/conversation";
import Message from "../../../../models/message";


export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
         await connectToDB();
        const { searchParams } = new URL(req.url);
        const user1Id = searchParams.get("sender");
        const user2Id = searchParams.get("receiver");
        const page = searchParams.get("page") 
        if (user2Id) {
          
            return await handleTwoUserConversation(user1Id, user2Id, page);
        } else {
 
            return await handleUserConversations(user1Id);
        }
    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}
async function handleTwoUserConversation(user1Id, user2Id, page, limit = 5) {
  try {
      let conversation;

      if (page) {
          // Apply pagination logic if page is provided
          const offset = (page - 1) * limit; // Calculate offset from page number
          conversation = await Conversation.findOne({
              participants: { $all: [user1Id, user2Id] },
          })
              .populate({
                  path: 'participants',
                  select: 'username profilePic email', // Populate participant details
              })
              .populate({
                  path: 'messages',
                  options: {
                      sort: { created_at: -1 }, // Sort messages in descending order
                      limit: parseInt(limit),
                      skip: parseInt(offset),
                  },
              });
      } else {
          // Fetch all messages without pagination
          conversation = await Conversation.findOne({
              participants: { $all: [user1Id, user2Id] },
          })
              .populate({
                  path: 'participants',
                  select: 'username profilePic email', // Populate participant details
              })
              .populate({
                  path: 'messages',
                  options: {
                      sort: { created_at: -1 }, // Sort messages in descending order
                  },
              });
      }

      if (!conversation) {
          // Create a new conversation if it doesn't exist
          conversation = await Conversation.create({
              participants: [user1Id, user2Id],
              messages: [],
              unseenMessages: new Map(),
          });
      }

      const messages = conversation.messages || [];
      const unseenMessagesForUser = conversation.unseenMessages.get(user1Id) || [];

      const response = {
          success: true,
          data: messages.reverse(), // Reverse to show oldest messages first
          conversationId: conversation._id,
          unseenMessages: unseenMessagesForUser,
      };

      return NextResponse.json(response);
  } catch (error) {
      console.error("Error fetching conversation between users:", error);
      return NextResponse.json({
          status: 500,
          message: 'Internal Server Error',
      });
  }
}
async function handleUserConversations(user1Id) {
    try {
        const conversations = await Conversation.find({
            participants: user1Id,
        })
        .populate({
            path: "participants",
            select: "username profilePic email",
        })
        .populate({
            path: "messages",
        });

        const formattedConversations = formatConversations(conversations, user1Id);

        return NextResponse.json({ success: true, data: formattedConversations });
    } catch (error) {
        console.error("Error fetching user conversations:", error);
        return NextResponse.json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
}

function formatConversations(conversations, user1Id) {

    return conversations.map(conversation => {
        const messages = conversation.messages || [];
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        
        // Get the unseen messages for the user
        const unseenMessages = conversation.unseenMessages.get(user1Id) || [];
        const unseenMessCount = unseenMessages.length; // Count unseen messages for the user
              
        return {
            _id: conversation._id,
            participants: conversation.participants,
            lastMessage: lastMessage,
            unseenMessCount: unseenMessCount,
        };
    });
}

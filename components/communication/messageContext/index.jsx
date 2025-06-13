"use client";

import React, { useEffect, useState ,useContext} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { socket } from "@/socket";
import axios from "axios";
import Image from "next/image";


function MessageContext({ onClose }) {
  const { data: session } = useSession();
  const userID = session?.user?.userId;
  const [conversations, setConversations] = useState([]);
  const [unseenCounts, setUnseenCounts] = useState({});
  const router = useRouter();

  // Fetch conversations and set up socket listener
  useEffect(() => {
    if (userID) {

      const fetchConversations = async () => {
        try {
          const response = await axios.get(`/api/messages/get?sender=${userID}`);
          if (response.data.success) {
            const fetchedConversations = response.data.data;
            setConversations(fetchedConversations);

            // Initialize unseen message counts
            const unseen = {};
            fetchedConversations.forEach((conv) => {
              const user = conv.participants.find((u) => u._id !== userID);
              unseen[user?._id] = conv.unseenMessCount || 0;
            });
            setUnseenCounts(unseen);

        //     const totalUnseenMessages = Object.values(unseen).reduce((acc, val) => acc + val, 0);
        //   setUnseenMessages(totalUnseenMessages); 

          } else {
            console.error("Error fetching conversations:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      fetchConversations();

      // Listen for unseen message updates
      socket.on("unseenReceived", ({ to, from, count }) => {
        if (to === userID) {
          setUnseenCounts((prevCounts) => ({
            ...prevCounts,
            [from]: count,
          }));
        }});
      // Cleanup socket listener on unmount
      return () => {
        socket.off("unseenReceived");
      };
    }
  }, [userID]);


          
  // Handle user click to navigate to inbox
  const handleUserClick = (username) => {
    onClose(); // Close the message context
    router.push(`/inbox/${username}`);
  };

  // Render unseen message count
  const renderUnseenCount = (userId, unseenCount) => {
    if (unseenCount > 0) {
      return (
        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
          {unseenCount}
        </span>
      );
    }
    return null;
  };

  // Render user profile picture
  const renderUserProfilePic = (user) => {
    if (user?.profilePic) {
      return (
        <Image
          src={user.profilePic}
          alt="Profile"
          className="rounded-full border-2 border-gray-200 object-cover"
          width={40}
          height={40}
        />
      );
    }
    return (
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center rounded-full text-white font-bold">
        {user?.email?.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div
      className="absolute right-0 mt-2 w-80 bg-white shadow-lg border rounded-lg p-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-64">
        {conversations.length ? (
           conversations.map((conversation) => {
            // Determine the user in the conversation
            const user = conversation.participants.find((u) => u._id !== userID)  ||
            session?.user;
               
            // Check if it's a self-chat
            const isSelfChat = user.userId === userID;
              
            // Determine display name
            const displayName = isSelfChat ? user.name : user.username;
            
            const lastMessage = conversation.lastMessage?.text || "No messages yet";
            const isImageUrl = lastMessage.startsWith("https://res.cloudinary.com") ;
            const totalUnseenCount = unseenCounts[user?._id] || 0;
            
            return (
              <div
                key={conversation._id}
                className={`flex items-center p-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 cursor-pointer`}
                onClick={() => handleUserClick(displayName)}
              >
                <div className="relative mr-3">
                  {renderUnseenCount(user?._id, totalUnseenCount)}
                  {renderUserProfilePic(user)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">
                      {displayName}</span>
                    <span className="text-xs text-gray-500">{lastMessage.slice(0, 10)}...</span>
                  </div>
                  <p className="text-sm text-gray-600">{isImageUrl ? (
              <Image src={lastMessage} width= {45} height={45} alt="Message Image" className="max-w-[150px] max-h-[150px] object-cover" />
            ) : (
              lastMessage
            )}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">No conversations found</div>
        )}
      </div>
      <button
        className="w-full mt-4 py-2 bg-red-500 text-white rounded-md"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export default MessageContext;

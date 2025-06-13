


"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { FaCommentAlt } from "react-icons/fa";
import Image from "next/image";
import { GlobalContext } from "@/context/index";
import { socket } from "@/socket";

const Sidebar = () => {
  const pathName = usePathname();
  const path = pathName.replace(/%20/g, " ");
  const [conversations, setConversations] = useState([]);
  const [unseenCounts, setUnseenCounts] = useState({});
  const router = useRouter();
  const { data: session } = useSession();
  const userID = session?.user?.userId;
  const { setUnseenMessages } = useContext(GlobalContext);


  useEffect(() => {
    if (userID) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(`/api/messages/get?sender=${userID}`);
          if (response.data.success) {
            const fetchedConversations = response.data.data;
            setConversations(fetchedConversations);

            // Initialize unseen counts from API response
            const unseen = {};
            fetchedConversations.forEach((conv) => {
              unseen[conv._id] = conv.unseenMessCount || 0;
            });
            setUnseenCounts(unseen);
          } else {
            console.error("Error fetching conversations:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      };

      fetchConversations();

      // Set up socket listener for unseen messages
      socket.on("unseenReceived", ({ count, to, from }) => {
        if (to === userID) {
          setUnseenCounts((prevCounts) => ({
            ...prevCounts,
            [from]: count,
          }));

          const updatedTotalUnseen = Object.values({
            ...unseenCounts,
            [from]: count,
          }).reduce((acc, val) => acc + val, 0);

          setUnseenMessages(updatedTotalUnseen); // Update global unseen messages count
        }
      });

      // Cleanup listener on unmount
      return () => {
        socket.off("unseenReceived");
      };
    }
  }, [userID]);

  const handleUserClick = (username) => {
    router.push(`/inbox/${username}`);
  };

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
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center rounded-full text-white font-bold">
        {user?.email?.charAt(0).toUpperCase()}
      </div>
    );
  };

  const renderUnseenCount = (conversationId, unseenCount) => {
    if (unseenCount > 0) {
      return (
        <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
          {unseenCount}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white text-gray-800 w-full max-w-xs h-full p-4 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Chats</h2>
        <div className="space-y-4 overflow-y-auto custom-scrollbar">
          {conversations.length ? (
                conversations.map((conversation) => {
          // Determine the user in the conversation
          const user = conversation.participants.find((u) => u._id !== userID) || session?.user;
        
          // Check if it's a self-chat
          const isSelfChat = user.userId === userID;
        
          // Determine display name
          const displayName = isSelfChat ? user.name : user.username;
        
          // Last message and unseen counts
          const lastMessage = conversation.lastMessage?.text || "No messages yet";
          const isImageUrl = lastMessage.startsWith("https://res.cloudinary.com");
          const totalUnseenCount = unseenCounts[user?._id] || 0;
        
          return (
            <div
              key={conversation._id}
              className={`flex items-center p-3 rounded-lg transition-colors duration-300 hover:bg-gray-100 cursor-pointer ${
                path === `/inbox/${displayName}` ? "bg-gray-100" : ""
              }`}
              onClick={() => handleUserClick(displayName)}
            >
              <div className="relative mr-3">
                {renderUnseenCount(user?._id, totalUnseenCount)}
                {renderUserProfilePic(user)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{displayName}</span>
                  <span className="text-xs text-gray-500 truncate">
                    {isImageUrl ? "Image" : lastMessage.slice(0, 10) + "..."}
                  </span>
                </div>
             
              </div>
            </div>
          );
        })
        
          ) : (
            <div className="text-center text-gray-400">No conversations found</div>
          )}
        </div>
      </div>

      <div
        className="flex items-center space-x-3 p-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition duration-300"
        onClick={() => router.push("/messages")}
      >
        <FaCommentAlt size={20} />
        <span className="text-lg font-medium">Messages</span>
      </div>
    </div>
  );
};

export default Sidebar;

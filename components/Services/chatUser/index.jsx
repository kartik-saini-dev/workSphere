"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { socket } from "@/socket";
import ChatHeader from "@/components/communication/chatHeader";


const ChatBox = ({ username, onClose }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [messagesData, setMessagesData] = useState([]);
    const [room, setRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingMessage, setEditingMessage] = useState(null);
    const { data: session ,status} = useSession();
    const userId = session?.user?.userId;
    const sanitizedUsername = username.replace(/%20/g, " ");
    const messagesContainerRef = useRef(null);
    const [message, setMessage] = useState("");
 
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messagesData]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data } = await axios.get(`/api/userInfo?username=${sanitizedUsername}`);
                if (data.success) {
                    setUserInfo(data.userInfo);
                } else {
                    throw new Error("Failed to fetch user info");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();
    }, [sanitizedUsername]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (userId && userInfo?._id) {
                try {
                    const { data } = await axios.get(
                        `/api/messages/get?sender=${userId}&receiver=${userInfo._id}`
                    );
                    if (data.success) {
                        setMessagesData(data.data);
                        setRoom(data.conversationId);
                        socket.emit("joinRoom", { userRoom: data.conversationId, userId });
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchMessages();

        return () => {
            if (room) {
                socket.emit("leaveRoom", { userRoom: room, userId });
            }
        };
    }, [userId, userInfo, room]);

    useEffect(() => {
        const handleReceiveMessage = (data) => {
            setMessagesData((prev) => {
                if (!prev) {
                  return [data]; // Add the received message
                }
                return [...prev, data]; // Append the received message
              });
        };

        socket.on("sendmessage", handleReceiveMessage);

        return () => {
            socket.off("sendmessage", handleReceiveMessage);
        };
    }, []);

    const sendMessage = () => {
        if(status !== "authenticated"){
            toast.error("Login First To message");
            return;
        }
        if (room && message.trim()) {
            const messageData = {
                message,
                from: userId,
                to: userInfo._id,
                type: "Text",
                createdAt: new Date(),
                userRoom: room,
            };

            socket.emit("message", messageData);
            setMessage("");
        }
    };
    useEffect(() => {
        socket.on('messageUpdated', ({ messageId, updatedText }) => {
          setMessagesData((prevMessages) =>
            prevMessages.map((message) =>
              message._id === messageId ? { ...message, text: updatedText } : message
            )
          );
        });
        socket.on('messageDeleted', ({ messageId }) => {
          setMessagesData((prevMessages) =>
            prevMessages.filter((message) => message._id !== messageId)
          );
        });
        return () => {
          socket.off('messageUpdated');
          socket.off('messageDeleted');
        };
      }, []);
    

    const handleUpdateMessage = (messageId, updatedText) => {
        socket.emit('updateMessage', { messageId, updatedText, userRoom: room ,sender:userId, receiver:userInfo._id});
      };
    
      const handleDeleteMessage = (messageId,) => {
        socket.emit('deleteMessage', { messageId, userRoom: room,sender:userId, receiver:userInfo._id} );
      };

  

    return (
  
        <div className="fixed bottom-20 right-10 bg-white shadow-lg rounded-lg w-[350px] max-w-full z-50">
      
            {session && (
                <>
                    <ChatHeader userInfo={userInfo} onClose={onClose} />
                    <div
                        ref={messagesContainerRef}
                        className="h-[300px] overflow-y-auto p-4 bg-gray-100 relative"
                    >
                        {messagesData?.map(({ _id, text: message, from, type, created_at: createdAt }) => {
                            const isSender = from === userId;
                            const isEditing = editingMessage === _id;
    
                            return (
                                <div
                                    key={_id}
                                    className={`mb-4 flex ${isSender ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="relative max-w-[75%] p-4 rounded-lg shadow-md group transition-transform transform">
                                        {/* Edit/Delete Icons (Left side of the message, outside the bubble) */}
                                        {isSender && (
                                            <div className="absolute top-1 left-[-30px] z-50 flex flex-col gap-2">
                                                {/* Edit Icon */}
                                                {!isEditing && (
                                                    <button
                                                        className="text-gray-300 hover:text-gray-100 focus:outline-none"
                                                        onClick={() => setEditingMessage(_id)}
                                                    >
                                                        <FaPencilAlt className="w-5 h-5" />
                                                    </button>
                                                )}
                                                
                                                {/* Delete Icon */}
                                                <button
                                                    className="text-gray-300 hover:text-gray-100 focus:outline-none"
                                                    onClick={() => handleDeleteMessage(_id)}
                                                >
                                                    <FaTrashAlt className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
    
                                        {/* Message Content */}
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <input
                                                    className="w-full bg-transparent border-b border-black outline-none"
                                                    value={message}
                                                    onChange={(e) =>
                                                        setMessagesData((prev) =>
                                                            prev.map((msg) =>
                                                                msg._id === _id
                                                                    ? { ...msg, text: e.target.value }
                                                                    : msg
                                                            )
                                                        )
                                                    }
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        className="text-blue-500"
                                                        onClick={() => handleUpdateMessage(_id, message)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="text-red-500"
                                                        onClick={() => setEditingMessage(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : type === "File" ? (
                                            <Image
                                                src={message}
                                                alt="File"
                                                width={120}
                                                height={120}
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <p className="break-words text-base">{message}</p>
                                        )}
    
                                        {/* Timestamp */}
                                        <span
                                            className={`absolute text-xs text-gray-400 ${
                                                isSender ? "right-2 -bottom-5" : "left-2 -bottom-5"
                                            }`}
                                        >
                                            {new Date(createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
    
                    <div className="p-4 border-t border-gray-200 bg-white flex items-center">
                        <input
                            className="flex-1 border rounded-md px-4 py-2"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button
                            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                            onClick={sendMessage}
                        >
                            Send
                        </button>
                    </div>
                </>
            )}
        </div>
    );
    
};

export default ChatBox;

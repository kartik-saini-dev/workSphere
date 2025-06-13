
"use client";

import { useEffect, useRef, useState ,useContext} from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Sidebar from "@/components/communication/chatSideBar";
import ChatHeader from "@/components/communication/chatHeader";
import MessageList from "@/components/communication/messageList";
import MessageInput from "@/components/communication/messageInput";
import SideProfile from "@/components/communication/sideProfile";
import { socket } from "@/socket";
import { usePathname } from "next/navigation";
import { GlobalContext } from "@/context/index";
import { toast } from "sonner";
import ComponentLevelLoader from "@/components/Loader/componentLevelLoader";
import { FiMenu } from "react-icons/fi";
const MessageUser = ({params}) => {

  const [userInfo, setUserInfo] = useState(null);
  const [messagesData, setMessagesData] = useState([]);
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.userId;
  const username = params.username.replace(/%20/g, " ");
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);;
  const eventListenerAdded = useRef(false);
  const pathname = usePathname()
  const { reduceUnseenMessages,  setPageLevelLoader,} = useContext(GlobalContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data } = await axios.get(`/api/userInfo?username=${username}`);
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
  }, [username]);

  const [page, setPage] = useState(1); // Page for paginated messages
  const [hasMoreMessages, setHasMoreMessages] = useState(true); // To check if more messages exist

 
  // Fetch messages function (moved outside `useEffect`)
  const fetchMessages = async (pageNumber = 1, append = false) => {
    if (userId && userInfo?._id) {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `/api/messages/get?sender=${userId}&receiver=${userInfo._id}&page=${pageNumber}`
        );

        if (data.success) {
          const newMessages = data.data || [];
          setMessagesData((prev) =>
            append ? [...newMessages, ...prev] : newMessages
          ); // Append or replace messages
          setRoom(data.conversationId); // Set the room based on fetched data
          setHasMoreMessages(newMessages.length > 0); // Check if more messages exist

          if (!append) markMessagesAsSeen(data.conversationId);

          socket.emit("joinRoom", { userRoom: data.conversationId, userId });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Mark messages as seen
  const markMessagesAsSeen = (conversationId) => {
    try {
      socket.emit("markAsSeen", { userId, conversationId });

      socket.on("messagesSeen", ({ unseenMessagesCount,unseenMessageIds }) => {
        reduceUnseenMessages(unseenMessagesCount); // Update global state
  
        setMessagesData((prevMessages) =>
          prevMessages.map((message) =>
            unseenMessageIds?.includes(message._id)
              ? { ...message, seen: true }
              : message
          )
        );
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchMessages();

    const handleLeaveRoom = () => {
      if (room) {
        socket.emit("leaveRoom", { userRoom: room, userId });
      }
      socket.off("messagesSeen");
    };

    return () => {
      handleLeaveRoom();
    };
  }, [userId, userInfo, room, pathname, socket]);

  // Load more messages
  const loadMoreMessages = async () => {
    if (hasMoreMessages && !isLoading) {
      setPage((prev) => prev + 1); // Increment page
      fetchMessages(page + 1, true); // Fetch next page, append messages
    }
  };

  // Scroll listener for infinite scroll
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;

    if (!messagesContainer) return;

    const handleScroll = () => {
      if (messagesContainer.scrollTop < 50 && hasMoreMessages && !isLoading) {
        loadMoreMessages();
      }
    };

    messagesContainer.addEventListener("scroll", handleScroll);

    return () => {
      messagesContainer.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreMessages, isLoading]);


// Scroll to the bottom of the messages container when userMessages changes
useEffect(() => {
  if (messagesContainerRef.current) {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  }
}, [messagesData]);


// Handle message updates and deletions
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
  socket.emit('updateMessage', { messageId, updatedText, userRoom: room, sender: userId, receiver: userInfo._id });
};

const handleDeleteMessage = async (messageId,type ,fileUrl) => {
  console.log(fileUrl ,"this is fule");
  socket.emit('deleteMessage', { messageId, userRoom: room, sender: userId, receiver: userInfo._id });
  
  if (type === "File" && fileUrl) {
    try {

      const response = await fetch("/api/cloudinary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  fileURL : fileUrl }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Image deleted successfully from Cloudinary");
      } else {
        toast.error("Failed to delete image from Cloudinary:", data.message);
      }
    } catch (error) {
      toast.error("Error deleting image from Cloudinary:", error);
    }
  }

};


useEffect(() => {
  const handleReceiveMessage = (data) => {
    // When a message is received, update the state with the new message
    setMessagesData((prev) => {
      if (!prev) {
        return [data]; // Add the received message
      }
      return [...prev, data]; // Append the received message
    });
  };

  if (!eventListenerAdded.current) {
    socket.on("sendmessage", handleReceiveMessage); // Listen for the sendmessage event
    eventListenerAdded.current = true;
  }

  return () => {
    socket.off("sendmessage", handleReceiveMessage); // Clean up the listener
    eventListenerAdded.current = false;
  };
}, []);



// Send a message
const sendMessage = (messageInput, setMessageInput) => {
  if (room && messageInput.trim()) {

    const messageData = {
      message: messageInput,
      from: userId,
      to: userInfo._id,
      type: "Text",
      createdAt: new Date(),
      userRoom: room,
    };

    socket.emit("message", messageData);
    setMessageInput("");
  }
};

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "....."); // Replace with your upload preset
  formData.append("cloud_name", "cloudinary cloud name"); // Replace with your Cloudinary cloud name

  try {
    const response = await fetch(
       "https://api.cloudinary.com/v1_1/cloudinary cloud name/image/upload", // Replace with your Cloudinary URL everything same just after V1_1/ put your cloudinary cloud name 
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url; // Return the image URL
  } catch (error) {
    toast.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

const handleFileChange = async (file) => {

  // setIsLoading(true); // Show a loading indicator
  try {
    // Upload file to Cloudinary
    const fileUrl = await uploadToCloudinary(file);

    // Send the file message
    const messageData = {
      message: fileUrl,
      from: userId,
      to: userInfo._id,
      type: "File",
      createdAt: new Date(),
      userRoom: room,
    };

    socket.emit("message", messageData); // Emit the message via socket
    // setMessagesData((prevMessages) => [...prevMessages, messageData]); // Update local state
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    setIsLoading(false);
  }
};



if (status === "loading") {
  return <ComponentLevelLoader  color="text-red-500" size="w-12 h-12" />; // Display "Uploading..." message when status is loading
}

if (status === "unauthenticated") {
  toast.error("Login first"); // Show toast error if status is unauthenticated
  return null; // Or return any other component if you don't want anything else to render
}

return (
  <div className="flex flex-col lg:flex-row h-full lg:h-[85vh] xl:h-[85vh] m-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 shadow-xl">
    {status === "authenticated" && (
      <>
        {/* Hamburger Icon for Mobile/Tablet */}
        <button
        className="block  xl:hidden p-2 bg-gray-200 rounded-full shadow-md fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FiMenu size={24} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full  bg-white shadow-lg p-4 z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform xl:static  xl:translate-x-0 xl:w-1/4 rounded-l-lg`}
      >
            <Sidebar />
          </div>

        {/* Overlay for Mobile/Tablet */}
        {isSidebarOpen && (
          <div
         className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Chat Content */}
        <div className="flex flex-col w-full xl:w-2/4 h-full bg-white rounded-lg shadow-lg">
          <ChatHeader userInfo={userInfo} />
          <div className="flex-1 bg-gray-200 overflow-y-auto p-4">
            <MessageList
              userMessages={messagesData || []}
              handleUpdateMessage={handleUpdateMessage}
              handleDeleteMessage={handleDeleteMessage}
              messagesContainerRef={messagesContainerRef}
              loadMoreMessages={loadMoreMessages}
              hasMoreMessages={hasMoreMessages}
            />
          </div>
          <div className="p-4 border-t">
            <MessageInput sendMessage={sendMessage} handleFileChange={handleFileChange} room={room} />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Side Profile */}
        <div className=" lg:block  xl:w-1/4 lg:w-1/2 bg-white p-6 rounded-r-lg shadow-lg">
          <SideProfile userProfile={userInfo} />
        </div>
      </>
    )}
  </div>
);
};

export default MessageUser;
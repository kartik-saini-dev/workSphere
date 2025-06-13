"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import Notification from "@/components/Notification";
import { socket } from "@/socket";

const MessageInput = ({ handleFileChange, sendMessage, room }) => {
  const [messageInput, setMessageInput] = useState("");
  const fileInputRef = useRef(null);
  const { data: session, status } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = () => {
    if (status !== "authenticated") {
      toast.error("Please log in first to send a message.");
      return;
    }

    if (messageInput.trim() === "") {
      toast.warning("Message cannot be empty!");
      return;
    }

    sendMessage(messageInput, setMessageInput);

    // Emit stopTyping when the message is sent
    socket.emit("stopTyping", { room, user: session?.user?.userId });

    // Clear the input
    setMessageInput("");
  };

  const handleTyping = (e) => {
    const inputValue = e.target.value;
    setMessageInput(inputValue);

    // If the input is cleared, emit stopTyping immediately
    if (inputValue.trim() === "") {
      socket.emit("stopTyping", { room, user: session?.user?.userId });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      return;
    }

    // Emit a `typing` event
    socket.emit("typing", { room, user: session?.user?.userId });

    // Clear the previous timeout for stopTyping
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to emit `stopTyping` after inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { room, user: session?.user?.userId });
    }, 2000); // 2 seconds of inactivity
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUploadClick = () => {
    if (status !== "authenticated") {
      toast.error("Please log in first to upload an image.");
      return;
    }

    fileInputRef.current.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await handleFileChange(file);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload the file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mt-4 space-x-4">
        <input
          type="file"
          onChange={onFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          className={`px-4 py-2 text-sm font-medium text-white rounded ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
        <textarea
          className="flex-grow p-2 border border-gray-300 rounded resize-none"
          placeholder="Type your message..."
          value={messageInput}
          onChange={handleTyping}
          onKeyPress={handleKeyPress} // Listen for Enter key press
          rows={1}
        />
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded hover:bg-purple-600"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
      <Notification />
    </div>
  );
};

export default MessageInput;

"use client";

import { useEffect, useRef, useState } from "react";
import Message from "../message";

const MessageList = ({
  userMessages,
  handleUpdateMessage,
  handleDeleteMessage,
  loadMoreMessages,
  hasMoreMessages,
}) => {
  const messagesContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showNoMoreMessages, setShowNoMoreMessages] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if user is manually scrolling

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;

    // Scroll to the bottom on initial load, but only if user hasn't scrolled up
    if (messagesContainer && !isUserScrolling) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [userMessages, isUserScrolling]); // Include isUserScrolling to trigger only if user hasn't scrolled

  const handleScroll = async () => {
    const messagesContainer = messagesContainerRef.current;

    // Check if the user is at the top
    if (!messagesContainer || loading) return;

    if (messagesContainer.scrollTop === 0) {
      if (hasMoreMessages) {
        setLoading(true); // Show loading state

        // Simulate a 2-second delay before loading more messages
        setTimeout(async () => {
          await loadMoreMessages(); // Load more messages
          setLoading(false);
        }, 1000); // Simulate delay
      } else {
        // No more messages, show "No more messages"
        setShowNoMoreMessages(true);
        setTimeout(() => setShowNoMoreMessages(false), 1000); // Hide after 1 seconds
      }
    }

    // Set that the user is scrolling manually
    if (messagesContainer.scrollTop < messagesContainer.scrollHeight - messagesContainer.clientHeight) {
      setIsUserScrolling(true);
    }
  };

  return (
    <div
      className="space-y-4 relative overflow-y-auto h-full"
      ref={messagesContainerRef}
      onScroll={handleScroll} // Handle scroll events
    >
      {/* Loading More Messages Indicator */}
      {loading && (
        <div className="absolute top-0 w-full flex justify-center">
          <p className="text-sm text-gray-500 animate-pulse">
            Loading more messages...
          </p>
        </div>
      )}

      {/* No More Messages Indicator */}
      {showNoMoreMessages && (
        <div className="absolute top-0 w-full flex justify-center">
          <p className="text-sm text-gray-500">No more messages</p>
        </div>
      )}

      {/* Render Messages */}
      {userMessages && userMessages.length > 0 ? (
        userMessages.map((message, index) => (
          <Message
            key={message._id}
            userId={message.from}
            text={message.text}
            type={message.type}
            createdAt={message.created_at}
            handleUpdate={(updatedText) =>
              handleUpdateMessage(message._id, updatedText)
            }
            handleDelete={() =>
              handleDeleteMessage(message._id, message.type, message.text)
            }
            isLastSeen={index === userMessages.length - 1 && message.seen}
          />
        ))
      ) : (
        <h1 className="text-center text-gray-400">Start Conversation :)</h1>
      )}
    </div>
  );
};

export default MessageList;

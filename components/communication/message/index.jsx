"use client";
import { useSession } from 'next-auth/react';
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useState } from 'react';
import Image from 'next/image';
// Inside the Message component
const Message = ({ text, userId, type, createdAt, handleUpdate, handleDelete, isLastSeen }) => {
  const { data: session } = useSession();
 
  const currentUserId = session?.user?.userId;

  const isSender = userId === currentUserId;
  const isFileMessage = type === 'File';
  const messageContainerClass = `mb-4 ${isSender ? 'text-right' : 'text-left'}`;
  const messageClass = ` p-5 space-x-0 rounded-lg inline-block ${
    isSender ? (isFileMessage ? 'text-white w-1/6' : '  w-2/6  bg-blue-500 text-white') : ' w-2/6  bg-gray-300 text-black'
  }`;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    handleUpdate(editedText);
    setIsEditing(false);
  };



  return (
    <div className={messageContainerClass}>
      <div>
        <div className='inline-block'>
          <span className="text-xs">
            {isEditing ? (
              <div className="text-right">
                <button
                  className="mr-2 bg-green-500 text-white h-6 px-2"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white h-6 px-2"
                  onClick={handleEditToggle}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {isSender ? (
                  <>
                  {!isFileMessage && (
                <FaPencilAlt
                  className="text-gray-500 hover:text-blue-600 mr-2 inline-block h-6 w-6 cursor-pointer"
                  size={18}
                  onClick={handleEditToggle}
                />
              )}
                    <FaTrashAlt
                      className=" h-6 inline-block w-6 cursor-pointer text-red-500 hover:text-red-700"
                      onClick={handleDelete}
                    />
                  </>
                ) : null}
              </>
            )}
          </span>
        </div>

        <div className={messageClass}>
          {isEditing ? (
            <input
              className='w-full  bg-transparent rounded-none outline-0'
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
          ) : (
            <span className="block text-left">
              {isFileMessage ? (
                <Image
                  src={text}
                  alt="File"
                  width={120}
                  height={120}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              ) : (
                text
              )}
            </span>
          )}
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {isLastSeen && isSender && <span className="text-green-500 mr-2">Seen</span>}
        <span>{new Date(createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  );
};

export default Message;

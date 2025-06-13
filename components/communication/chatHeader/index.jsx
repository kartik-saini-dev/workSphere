


"use client";

import moment from 'moment';
import { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { GlobalContext } from '@/context';
import PageLevelLoader from '@/components/Loader';
import { socket } from '@/socket';

const ChatHeader = ({ userInfo, onClose }) => {
  const [localTime, setLocalTime] = useState();
  const { data: session } = useSession();
  const router = useRouter();
  const { pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext);
  const [typingUsers, setTypingUsers] = useState(false);

  useEffect(() => {
    // Listen for typing events
    socket.on("userTyping", ({ user }) => {
      if (user !== session?.user?.userId) { // Only add if it's not the current user
        setTypingUsers(true);
      }
    });

    socket.on("userStoppedTyping", ({ user }) => {
      setTypingUsers(false);
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [session?.user?.name]);

  useEffect(() => {
    const updateLocalTime = () => {
      const currentDate = new Date();
      const formattedLocalTime = currentDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      setLocalTime(formattedLocalTime);
    };
    updateLocalTime();
    const intervalId = setInterval(updateLocalTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateLastSeen = (lastSeenTimestamp) => {
    if (!lastSeenTimestamp) return 'N/A';
    const now = moment();
    const lastSeen = moment(lastSeenTimestamp);
    const duration = moment.duration(now.diff(lastSeen));
    if (duration.asSeconds() < 60) return 'Just now';
    if (duration.asMinutes() < 60) return `${Math.floor(duration.asMinutes())} minutes ago`;
    if (duration.asHours() < 24) return `${Math.floor(duration.asHours())} hours ago`;
    if (duration.asDays() < 30) return `${Math.floor(duration.asDays())} days ago`;
    return 'More than a month ago';
  };


  return (
    <>
      {pageLevelLoader && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <PageLevelLoader />
        </div>
      )}
      <div className="flex items-center p-4 border border-gray-200 rounded relative">
        {userInfo && (
          <div className="flex items-center">
            <div className="relative">
              {userInfo.online && (
                <div className="absolute bg-green-500 w-4 h-4 rounded-full -top-1 -right-1"></div>
              )}
              {userInfo.profilePic ? (
                <Image src={userInfo.profilePic} alt="Profile" width={40} height={40} className="rounded-full" />
              ) : (
                <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                  <span className="text-xl text-white">{userInfo.email?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <p className="text-lg cursor-pointer font-bold" >
                {userInfo.username}
              </p>
              <p className="text-gray-500">{userInfo.fullname || null}</p>
              {userInfo.lastSeen && !userInfo.online && (
                <p>Last seen: {calculateLastSeen(userInfo.lastSeen)}</p>
              )}
              <p className="text-gray-500">Time: {localTime}</p>
              {/* Display typing users */}
              {typingUsers && (
                <p className="text-blue-500 text-sm">
                   typing...
                </p>
              )}
            </div>
          </div>
        )}

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none transition-all duration-300 transform hover:scale-110"
          >
            X
          </button>
        )}
      </div>
    </>
  );
};

export default ChatHeader;


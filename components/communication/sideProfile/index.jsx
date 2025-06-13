import { FaCalendarAlt, FaUser, FaEnvelope, FaCircle } from "react-icons/fa";
import Image from "next/image";

const SideProfile = ({ userProfile }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Extract the first letter from the email as a fallback avatar
  const getEmailInitial = (email) => (email ? email[0].toUpperCase() : "");

  return (
    <aside className="flex flex-col items-center p-6 space-y-6 bg-white shadow-md rounded-lg">
      {/* Profile Picture or Fallback Initial */}
      {userProfile?.profilePic ? (
        <Image
          src={userProfile.profilePic}
          alt="Profile"
          className="rounded-full shadow-md"
          width={120}
          height={120}
        />
      ) : (
        <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-gray-400 rounded-full shadow-md">
          {getEmailInitial(userProfile?.email)}
        </div>
      )}

      {/* Full Name or Username */}
      <h2 className="text-xl font-semibold text-gray-800">
        {userProfile?.fullName ? `Full Name: ${userProfile.fullName}` : userProfile?.username}
      </h2>
      {/* Online Status */}
      <p
        className={`text-sm flex items-center ${userProfile?.online ? "text-green-600" : "text-gray-500"
          }`}
      >
        <FaCircle className="mr-2" />
        {userProfile?.online ? "Online" : "Offline"}
      </p>

      {/* Description */}
      {userProfile?.description && (
        <p className="text-center text-gray-600 italic">{userProfile.description}</p>
      )}

      {/* Profile Details */}
      <div className="w-full space-y-4 text-sm text-gray-600">
        {/* Email */}
        <div className="flex items-center justify-between">
          <FaEnvelope className="text-blue-500 w-5 h-5 mr-2" />
          <span>{userProfile?.email}</span>
        </div>

        {/* Member Since */}
        <div className="flex items-center justify-between">
          <FaCalendarAlt className="text-green-600 w-5 h-5 mr-2" />
          <span>Joined: {formatDate(userProfile?.createdAt)}</span>
        </div>

        {/* Last Seen */}
        <div className="flex items-center justify-between">
          <FaUser className="text-purple-500 w-5 h-5 mr-2" />
          <span>Last Seen: {formatDate(userProfile?.lastSeen)}</span>
        </div>

        {/* Verified */}
        <div className="flex items-center justify-between">
          <FaCircle
            className={`w-5 h-5 mr-2 ${userProfile?.isVerified ? "text-green-600" : "text-red-600"
              }`}
          />
          <span>{userProfile?.isVerified ? "Verified" : "Not Verified"}</span>
        </div>
      </div>
    </aside>
  );
};

export default SideProfile;

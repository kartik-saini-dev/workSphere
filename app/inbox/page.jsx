import Sidebar from '../../components/communication/chatSideBar/index';
import { FaInbox, FaSearch, FaUserAlt } from 'react-icons/fa';  // Import icons for more visual appeal

export default async function Inbox() {
  return (
    <div className="flex flex-col lg:flex-row m-6 sm:m-10 bg-gray-100 min-h-screen">
      <Sidebar />
  
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-lg mx-6 sm:mx-10 lg:mx-16">
        <div className="flex items-center space-x-3 mb-8">
          <FaInbox className="text-blue-500 text-4xl" />
          <h1 className="text-4xl font-semibold text-gray-800">Inbox</h1>
        </div>
  
        <h2 className="text-xl text-gray-600 mb-4">Start where you left off, stay connected with your messages</h2>
        
        {/* Quick Links or User Profile Section */}
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 mb-4 sm:mb-0">
          <div className="flex flex-col items-center text-center mb-4 sm:mb-0">
            <FaUserAlt className="text-blue-500 text-3xl mb-2" />
            <p className="text-sm text-gray-600">Your Profile</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaInbox className="text-blue-500 text-3xl mb-2" />
            <p className="text-sm text-gray-600">New Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
  
}

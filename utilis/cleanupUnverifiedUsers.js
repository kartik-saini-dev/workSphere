import User from "../models/user"

export const cleanupExpiredTokens = async () => {
    
  console.log("yes");
    const expiredUsers = await User.find({
      $or: [
        { isVerified: false, verificationTokenExpires: {  $lte: new Date() } },
        { resetPasswordExpires: {  $lte: new Date() } },
      ],
    });
  
    expiredUsers.forEach(async (user) => {
      await user.remove();
    });
  };
  
  // Run the cleanup task every hour
  setInterval(cleanupExpiredTokens, 1 * 60 * 60 * 1000);
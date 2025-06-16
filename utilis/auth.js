import User from "../models/user"; // Importing the User model for database interactions.
import GithubProvider from "next-auth/providers/github"; // GitHub OAuth provider for authentication.
import GoogleProvider from "next-auth/providers/google"; // Google OAuth provider for authentication.
import connectToDb from "../database/index"; // Utility to establish a connection with the database.
import xss from "xss"; // To sanitize user input and prevent XSS attacks.
import bcrypt from "bcryptjs"; // Library for hashing and comparing passwords securely.
import Joi from "joi"; // Library for validating user input schema.
import CredentialsProvider from "next-auth/providers/credentials"; // Provider for custom email-password authentication.
import { getServerSession } from "next-auth"; // Utility to retrieve the current session on the server.


async function generateUniqueUsername(baseUsername) {
  let uniqueUsername = baseUsername;
  let counter = 1;

  while (true) {
    const existingUser = await User.findOne({ username: uniqueUsername });
    if (!existingUser) break; // No clash; username is unique
    uniqueUsername = `${baseUsername}${counter}`; // Append counter to make it unique
    counter++;
  }

  return uniqueUsername;
}


export const authOptions = {
  providers: [
    // Adding Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      httpOptions: {
        timeout: 10000, // Set timeout to 10 seconds
      },
    }),
    // Adding GitHub OAuth provider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Custom provider for email-password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Validate and sanitize inputs
        const schema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        });

        const sanitizedData = {
          email: xss(email),
          password: xss(password),
        };

        const { error } = schema.validate(sanitizedData);
        if (error) {
          throw new Error(error.details[0].message);
        }

        // Connect to the database
        await connectToDb();

        // Check if a user exists with the given email
        const user = await User.findOne({ email: sanitizedData.email });
        if (!user) throw new Error("Invalid email or password.");

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(sanitizedData.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        // Return user details
        return {
          id: user._id,
          email: user.email,
          name: user.username,
          image: user.profilePic,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  debug: true, // Enable detailed logs for debugging
  pages: {
    signIn: "/", // Custom sign-in page
  },
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // JWT expiration time (3 days)
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Sign-in callback
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "github") {
        const { email, name, picture } = profile;

        // Normalize username: convert to lowercase and remove spaces
   

        // Connect to the database
        await connectToDb();

        let existingUser = await User.findOne({ email });
        if (!existingUser) {
          // Username clash logic
          const usernameClashUser = await User.findOne({ username: name });
          if (usernameClashUser) {
            // Modify the existing user's username to make space for the new user
            const modifiedUsername = await generateUniqueUsername(usernameClashUser.username);
            await User.findByIdAndUpdate(usernameClashUser._id, { username: modifiedUsername });
          }
          const newUser = new User({
            email,
            username: name,
            profilePic: picture,
            isVerified: true,
            online: true,
          });
          await newUser.save();
          existingUser = newUser; // Update reference to the newly created user
        }

        // Update user's online status
        await User.findByIdAndUpdate(existingUser._id, { online: true });
      }
      return true;
    },
  // Session callback
    async session({ session }) {
      if (session) {
        const sessionUser = await User.findOne({ email: session?.user?.email });
        if (sessionUser) {
          session.user.userId = sessionUser._id;
           session.user.createdAt = sessionUser.createdAt;
        }
      }
      return session;
    },
  },
};

// Helper function to get the current session on the server
export const getAuthSession = () => getServerSession(authOptions);

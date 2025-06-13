import { NextResponse } from 'next/server';
import connectToDB from "../../../database/index";
import User from "../../../models/user";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
     await connectToDB();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (username !== undefined) {
      // Perform a case-insensitive search using regex
      const userInformation = await User.findOne({
        username: { $regex: new RegExp(`^${username}$`, "i") }
      });

      if (userInformation) {
        return NextResponse.json({ success: true, userInfo: userInformation });
      } else {
        return NextResponse.json({ success: false, message: "User does not exist" });
      }
    }

    return NextResponse.json({ success: false, message: "Username parameter is required" });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
}

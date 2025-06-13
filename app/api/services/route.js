import connectToDB from "@/database/index";
import services from "@/models/services";
import { NextResponse } from "next/server";
import User from "@/models/user";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage")) || 2; // Default to 5 items per page

    if (!username) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Username is required",
      });
    }

    const userExist = await User.findOne({ username: username.toLowerCase() });

    if (!userExist) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "User does not exist",
      });
    }

    // Pagination logic
    const totalservices = await services.countDocuments({ userId: userExist._id });
    const totalPages = Math.ceil(totalservices / itemsPerPage);
    const skip = (page - 1) * itemsPerPage;

    const services = await services.find({ userId: userExist._id })
      .populate("userId reviews")
      .skip(skip)
      .limit(itemsPerPage);

    if (services.length > 0) {
      return NextResponse.json({
        success: true,
        pagination: {
          totalPages,
          itemsPerPage,
        },
        data: services,
      });
    }

    return NextResponse.json({
      success: false,
      status: 204,
      message: "No services found!",
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}
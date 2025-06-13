import connectToDB from "@/database/index";
import services from "@/models/services";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {

  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const serviceID= searchParams.get("serviceId");

    const serviceExist = await services.findOne({ _id: serviceID })
    .populate({
      path: "userId", // Populate the user who created the service
      model: "User",
    })
    .populate({
      path: "reviews", // Populate the reviews
      populate: {
        path: "reviewer", // Populate the reviewer within each review
        model: "User", // Ensure you reference the correct model for users
      },
    });

                 
    if (serviceExist) {

        return NextResponse.json({
            success: true,
            data: serviceExist,
          });
   
    } else{
        return NextResponse.json({
            success: false,
            status: 204,
            message: "service Not exist",
          });

    }
  } catch (e) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
};
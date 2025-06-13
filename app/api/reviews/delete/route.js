import connectToDB from "@/database/index";
import services from "@/models/services";
import Review from "@/models/review";
import { NextResponse } from "next/server";



export async function DELETE(req) {
  try {
    await connectToDB();

    // Parse the URL to extract query parameters
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");
    const serviceId = searchParams.get("serviceId");

    if ( !reviewId || !serviceId) {
      return NextResponse.json(
        { success: false, message: "Missing required query parameters." }
      );
    }

    // Find and delete the review from the database
    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
    });

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found or unauthorized action." }
      );
    }

    // Remove the review ID from the associated service
    const updatedservice = await services.findByIdAndUpdate(
      serviceId,
      { $pull: { reviews: reviewId } },
      { new: true }
    );

    if (!updatedservice) {
      return NextResponse.json(
        { success: false, message: "Associated service not found." }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully and service updated.",
      updatedservice,
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
}

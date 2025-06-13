import connectToDB from "@/database/index";
import services from "@/models/services";
import { NextResponse } from "next/server";
import Review from "@/models/review";


export async function POST(req) {
  try {
    await connectToDB();
      const {searchParams} = new URL(req.url);
      const {reviewText,rating} = await req.json();

      const serviceId = searchParams.get("serviceId");
      const reviewerId= searchParams.get("reviewerId");
  
      if(serviceId!==null && reviewerId!==null){
        const newReview = await Review.create({
          serviceId,
          reviewer:reviewerId,
          desc:reviewText,
          rating
        });
        if(newReview){
          
          const serviceExist = await services.findById(serviceId);
    
           if(serviceExist){
            serviceExist.reviews.push(newReview._id);
            await serviceExist.save(); 
           }else{
            return NextResponse.json({ 
              success: false,
              message: "service doesn't exist",
            });
          }
        }else{
          return NextResponse.json({ 
            success: false,
            message: "Failed to create a Review",
          });
        }
        return NextResponse.json({ 
          success: true,
          message: "review Added Successfully",
        });
      }else{
        return NextResponse.json({ 
          success: false,
          message: "Failed to create a Review",
        });

      }
 

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
};
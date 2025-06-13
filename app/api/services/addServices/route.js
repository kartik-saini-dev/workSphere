import { json } from "express";
import connectToDB from "../../../../database/index";
import services from "../../../../models/services";
import { NextResponse } from "next/server";



export async function POST(req) {
  try {
    await connectToDB();
 

    const { 
      title, 
      description, 
      category, 
      pricing, 
      videoURL, 
      keywords,
      shortDescription, 
      images, 
      userId,
      requirements 
    } = await req.json();
    
   

    // Destructure pricing into basic, standard, and premium objects
    const { basic, standard, premium ,time} = pricing;

    // Initialize pricing object to be filled dynamically
    const pricingObj = {};

    // Add basic pricing if it's filled
    if (basic.price && basic.revisions && basic.features.length > 0) {
      pricingObj.basic = {
        price: parseInt(basic.price),
        revisions: parseInt(basic.revisions),
        features: basic.features,
        time : parseInt(basic.time),
      };
    }

    // Add standard pricing if it's filled
    if (standard.price && standard.revisions && standard.features.length > 0) {
      pricingObj.standard = {
        price: parseInt(standard.price), // convert to integer
        revisions: parseInt(standard.revisions),
        features: standard.features,
        time : parseInt(standard.time),
      };
    }

    // Add premium pricing if it's filled
    if (premium.price && premium.revisions && premium.features.length > 0) {
      pricingObj.premium = {
        price: parseInt(premium.price),
        revisions: parseInt(premium.revisions),
        features: premium.features,
        time : parseInt(premium.time),
      };
    }

    // If no valid pricing tiers are provided, return an error response
    if (Object.keys(pricingObj).length === 0) {
      return NextResponse.json({
        success: false,
        message: "At least one pricing tier (basic, standard, or premium) is required.",
      });
    }

    // Create the new service with the constructed pricing object
    const newservice = await services.create({
      title,
      description,
      category,
      keywords,
      pricing: pricingObj, // Use the dynamically constructed pricing object
      videoURL, // Store video URL
      shortDesc: shortDescription, // Store short description
      userId,
      images, // Store images
      requirements, // Store requirements (if any)
      sales: 0, // Default value for sales
      reviews: [], // Default empty array for reviews
      totalStars: 0, // Default total stars
      starNumber: 0, // Default star number
    });

    if (newservice) {
      return NextResponse.json({ 
        success: true,
        message: "service created successfully!",
      });
    } else {
      return NextResponse.json({ 
        success: false,
        message: "Failed to create the service.",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}



import connectToDB from "../../../../database/index";
import services from "../../../../models/services";
import { NextResponse } from "next/server";
import Orders from "@/models/orders";
import Stripe from "stripe";

// Use environment variables for sensitive information
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await connectToDB(); // Connect to MongoDB

    // Parse request data
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");
    const { serviceId, pricingTier = "basic" } = await req.json();

    // Validate input data
    if (!buyerId || !serviceId || !["basic", "standard", "premium"].includes(pricingTier)) {
      return NextResponse.json(
        { success: false, message: "Invalid input data." },
        { status: 400 }
      );
    }

    // Fetch service details securely
    const service = await services.findById(serviceId).exec();
    if (!service) {
      return NextResponse.json(
        { success: false, message: "service not found." },
        { status: 404 }
      );
    }

    const price = service.pricing?.[pricingTier]?.price;
    if (!price) {
      return NextResponse.json(
        {
          success: false,
          message: `Price for the selected tier (${pricingTier}) not found.`,
        },
        { status: 400 }
      );
    }

    // Create the order in the database
    const newOrder = new Orders({
      price,
      buyer: buyerId,
      service: service._id,
      seller: service.userId,
    });

    await newOrder.save();

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.title, // Assuming the service has a 'title' property
            },
            unit_amount: price * 100, // Convert price to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // checkoutsessionid is built in in strope
      cancel_url: `${process.env.BASE_URL}/cancel`, // Use environment variable for base URL
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    // Save the Stripe session ID in the order
    newOrder.checkoutSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error("Error processing the request:", error);

    // Return generic error message to avoid exposing details
    return NextResponse.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}

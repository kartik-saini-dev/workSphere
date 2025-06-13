import Stripe from "stripe";
import connectToDB from "../../../../database/index";
import Orders from "../../../../models/orders";
import { NextResponse } from "next/server";


// Initialize Stripe with your secret key (use environment variables in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function PUT(req) {
  await connectToDB();


  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");


  if (!sessionId) {
    return NextResponse.json(
      {
        success: false,
        message: "Session ID is required.",
      },
      { status: 400 }
    );
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Retrieve the order ID from the session's metadata and need to send to client side 
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID not found in session metadata.",
        },
        { status: 404 }
      );
    }

    // Retrieve the order from the database
    const order = await Orders.findById(orderId).exec();
    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found in database.",
        },
        { status: 404 }
      );
    }

    // If the session is successful, mark the order as completed
    if (session.payment_status === "paid") {
      order.isCompleted = true;
      await order.save(); // Save the updated order
    }

    // Return the orderId and status after updating
    return NextResponse.json({
      success: true,
      orderId: order._id,
      status: order.status, // You can include other order details here
      isCompleted: order.isCompleted, // Confirm that the order is marked as completed
    });
  } catch (error) {
    console.error("Error retrieving session details:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

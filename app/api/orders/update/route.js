import  Orders  from "@/models/orders"; // Import your Order model or the relevant MongoDB model
import { NextResponse } from "next/server";

export async function PUT(req){
  try {

    const {paymentIntent} = await req.json();
    // Find and update the order based on the payment intent
    const updatedOrder = await Orders.findOneAndUpdate(
      {
        paymentIntent: paymentIntent, // Assuming your model has a field called "paymentIntent"
      },
      {
        $set: {
          isCompleted: true,
        },
      },
      { new: true } // To get the updated order
    );

    if (updatedOrder) {
      return NextResponse.json({
        success: true,
        message: "Order has been confirmed.",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Order not found or could not be updated.",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

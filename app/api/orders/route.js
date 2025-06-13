

import connectToDB from "../../../database/index";
import { NextResponse } from "next/server";
import Orders from "@/models/orders";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);

    const serviceId = searchParams.get("serviceId");
    const userId = searchParams.get("userId");
    const sellerUserId = searchParams.get("sellerUserId");
    const page = parseInt(searchParams.get("page")) || 1; // Default to page 1
    const limit = parseInt(searchParams.get("limit")) || 10; // Default to 10 items per page

    if (serviceId && userId) {
      const hasOrdered = await Orders.findOne({ service: serviceId, buyer: userId });

      return NextResponse.json({
        success: !!hasOrdered,
        message: hasOrdered ? "Order found" : "No order found",
      });
    }

    // Pagination logic for buyer's orders
    if (userId) {
      const totalOrders = await Orders.countDocuments({ buyer: userId });
      const buyerAllOrders = await Orders.find({ buyer: userId })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "service",
          populate: {
            path: "userId",
            model: "User",
          },
        });

      return NextResponse.json({
        success: true,
        orders: buyerAllOrders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        message: buyerAllOrders.length > 0 ? "Orders retrieved" : "No orders found",
      });
    }

    // Pagination logic for seller's orders
    if (sellerUserId) {
      const totalOrders = await Orders.countDocuments({ seller: sellerUserId });
      const sellerAllOrders = await Orders.find({ seller: sellerUserId })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("service")
        .populate("buyer");

      return NextResponse.json({
        success: true,
        orders: sellerAllOrders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        message: sellerAllOrders.length > 0 ? "Orders retrieved" : "No orders found",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Invalid request. Please provide valid query parameters.",
    });
  } catch (error) {
    console.error("Error during fetching orders:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}

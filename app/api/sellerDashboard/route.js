import connectToDB from "../../../database/index";
import services from "../../../models/services";
import Orders from "../../../models/orders";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// Helper function for revenue aggregation
const calculateRevenue = async (sellerId, startDate, endDate) => {
  try {
    const matchStage = {
      isCompleted: true,
      ...(startDate && endDate && { createdAt: { $gte: startDate, $lte: endDate } }),
      seller: new mongoose.Types.ObjectId(sellerId),
    };

    const revenue = await Orders.aggregate([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    return revenue.length > 0 ? revenue[0].totalRevenue : 0;
  } catch (error) {
    console.error("Error in calculateRevenue:", error);
    return 0;
  }
};

// Helper function to calculate monthly revenues for a given year
const calculateMonthlyRevenues = async (sellerId, year) => {
  try {
    const monthlyRevenues = [];

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const revenue = await calculateRevenue(sellerId, startOfMonth, endOfMonth);
      monthlyRevenues.push(revenue);
    }

    return monthlyRevenues;
  } catch (error) {
    console.error("Error in calculateMonthlyRevenues:", error);
    return Array(12).fill(0); // Return an array of zeros in case of an error
  }
};

export async function GET(req) {
  try {
    await connectToDB(); // Establish database connection

    const { searchParams } = new URL(req.url);
    const sellerId = searchParams.get("userId");
    const yearParam = searchParams.get("year");

    if (!sellerId) {
      return NextResponse.json({
        success: false,
        message: "User ID is missing",
      });
    }

    // Determine the year to use
    const now = new Date();
    const currentYear = now.getFullYear();
    const year = yearParam ? parseInt(yearParam, 10) : currentYear;

    // Fetch counts for services and completed orders
    const servicesCount = (await services.countDocuments({ userId: sellerId })) || 0;
    const ordersCount =
      (await Orders.countDocuments({ isCompleted: true, seller: sellerId })) || 0;

    // Get time ranges for the current year
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    // Calculate revenues
    const dailyRevenue = await calculateRevenue(sellerId, startOfDay, endOfDay);
    const monthlyRevenue = await calculateRevenue(sellerId, startOfMonth, endOfMonth);
    const yearlyRevenue = await calculateRevenue(sellerId, startOfYear, endOfYear);

    // Calculate monthly revenues for the selected year
    const allMonthlyRevenues = await calculateMonthlyRevenues(sellerId, year);

    return NextResponse.json({
      dashboardData: {
        servicesCount,
        ordersCount,
        dailyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        monthlyEarnings: allMonthlyRevenues, // Add monthly earnings data for the selected year
      },
      success: true,
    });
  } catch (error) {
    console.error("Dashboard server error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

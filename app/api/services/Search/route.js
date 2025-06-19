import connectToDB from "../../../../database/index";
import services from "../../../../models/services";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const page = parseInt(searchParams.get("page")) || 1;
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage")) || 4;

    if (!category) {
      return NextResponse.json({
        success: false,
        status: 400,
        message: "Category is required",
      });
    }

    const searchQuery = category.replace(/\s+/g, ".*");
    const categoryRegex = new RegExp(searchQuery, "i");

    

    const filterQuery = {
      $or: [
        { category: categoryRegex },
        { keywords: categoryRegex },
      ],
    };

    if (subCategory) {
      const subCategoryRegex = new RegExp(subCategory.replace(/\s+/g, ".*"), "i");
      filterQuery.$and = [
        { $or: [{ category: categoryRegex }, { keywords: categoryRegex }] },
        { keywords: subCategoryRegex },
      ];
    }

    const totalservices = await services.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalservices / itemsPerPage);

    const foundServices = await services.find(filterQuery)
    .populate("userId reviews")
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage);
   
    console.log(foundServices,"this is services");
console.log("🔍 Filter Query:", filterQuery);
console.log("🧠 Category Regex:", categoryRegex);
console.log("📦 Found Services:", page);
    console.log("📦 itemsperpage", itemsPerPage);

    console.log("📦 page", foundServices.length);
  if (foundServices.length) {
      return NextResponse.json({
        success: true,
        data: foundServices,
        pagination: {
          currentPage: page,
          totalPages,
          totalservices,
          itemsPerPage,
        },
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No services found!",
      });
    }
  } catch (error) {
    console.error("Error fetching services by category and subcategory:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again later.",
    });
  }
}

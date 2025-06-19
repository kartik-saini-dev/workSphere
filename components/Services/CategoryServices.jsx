"use client";

import { useState, useEffect ,useContext} from "react";
import Pagination from "@/components/pagination";
import SearchGridItem from "../Search/SearchGridItem";
import { GlobalContext } from "@/context";

export default function Categoryservices({ servicesData = [], pagination = {}, category,subCategory }) {
 
  const [services, setservices] = useState(servicesData || []);
  const [filteredservices, setFilteredservices] = useState(servicesData || []);
  const [sortOrder, setSortOrder] = useState("new"); // new, latest, stars, sales, pricing
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [currentPage, setCurrentPage] = useState(1);
  const { setPageLevelLoader } = useContext(GlobalContext);
  const itemsPerPage = pagination?.itemsPerPage || 6;

  // Apply filters based on selected sort order and price range
  const applyFilters = (services) => {
    let filtered = [...services];

    // Price Range Filter
    filtered = filtered.filter(
      (service) =>
        (priceRange.min === 0 || service.pricing.basic.price >= priceRange.min) &&
        (priceRange.max === 0 || service.pricing.basic.price <= priceRange.max)
    );

    // Sorting Logic
    switch (sortOrder) {
      case "new":
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "latest":
        filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "stars":
        filtered = filtered.sort((a, b) => b.totalStars - a.totalStars);
        break;
      case "sales":
        filtered = filtered.sort((a, b) => b.sales - a.sales);
        break;
      case "pricing":
        filtered = filtered.sort((a, b) => a.pricing.basic.price - b.pricing.basic.price);
        break;
      default:
        break;
    }

    setFilteredservices(filtered);
  };

  // Handle page change
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    try {
      const response = await fetch(
        `/api/services/Search?category=${category}&subCategory=${subCategory}&page=${page}&itemsPerPage=${itemsPerPage}`
      );
      const { data } = await response.json();
     console.log(data);
      setservices(data); // Set new services data
      applyFilters(data); // Apply filters to the new services data
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  // Run filter logic when services data or filters change
  useEffect(() => {
    applyFilters(services); // Apply filters on initial load or when the services list changes
  }, [services, sortOrder, priceRange]);

  return (
    <div className="mx-12 mb-24">
      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-between bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8 gap-4">
        {/* Sort Filter */}
        <div className="flex flex-col">
          <label htmlFor="sortOrder" className="text-sm font-semibold text-gray-600 mb-2">
            Sort By
          </label>
          <select
            id="sortOrder"
            className="py-2 px-4 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="new">Newest First</option>
            <option value="latest">Oldest First</option>
            <option value="stars">Top Rated</option>
            <option value="sales">Best Sellers</option>
            <option value="pricing">Lowest Price</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-2">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-24 py-2 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })
              }
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              className="w-24 py-2 px-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Explore Services in
          <span className="text-blue-500 capitalize ml-2">

            {category.replace(/([A-Z])/g, " $1").toLowerCase()}  
          </span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Find the best service tailored to your needs and budget.
        </p>
      </div>

      {/* services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredservices.length ? (
          filteredservices.map((service) => <SearchGridItem service={service} key={service._id} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 font-medium">
            No Services available. Try changing the filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="w-full flex items-center justify-center mt-8">
          <Pagination
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
}

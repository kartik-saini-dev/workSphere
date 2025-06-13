

"use client";

import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/context";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrashAlt, FaListUl } from "react-icons/fa";
import Pagination from "@/components/pagination";


function Allservices({ servicesData , pagination  ,username}) {

  const { setPageLevelLoader, setserviceData } = useContext(GlobalContext);
  const [services, setservices] = useState(servicesData || []);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = pagination?.itemsPerPage || 5; // Adjust as needed

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);


  const handlePageChange = async (page) => {
    setCurrentPage(page);
    try {
      const response = await fetch(`/api/services?username=${username}&page=${page}&itemsPerPage=${itemsPerPage}`);
      const { data } = await response.json();
   
      setservices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  return (
    <div className="min-h-[80vh] my-10 mt-0 px-4 sm:px-6 lg:px-32">
      <h3 className="m-5 text-3xl font-bold text-gray-800 flex items-center gap-3">
        <FaListUl className="text-blue-600" />
        All Your services
      </h3>
      <div className="relative overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">service Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Delivery Time</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services?.length ? (
              services.map((service) => (
                <tr
                  className="bg-white hover:bg-gray-100 border-b dark:border-gray-700"
                  key={service._id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{service.title}</td>
                  <td className="px-6 py-4">{service.category}</td>
                  <td className="px-6 py-4">${service.pricing.basic.price || "N/A"}</td>
                  <td className="px-6 py-4">{service.time || "N/A"}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    {/* Edit service */}
                    <button
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                      onClick={() => {
                        setserviceData(service); // Update service data in global context
                        router.push(`/services/create?serviceId=${service._id}`);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    {/* Delete service */}
                    <button
                      className="flex items-center gap-2 text-red-600 hover:underline"
                      onClick={() => handleDelete(service._id)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No services available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default Allservices;

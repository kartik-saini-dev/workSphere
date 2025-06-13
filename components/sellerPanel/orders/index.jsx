"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { useSession } from "next-auth/react";
import { GlobalContext } from "@/context";
import { FaUser, FaEnvelope, FaClock, FaDollarSign, FaBoxes } from "react-icons/fa";
import { usePageState } from "@/utilis/hooks/customhooks";
import Pagination from "@/components/pagination";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const { data: session , status } = useSession();
  const { setPageLevelLoader } = useContext(GlobalContext);
  const [page, handlePageChange] = usePageState("sellerOrderPage");
  const itemsPerPage = 2; // Ensure this matches backend logic
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    const getOrders = async () => {
      try {
 
        const { data } = await axios.get(`/api/orders`, {
          params: {
            sellerUserId: session?.user?.userId,
            page,
            limit: itemsPerPage,
          },
        });
        setTotalPages(data.totalPages);
        setOrders(data.orders || []);
        setTotalOrders(data.totalOrders || 0);
      } catch (err) {
        console.error(err);
      }
    };
    if (session && status === "authenticated") getOrders();
  }, [session, status]);

  if (status === "unauthenticated") {
    return <p className="text-center text-lg text-red-600 font-semibold mt-10">Please login to view your orders.</p>;
  }

  return (
    <div className="min-h-[80vh] my-10 px-8 sm:px-16 lg:px-32">
      {session ? (
        <>
          <h3 className="text-3xl font-semibold mb-8 text-gray-800">📦 All Your Work Orders</h3>
          <div className="relative overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    <FaBoxes className="inline mr-2 text-gray-600" /> Order ID
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaUser className="inline mr-2 text-gray-600" /> Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaBoxes className="inline mr-2 text-gray-600" /> Category
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaDollarSign className="inline mr-2 text-gray-600" /> Price
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaClock className="inline mr-2 text-gray-600" /> Delivery Time
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaUser className="inline mr-2 text-gray-600" /> Ordered By
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaClock className="inline mr-2 text-gray-600" /> Order Date
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <FaEnvelope className="inline mr-2 text-gray-600" /> Send Message
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      className="bg-white border-b hover:bg-gray-100"
                      key={order._id}
                    >
                      <td className="px-6 py-4 text-gray-900">{order._id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.service.title}
                      </td>
                      <td className="px-6 py-4">{order.service.category}</td>
                      <td className="px-6 py-4">${order.price}</td>
                      <td className="px-6 py-4">{order.service.time} days</td>
                      <td className="px-6 py-4">
                        {order.buyer.fullName} ({order.buyer.username})
                      </td>
                      <td className="px-6 py-4">{order.createdAt.split("T")[0]}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/inbox/${order.buyer.username}`}
                          className="font-medium text-blue-600 hover:underline flex items-center"
                        >
                          <FaEnvelope className="mr-2" />
                          Send
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                      No orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalOrders > itemsPerPage && (
            <div className="w-full flex items-center justify-center mt-8">
              <Pagination
                 totalPages={totalPages}
                  onPageChange={handlePageChange}
                  currentPage={page}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-center mt-20 text-lg font-semibold">
          Please login to view your orders.
        </p>
      )}
    </div>
  );
}

export default Orders;
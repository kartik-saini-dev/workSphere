
"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState, useContext } from "react";
import { FaEnvelope, FaShoppingCart } from "react-icons/fa";
import { GlobalContext } from "@/context";
import { usePageState } from "@/utilis/hooks/customhooks";
import Pagination from "@/components/pagination";

function BuyOrders() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const { data: session, status } = useSession();
  const { setPageLevelLoader } = useContext(GlobalContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [page, handlePageChange] = usePageState("buyerOrderPage");
  const itemsPerPage = 2; // Ensure this matches backend logic

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    
    const fetchOrders = async () => {
      if (!session) return;

      try {
        const { data } = await axios.get(`/api/orders`, {
          params: {
            userId: session?.user?.userId,
            page,
            limit: itemsPerPage,
          },
        });
        setOrders(data.orders || []);
         setCurrentPage(data.currentPage);
         setTotalPages(data.totalPages);
        
        setTotalOrders(data.totalOrders || 0);
      } catch (err) {
        console.error(err); // Consider replacing this with a toast notification
      }
    };

    fetchOrders();
  }, [session, page]);


  if (status === "loading") {
    return <p className="text-center mt-20 text-lg font-semibold">Loading...</p>;
  }
  return (
    <div className="min-h-[80vh] py-10 px-5 lg:px-20 bg-gray-50">
      {session ? (
        <div className="flex flex-col gap-5">
          <h3 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaShoppingCart className="text-green-600" /> Your Purchased Orders
          </h3>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">Order ID</th>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Delivery Time</th>
                  <th scope="col" className="px-6 py-3">Order Date</th>
                  <th scope="col" className="px-6 py-3">Send Message</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      className="bg-white border-b hover:bg-gray-100"
                      key={order._id}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order._id}
                      </td>
                      <td className="px-6 py-4">{order.service?.title || 'N/A'}</td>
                      <td className="px-6 py-4">{order.service?.category || 'N/A'}</td>
                      <td className="px-6 py-4">${order.price || 'N/A'}</td>
                      <td className="px-6 py-4">{order.service?.time ? `${order.service.time} days` : 'N/A'}</td>
                      <td className="px-6 py-4">
                        {order.createdAt ? order.createdAt.split('T')[0] : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {order?.service?.userId?.username ? (
                          <Link href={`/inbox/${order.service.userId.username}`}>
                            <button className="flex items-center gap-2 font-medium text-blue-600 hover:underline">
                              <FaEnvelope /> Send
                            </button>
                          </Link>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-600">
                      No orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {orders && orders.length > 0 && (
              <div className="w-full flex items-center justify-center mt-12">
                <Pagination
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  currentPage={page}
                />
              </div>
            )}
        </div>
      ) : (
        <p className="text-center mt-20 text-lg font-semibold">
          Please login to view your orders.
        </p>
      )}
    </div>
  );
};

export default BuyOrders;
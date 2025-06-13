"use client";

import { getSellerDashboardData } from "@/apicalls/sellerPanel/index";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import {
  FaBriefcase,
  FaShoppingCart,
  FaCalendarDay,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { GlobalContext } from "@/context";
import PageLevelLoader from "../Loader";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function SellerPanel() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const { setPageLevelLoader, pageLevelLoader } = useContext(GlobalContext);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);


  useEffect(() => {
    const fetchDashboardData = async (year) => {
      if (session?.user?.userId) {
        const sellerDashboardData = await getSellerDashboardData(
          session?.user?.userId,
          year // Pass selected year to the API
        );
        setUserInfo(session?.user);
        if (sellerDashboardData.success) {
          setDashboardData(sellerDashboardData.dashboardData);
        }
      }
    };
    fetchDashboardData(selectedYear); // Fetch data for the selected year
  }, [session?.user?.userId, selectedYear]);

   const handleDashboardClick = (link)=>{
     setPageLevelLoader(true);

     router.push(`${link}`);
   }

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value)); // Update the selected year
  };

  const generateYearOptions = () => {
    const startYear = new Date(userInfo?.createdAt || new Date()).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  const generateMonthlyEarnings = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const earnings = dashboardData?.monthlyEarnings || Array(12).fill(0);

    return {
      labels: months,
      datasets: [
        {
          label: `Monthly Earnings (USD) - ${selectedYear}`,
          data: earnings,
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76, 175, 80, 0.3)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `Earnings: $${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };
  return (
    <>
      {pageLevelLoader && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <PageLevelLoader />
        </div>
      )}
      {session && (
        <div className="flex flex-col gap-12 px-4 md:px-10 my-10">
          {/* Layout Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Widgets & Profile Section */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Widgets */}
              <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {[
                  {
                    title: "Total Services",
                    value: dashboardData?.servicesCount || 0,
                    icon: <FaBriefcase className="text-3xl text-blue-500" />,
                    link: `/services/${session?.user?.name}`,
                  },
                  {
                    title: "Total Orders",
                    value: dashboardData?.ordersCount || 0,
                    icon: <FaShoppingCart className="text-3xl text-green-500" />,
                    link: "/seller/orders",
                  },
                  {
                    title: "Daily Revenue",
                    value: `$${dashboardData?.dailyRevenue || 0}`,
                    icon: <FaCalendarDay className="text-3xl text-yellow-500" />,
                    link: "#",
                  },
                  {
                    title: "This Month Revenue",
                    value: `$${dashboardData?.monthlyRevenue || 0}`,
                    icon: <FaCalendarAlt className="text-3xl text-purple-500" />,
                    link: "#",
                  },
                  {
                    title: "Yearly Revenue",
                    value: `$${dashboardData?.yearlyRevenue || 0}`,
                    icon: <FaDollarSign className="text-3xl text-teal-500" />,
                    link: "#",
                  },
                ].map(({ title, value, icon, link }, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
                    onClick={() => handleDashboardClick(link)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-200 p-3 rounded-full">{icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                        <p className="text-2xl font-bold text-indigo-600">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Earnings Overview Section */}
            <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Earnings Overview</h3>
              {/* Year Selection */}
              <div className="mb-4">
                <label htmlFor="year-select" className="block text-gray-600 mb-2 font-medium">
                  Select Year:
                </label>
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                >
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {/* Line Chart */}
              <div className="w-full h-96">
                <Line data={generateMonthlyEarnings()} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
  
}

export default SellerPanel;

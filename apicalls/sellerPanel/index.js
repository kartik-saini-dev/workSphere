

// // you can mangage requests here like this with axios and in server side fetch and process.env only works in server side or ssr

import axios from 'axios';

export const getSellerDashboardData = async (userId,year) => {
  try {
    const response = await axios.get(`/api/sellerDashboard`, {
      params: { userId ,year},
      headers: {
        "Cache-Control": "no-store", // Similar to no-store caching
      },
    });

    return response.data;
  } catch (error) {
    // console.error(error, "this is DashboardError");
   
  }
};

"use client";

import { usePathname } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
export const GlobalContext = createContext(null);


export default function GlobalState({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [unseenMessages, setUnseenMessages] = useState(0);
  const pathname = usePathname();
  const [pageLevelLoader, setPageLevelLoader] = useState(false);
  const [unseenCount, setUnseenCount] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [serviceData, setserviceData] = useState({
    title: "",
    time: "",
    category: "",
    keywords:[],
    shortDescription: "",
    description: "",
    images: [],
    videoURL: "",
    pricing: {
      basic: { price: "", revisions: "", features: [""] },
      standard: { price: "", revisions: "", features: [""] },
      premium: { price: "", revisions: "", features: [""] },
    },
    requirement: [],
  });

  const reduceUnseenMessages = (count) => {
    setUnseenMessages((prev) => Math.max(0, prev - count));
  };

  const updateImages = (newImages) => {
    setserviceData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };


  const updateImageURL = (url) => {
    setserviceData((prev) => ({
      ...prev,
      images: prev.images.filter((image) => image !== url),
    }));
  };

  const updateVideoURL = (url) => {
    setserviceData((prev) => ({ ...prev, videoURL: url }));
  };
  const updatePricing = (packageType, key, value) => {
    setserviceData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [packageType]: {
          ...prev.pricing[packageType],
          [key]: value,
        },
      },
    }));
  };

  const updateUserStatus = async (status) => {
    if (session?.user?.userId) {
     
      try {
        await axios.put(`/api/register/update?userId=${session.user.userId}&status=${status}`);
      
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  useEffect(() => {

    if (session?.user?.userId) {
      // Set user status to "online" on component mount
      updateUserStatus("true");

      // Set user status to "offline" when the tab/browser is closed
      const handleUnload = () => {
        updateUserStatus("false");
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    }
  }, [session]);
  
  useEffect(() => {

    const isUserSeller = JSON.parse(sessionStorage.getItem("isSeller")) || false;
    setIsSeller(isUserSeller);

  }, [setIsSeller]);

  useEffect(() => {

    if (pathname === '/') {
      sessionStorage.setItem("isSeller", 'false');
    }

  }, [pathname]);


  // Redirect to unauthorized page if status is 'unauthenticated' and accessing protected routes
  useEffect(() => {
    // Do not perform any logic while session is loading
    if (status === "loading") {
      return;  // Wait for session to settle
    }

    // Perform redirection if user is not authenticated and tries to access restricted routes
    if (status === "unauthenticated" && ['/seller', '/seller/orders', '/buyer/orders'].some(route => pathname.startsWith(route))) {
      router.push("/unauthorized");  // Redirect to unauthorized page
    }
  }, [status, pathname, router]); 
  return (
    <GlobalContext.Provider
      value={{
        isSeller,
        setIsSeller,
        pageLevelLoader,
        setPageLevelLoader,
        componentLevelLoader,
        setComponentLevelLoader,
        unseenCount,
        setUnseenCount,
        serviceData,
        setserviceData,
        updateImages,
        updateVideoURL,
        updatePricing,
        unseenMessages,
        setUnseenMessages,
        reduceUnseenMessages,
        updateImageURL
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
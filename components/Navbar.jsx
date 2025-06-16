
"use client";
import React, { useContext, useEffect, useState } from "react";
import WorkSPhereLogo from "./workSphere";
import Link from "next/link";
import { IoSearchOutline, IoMailOutline } from "react-icons/io5"; // Add message icon
import MessageContext from "./communication/messageContext";
import { usePathname, useRouter } from "next/navigation";
import Join from "../components/join";
import { useSession } from "next-auth/react";
import { GlobalContext } from "../context/index";
import ContextMenu from "./ContextMenu";
import Image from "next/image";
import { socket } from "@/socket";
import ComponentLevelLoader from "./Loader/componentLevelLoader";
import PageLevelLoader from "./Loader";
import axios from "axios";
import { categoriesNav } from "@/utilis/categories";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const pathName = usePathname(); // Get current route
  const router = useRouter();
  const [unseenCounts, setUnseenCounts] = useState({});
  // State management
  const [navFixed, setNavFixed] = useState(false); // Determines if navbar is fixed
  const [searchData, setSearchData] = useState(""); // Stores search input value
  const [isJoinVisible, setIsJoinVisible] = useState(false); // Toggles Join modal
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false); // Toggles context menu
 
  // Context values
  const { isSeller, setIsSeller, unseenMessages, setUnseenMessages, pageLevelLoader, setPageLevelLoader, currentUpdatedservice, setCurrentUpdatedservice } = useContext(GlobalContext);
  const { data: session, status } = useSession();
  const userID = session?.user?.userId;
  const [isMessageContextVisible, setIsMessageContextVisible] = useState(false); // Toggle message context
  const [menuOpen, setMenuOpen] = useState(false);


  const fetchUnseenMessageCount = async () => {
    try {

      const { data } = await axios.get(`/api/unseenCount?userId=${userID}`);
    
      if (data.success) {
        setUnseenMessages(data.unseenMessageCount); // Update state with the count
      } else {
        console.error("Failed to fetch unseen message count:", data.message);
      }
    } catch (error) {
      console.error("Error fetching unseen message count:", error);
    }
  };

  useEffect(() => {

    if (userID) {
      fetchUnseenMessageCount();
    }
  }, [userID]);


  useEffect(() => {

    if (userID) {
      socket.emit("setup", { userId: userID });
      socket.on("unseenReceived", ({ count, to, from, }) => {
        if (to === userID) {
          setUnseenCounts((prevCounts) => ({
            ...prevCounts,
            [from]: count,
          }));

          const updatedTotalUnseen = Object.values({
            ...unseenCounts,
            [from]: count,
          }).reduce((acc, val) => acc + val, 0);

          setUnseenMessages(updatedTotalUnseen); // Update global unseen messages count
        }
      });
      // Cleanup listener on unmount
      return () => {
        socket.off("unseenReceived");
      };

    }

  }, [userID,pathName])



  // Close message context on outside click
  useEffect(() => {
    const closeMessageContext = () => setIsMessageContextVisible(false);
    if (isMessageContextVisible) window.addEventListener("click", closeMessageContext);
    return () => window.removeEventListener("click", closeMessageContext);
  }, [isMessageContextVisible]);

  // Close context menu on outside click
  useEffect(() => {
    const closeMenu = () => setIsContextMenuVisible(false);
    if (isContextMenuVisible) window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [isContextMenuVisible]);

  // Update navbar position on scroll
  useEffect(() => {
    const handleScroll = () => setNavFixed(window.scrollY > 0);
    if (!isJoinVisible) window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isJoinVisible]);

  // Reset `currentUpdatedservice` when leaving service creation page
  useEffect(() => {
    if (pathName !== "/services/create" && currentUpdatedservice) setCurrentUpdatedservice(null);
  }, [pathName, currentUpdatedservice]);

  // Hide Join modal when not on the homepage
  useEffect(() => {
    if (pathName !== "/") setIsJoinVisible(false);
  }, [pathName]);

  // Handle loading state
  if (status === "loading")
    return <ComponentLevelLoader text="Authenticating..." color="text-red-500" size="w-12 h-12" />;


  // Define navigation links
  const links = [
    { linkName: "Work Sphere", handler: "#" },
    { linkName: "Explore", handler: "#" },
    { linkName: "Find Work", handler: "#" },
    { linkName: "Become a Seller", handler: "#" },
  ];

  // Navigate to orders based on user role
  const handleOrdersNavigate = () => {
    // Determine the target route based on whether the user is a seller or a buyer
    const targetRoute = isSeller ? "/seller/orders" : "/buyer/orders";
    
    // Check if the current path is not the target route
    if (pathName !== targetRoute) {
      console.log("true");
      setPageLevelLoader(true);
    }
  
    // Navigate to the target route
    router.push(targetRoute);
  };

  // Switch between seller and buyer mode
  const handleModeSwitch = () => {
    setPageLevelLoader(true);
    const newMode = !isSeller;
    router.push(newMode ? "/seller" : "/");
    sessionStorage.setItem("isSeller", String(newMode));
    setIsSeller(newMode);
  };

  const handleClick = () => {
    setPageLevelLoader(true); // Show loader on click
    router.push("/services/create");
  };

  const handleDropClick = (category, sub) => {
    setPageLevelLoader(true); // Show loader on click
  
    const categorySlug = category.name
      .toLowerCase()
      .replace(/ & /g, "-")
      .replace(/ /g, "-");
  
    if (sub) {
      // If a subcategory is provided
      const subcategorySlug = sub.toLowerCase().replace(/ /g, "-");
      router.push(`/search/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`);
    } else {
      // If only a category is provided
      router.push(`/search/${encodeURIComponent(categorySlug)}`);
    }
  };
  
  

  // Context menu options
  const ContextMenuData = [
    { name: "Edit Profile", callback: () => router.push("/profile") },
    { name: "Logout", callback: () => { } }, // Implement logout logic
  ];

  return (
    <>
      {pageLevelLoader && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <PageLevelLoader />
        </div>
      )}
      <nav>
        {/* Top Navbar */}
        <div
          className={`w-full px-6 md:px-12 lg:px-24 py-4 md:py-6 flex justify-between items-center z-30 transition-all duration-300 ${pathName !== "/" || session
            ? "relative bg-white border-b border-gray-200"
            : navFixed
              ? "fixed bg-white border-b border-gray-200"
              : "absolute bg-transparent"
            }`}
        >
          {/* Logo */}
          <Link href="/">
            <WorkSPhereLogo fillColor={!navFixed && pathName == "/" && !session ? "#ffffff" : "#404145"} />
          </Link>

          {/* Search Bar */}
          <div className={`flex ${(navFixed || pathName !== "/" || session) ? "opacity-100" : "opacity-0"} hidden md:flex`}>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="w-full md:w-[10rem] lg:w-[20rem] xl:w-[30rem] py-2.5 px-4 border"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
            <button
              className="bg-blue-500 py-1.5 text-white w-12 md:w-16 flex justify-center items-center"
              onClick={() => {
                setSearchData("");
                router.push(`/search/${searchData}`);
              }}
            >
              <IoSearchOutline className="h-6 w-6" />
            </button>
          </div>

          {/* Authentication and Navigation Links */}
          {status === "unauthenticated" ? (
            <ul className="flex gap-4 md:gap-8 lg:gap-10 items-center">
              {links.map(({ linkName, handler }) => (
                <li
                  key={linkName}
                  className={`font-medium ${navFixed || pathName !== "/" ? "text-black" : "text-white"}`}
                >
                  <Link href={handler}>{linkName}</Link>
                </li>
              ))}
              <li
                className={`cursor-pointer py-1.5 px-2 md:px-2.5 ${navFixed || pathName !== "/" ? "border-blue-500 text-[blue] " : " border-white text-white"} hover:bg-blue-500 hover:text-white transition border border-solid font-medium`}
                onClick={() => router.push("/signIn")}
              >
                signIn
              </li>
              <li
                className={`cursor-pointer py-1.5 px-2 md:px-2.5 ${navFixed || pathName !== "/" ? "border-blue-500 text-[blue] " : " border-white text-white"} hover:bg-blue-500 hover:text-white transition border border-solid font-medium`}
                onClick={() => setIsJoinVisible(!isJoinVisible)}
              >
                Join
              </li>
            </ul>
          ) : (
            <ul className="flex gap-4 md:gap-8 lg:gap-10 items-center">
              <li
                className="cursor-pointer relative"
                title="Messages"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMessageContextVisible(!isMessageContextVisible);
                }}
              >
                <IoMailOutline className="h-6 w-6 text-gray-700 hover:text-black transition" />
                {unseenMessages > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold">
                    {unseenMessages}
                  </span>
                )}
                {isMessageContextVisible && <MessageContext onClose={() => setIsMessageContextVisible(false)} />}
              </li>
              {isSeller && (
                <li className="cursor-pointer text-[#1DBF73] font-medium" onClick={handleClick}>
                  Create Post
                </li>
              )}
              <li className="cursor-pointer text-[#1DBF73] font-medium" onClick={handleOrdersNavigate}>
                Orders
              </li>
              <li className="cursor-pointer font-medium" onClick={handleModeSwitch}>
                Switch to {isSeller ? "Buyer" : "Seller"}
              </li>
              <li
                className="cursor-pointer relative"
                onClick={(e) => {
                  e.stopPropagation();
                 setIsContextMenuVisible(!isContextMenuVisible);
                }}
                title="Profile"
              >
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full">
                    <span className="text-xl text-white">{session?.user?.email[0]?.toUpperCase()}</span>
                  </div>
                )}
              </li>
            </ul>
          )}
          {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
          {isJoinVisible && <Join onClose={() => setIsJoinVisible(false)} />}
        </div>

        {/* Sub Navigation */}
        {(navFixed || pathName !== "/" || session) && (
        <div className="w-full overflow-x-auto bg-white z-20 shadow-md">
          {/* Horizontal Menu for Larger Screens */}
          <div className="hidden md:block">
            <hr className="my-3 bg-gray-300" />
            <div className="relative w-full md:w-3/4 m-auto flex gap-2 md:gap-4 px-4 md:px-0">
              {categoriesNav.map((category) => (
                <div key={category.name} className="relative group">
                  <button
                    onClick={() => handleDropClick(category)}
                    className="text-black hover:underline whitespace-nowrap"
                  >
                    {category.name}
                  </button>
                  {/* Dropdown */}
                  <div
                    className="absolute left-0 top-full mt-2 bg-white border shadow-lg w-48 opacity-0 scale-y-0 transform transition-all duration-200 ease-in-out group-hover:opacity-100 group-hover:scale-y-100"
                    style={{ transformOrigin: "top", zIndex: 30 }}
                  >
                    {category.subcategories.map((sub) => (
                      <button
                      key={sub}
                      onClick={() => handleDropClick(category, sub)}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      {sub}
                    </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-2 bg-gray-300" />
          </div>

          {/* Hamburger Menu for Smaller Screens */}
          <div className="block md:hidden px-4 py-3 flex justify-between items-center">
            <span className="text-lg font-bold">Menu</span>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-gray-700 focus:outline-none"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Dropdown Menu for Hamburger */}
          {menuOpen && (
            <div className="bg-white border-t shadow-lg">
              {categoriesNav.map((category) => (
                <div key={category.name} className="border-b">
                  <button
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 focus:outline-none flex justify-between items-center"
                    onClick={() =>
                      setMenuOpen((prev) => ({
                        ...prev,
                        [category.name]: !prev[category.name],
                      }))
                    }
                  >
                    {category.name}
                  </button>
                  {/* Subcategories */}
                  {menuOpen[category.name] && (
                    <div className="pl-6">
                      {category.subcategories.map((sub) => (
                        <button
                        key={sub}
                        onClick={() => handleDropClick(category, sub)}
                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        {sub}
                      </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </nav>
    </>
  );
}


export default Navbar;

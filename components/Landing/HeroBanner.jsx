"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { GlobalContext } from "@/context";
import PageLevelLoader from "../Loader";

function HomeBanner() {
  const router = useRouter();
  const [image, setImage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const { setPageLevelLoader, pageLevelLoader } = useContext(GlobalContext);

  useEffect(() => {
    setPageLevelLoader(false);
  }, [setPageLevelLoader]);

  useEffect(() => {
    const interval = setInterval(
      () => setImage(image >= 6 ? 1 : image + 1),
      10000
    );
    return () => clearInterval(interval);
  }, [image]);

  const handleClick = () => {
    setPageLevelLoader(true);
    router.push(`/search/${searchData}`);
  };

  return (
    <>
      {pageLevelLoader && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center z-50">
          <PageLevelLoader />
        </div>
      )}

      <div className="h-screen relative bg-cover font-roboto">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          .font-roboto {
            font-family: 'Roboto', sans-serif;
          }
        `}</style>

        {/* Background Images */}
        <div className="absolute top-0 right-0 w-full h-full transition-opacity z-0">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Image
              key={num}
              alt={`hero-${num}`}
              src={`/bg-${num}.jpg`}
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-1000 ${
                image === num ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="z-10 relative w-full max-w-3xl flex flex-col justify-center items-center h-full gap-6 px-6 text-center bg-white bg-opacity-10 rounded-lg shadow-lg py-8 mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
            Connect with top talent <br /> for your projects
          </h1>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0">
            <div className="relative flex-1">
              <IoSearchOutline className="absolute text-gray-600 text-xl left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                className="h-12 w-full pl-10 pr-4 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for services (e.g., web development)"
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-r-md font-medium hover:bg-blue-700 transition-all"
              onClick={handleClick}
            >
              Find Talent
            </button>
          </div>

          {/* Popular Links */}
          <div className="text-white flex flex-wrap gap-3 items-center justify-center">
            <span className="text-sm font-medium">Explore:</span>
            <ul className="flex flex-wrap gap-2">
              {["Web Development", "Graphic Design", "Content Writing", "Tech Solutions"].map(
                (popularItem) => (
                  <li
                    key={popularItem}
                    className="text-sm py-1.5 px-4 bg-blue-500 bg-opacity-20 rounded-md hover:bg-blue-700 hover:text-white transition-all cursor-pointer"
                    onClick={() => router.push(`/search?q=${popularItem.toLowerCase().replace(/\s+/g, "+")}`)}
                  >
                    {popularItem}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeBanner;
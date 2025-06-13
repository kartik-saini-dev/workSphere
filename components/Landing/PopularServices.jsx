"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

function PopularServices() {
  const router = useRouter();

  // Updated service names and labels to avoid workSphere-specific terms
  const popularServicesData = [
    { name: "AI Artists", label: "Add talent to AI", image: "/service1.jpg" },
    { name: "Logo Design", label: "Build your brand", image: "/service2.jpg" },
    { name: "Wordpress", label: "Customize your site", image: "/service3.jpg" },
    { name: "Voice Over", label: "Share your message", image: "/service4.jpg" },
    { name: "Social Media", label: "Reach more customers", image: "/service5.jpg" },
    { name: "SEO", label: "Unlock growth online", image: "/service6.jpg" },
    { name: "Illustration", label: "Color your dreams", image: "/service7.jpg" },
    { name: "Translation", label: "Go global", image: "/service8.jpg" },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const totalSlides = Math.ceil(popularServicesData.length / itemsPerView);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] my-16 bg-white p-8 rounded-lg border border-gray-200 font-roboto">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        .font-roboto {
          font-family: 'Roboto', sans-serif;
        }
      `}</style>

      {/* Title */}
      <h2 className="text-3xl mb-8 text-black font-semibold text-center">
        Explore Top Services
      </h2>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Slides Wrapper */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${totalSlides * 100}%`,
          }}
        >
          {/* Generate Slide Groups */}
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex gap-6"
              style={{
                flex: "0 0 100%",
              }}
            >
              {/* Generate Service Items for Each Slide Group */}
              {popularServicesData
                .slice(
                  slideIndex * itemsPerView,
                  slideIndex * itemsPerView + itemsPerView
                )
                .map(({ name, label, image }) => (
                  <div
                    key={name}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 w-72"
                    onClick={() => router.push(`/search/${name.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                    {/* Overlay with Service Info */}
                    <div className="absolute z-10 text-white left-4 top-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                      <span className="block text-base font-medium">{label}</span>
                      <h6 className="font-bold text-xl">{name}</h6>
                    </div>
                    {/* Service Image */}
                    <div className="h-80 w-72 relative">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-blue-600 p-3 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white transition"
          onClick={prevSlide}
          disabled={currentIndex === 0}
        >
          ‹
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-blue-600 p-3 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white transition"
          onClick={nextSlide}
          disabled={currentIndex === totalSlides - 1}
        >
          ›
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 mx-1 rounded-full ${
              currentIndex === index ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default PopularServices;
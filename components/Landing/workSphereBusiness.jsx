"use client";
import Image from "next/image";
import { BsCheckCircle,BsLightbulb } from "react-icons/bs";
import workSphereLogo from "../workSphere";

function workSphereBusiness() {
  return (
    <div className="bg-[black] px-6 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row gap-10">
      <div className="text-white flex flex-col gap-6 justify-center items-start lg:w-1/2">
        <div className="flex gap-2">
          <workSphereLogo fillColor={"#ffffff"} />
        
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">
        Fueling Your Vision with Expert Talent
        </h2>
        <h4 className="text-lg sm:text-xl">
        Unlock a world of skilled professionals ready to bring your boldest ideas to life.
        </h4>
        <ul className="flex flex-col gap-4">
        <li className="flex gap-2 items-center">
            <BsLightbulb className="text-yellow-400 text-xl sm:text-2xl" />
            <span>Creative Brainpower On Demand</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsLightbulb className="text-yellow-400 text-xl sm:text-2xl" />
            <span>Dedicated Support for Seamless Projects</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsLightbulb className="text-yellow-400 text-xl sm:text-2xl" />
            <span>Collaborate Effortlessly with Dynamic Teams</span>
          </li>
          <li className="flex gap-2 items-center">
            <BsLightbulb className="text-yellow-400 text-xl sm:text-2xl" />
            <span>Flexible Solutions Tailored to Your Needs</span>
          </li>
        </ul>
        <button
          className="border text-sm sm:text-base font-medium px-4 sm:px-5 py-2 border-[blue] bg-blue-600 text-white rounded-md"
          type="button"
        >
          Explore Work Sphere
        </button>
      </div>
      <div className="relative h-[256px] sm:h-[384px]  lg:h-[512px] w-full rounded-full overflow-hidden lg:w-2/3">
        <Image src="/idea.jpg" alt="business" fill className="object-cover" />
      </div>
    </div>
  );
}

export default workSphereBusiness;

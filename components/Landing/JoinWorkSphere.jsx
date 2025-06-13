

import Image from "next/image";

function JoinworkSphere() {
  return (
    <div className="mx-4 sm:mx-6 lg:mx-32 my-10 sm:my-16 relative">
      <div className="absolute z-10 top-1/4 sm:top-1/3 left-4 sm:left-10">
        <h4 className="text-white text-3xl playfair_display sm:text-4xl lg:text-5xl mb-6 sm:mb-10">
        <span>It simply becomes <i>effortless.</i></span>
        </h4>
        <button
          className="border text-sm sm:text-base font-medium px-4 sm:px-5 py-2 border-[blue] bg-blue-500 text-white rounded-md"
          type="button"
        >
          Join Us
        </button>
      </div>
      <div className="w-full h-64 sm:h-80 lg:h-96">
        <Image
          src="/design.jpg"
          fill
          alt="signup"
          className="rounded-sm object-cover"
        />
      </div>
    </div>
  );
}

export default JoinworkSphere;

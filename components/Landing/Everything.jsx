

import Image from "next/image";

import { BsCheckCircle } from "react-icons/bs";

function Everything() {
  const everythingData = [
    {
      title: "Affordable Services",
      subtitle:
      "Discover the perfect talent for your budget. Transparent, project-based pricing – no hidden fees.",
  },
  {
    title: "Fast, High-Quality Results",
    subtitle:
      "Delegate your tasks to skilled professionals and achieve exceptional outcomes in record time.",
  },
  {
    title: "Secure Payments, Guaranteed Satisfaction",
    subtitle:
      "Approve the work before payment is released. Your peace of mind is our priority.",
  },
  {
    title: "Around-the-Clock Assistance",
    subtitle:
      "Our dedicated support team is here for you 24/7, ensuring a smooth experience wherever you are.",
  },
];

  return (
    <div className="bg-blue-100 flex flex-col lg:flex-row py-20 justify-between px-6 lg:px-24">
      <div className="lg:w-2/4">
        <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        What Sets Us Apart?
        </h2>
        <ul className="flex flex-col gap-10">
          {everythingData.map(({ title, subtitle }) => {
            return (
              <li key={title}>
                <div className="flex gap-2 items-center text-xl">
                  <BsCheckCircle className="text-[#62646a]" />
                  <h4>{title}</h4>
                </div>
                <p className="text-[#62646a]">{subtitle}</p>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="relative lg:h-96 w-full lg:w-2/4 mt-10 lg:mt-0">
        <Image src="/office.jpg" fill alt="everything" />
      </div>
    </div>
  );
}

export default Everything;

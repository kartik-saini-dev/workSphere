"use client";
import { useRouter } from "next/navigation";
import React from "react";
import axios from "axios";
import { useSession,signOut } from "next-auth/react";
function ContextMenu({ data }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.userId;

  const handleLogout = async () => {
    // Simulate logout API call or local logout logic
    const response = await axios.put(`/api/register/update?userId=${userId}&status=${false}`); // Replace with relevant userId logic if necessary
    if(response.data.success){
      signOut();
    }
    router.push("/"); // Redirect to homepage after logout
  };

  return (
    <div
      className={`z-10 bg-white divide-y divide-gray-100 shadow-2xl border w-44 dark:bg-gray-700 fixed right-20 top-20`}
    >
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
        {data.map(({ name, callback }, index) => (
          <li
            key={index}
            onClick={name === "Logout" ? handleLogout : callback}
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

import Link from "next/link";
import React from "react";
import {
  FiGithub,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import SiteLogo from "./workSphere"; // Changed workSphereLogo to SiteLogo (more general)
import { categories } from "../utilis/categories";

function Footer() {
  const socialLinks = [
    { name: "Github", icon: <FiGithub />, link: "https://github.com/" },
    { name: "Youtube", icon: <FiYoutube />, link: "https://youtube.com/" },
    { name: "LinkedIn", icon: <FiLinkedin />, link: "https://linkedin.com/" },
    { name: "Instagram", icon: <FiInstagram />, link: "https://instagram.com/" },
    { name: "Twitter", icon: <FiTwitter />, link: "https://twitter.com/" },
  ];

  const data = [
    {
      headerName: "Explore",
      links: [
        ...categories.map(({ name }) => ({
          name,
          link: `/search/${name}`,
        })),
      ],
    },
    {
      headerName: "Company",
      links: [
        { name: "About Us", link: "#" },
        { name: "Careers", link: "#" },
        { name: "Press", link: "#" },
        { name: "Blog", link: "#" },
        { name: "Contact", link: "#" },
        { name: "Legal", link: "#" },
      ],
    },
    {
      headerName: "Support",
      links: [
        { name: "Help Center", link: "#" },
        { name: "Safety Guidelines", link: "#" },
        { name: "Report a Problem", link: "#" },
        { name: "Community Support", link: "#" },
      ],
    },
    {
      headerName: "Resources",
      links: [
        { name: "Developer Tools", link: "#" },
        { name: "API Access", link: "#" },
        { name: "Documentation", link: "#" },
        { name: "Open Source", link: "#" },
        { name: "Tutorials", link: "#" },
      ],
    },
    {
      headerName: "Opportunities",
      links: [
        { name: "Partner with Us", link: "#" },
        { name: "Become an Affiliate", link: "#" },
        { name: "Freelance Opportunities", link: "#" },
        { name: "Brand Collaborations", link: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full mx-auto px-6 sm:px-12 lg:px-32 py-8 sm:py-12 lg:py-16 h-max border-t border-gray-200 bg-gray-100">
      <ul className="flex flex-col sm:flex-row flex-wrap justify-between gap-8">
        {data.map(({ headerName, links }) => {
          return (
            <li key={headerName} className="flex flex-col gap-2 min-w-[150px]">
              <span className="font-bold">{headerName}</span>
              <ul className="flex flex-col gap-2">
                {links.map(({ name, link }) => (
                  <li key={name} className="text-[#404145]">
                    <Link href={link}>{name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-8">
        <SiteLogo fillColor={"#404145"} />
        <ul className="flex gap-5">
          {socialLinks.map(({ icon, link, name }) => (
            <li
              key={name}
              className="text-xl text-[#404145] hover:text-[#1DBF73] transition-all"
            >
              <Link href={link}>{icon}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

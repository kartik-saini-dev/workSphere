/** @type {import('next').NextConfig} */
const nextConfig = { 
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
      },
      {
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

// next.config.js
module.exports = nextConfig;


  //This to use next/image url from cloudinary and google to show image and pwa 
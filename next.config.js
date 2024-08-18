/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:1641008969,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"f72b270b8d0d3b9d502efed996d05e30"
  },
  images:{
    domains:["localhost"],
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // the Galaxy Quiz became the Universe Quiz (Update 5.4)
      { source: "/galaxy/quiz", destination: "/quiz", permanent: true },
    ];
  },
};

module.exports = nextConfig;

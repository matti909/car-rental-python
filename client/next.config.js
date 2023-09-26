/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/(.*)', // Ruta de tu API
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json', // Establece el tipo de contenido como JSON
          },
        ],
      },
    ];
  },
}

module.exports = {
  nextConfig, images: {
    domains: ['res.cloudinary.com'],
  },
};

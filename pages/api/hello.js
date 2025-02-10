import Cors from 'cors';

// Inisialisasi middleware CORS
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD'],
  origin: '*', // Izinkan domain tertentu
});

// Helper untuk menjalankan middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Jalankan middleware CORS
  await runMiddleware(req, res, cors);

  // Lanjutkan dengan logika API
  res.status(200).json({ message: 'Hello, world!' });
}
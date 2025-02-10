import axios from 'axios';
import Cors from 'cors';

// Inisialisasi middleware CORS
const cors = Cors({
  methods: ['POST'], // Izinkan method POST
  origin: '*', // Izinkan semua domain (atau ganti dengan domain tertentu)
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

const API_KEY = 'AIzaSyBrkBAHbsgTN0S5aDtY2p2JmpCv6X_Yeeg';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export default async function handler(req, res) {
  // Jalankan middleware CORS
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { question } = req.body;

    try {
      const prompt = "Generate a JSON output that includes the following keywords as keys, and provide a brief description or example value for each key:\n" +
        "Sentiment Analysis\n" +
        "Entity Extraction\n" +
        "Topic Detection\n" +
        "Keyphrase Extraction\n" +
        "Emotion Analysis\n" +
        "Bias Detection\n" +
        "Stance Detection\n" +
        "Relevance Score\n" +
        "Summary Generation\n" +
        "Aspect-Based Sentiment Analysis\n" +
        "Language Style Analysis\n" +
        "Category Classification\n" +
        "Reading Complexity\n" +
        "Ensure the JSON structure is well-formatted and each key has a corresponding value that represents its purpose or an example.";

      const response = await axios.post(URL, {
        contents: [
          {
            parts: [{ text: question + prompt }]
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      res.status(200).json({
        status: 'success',
        message: response.data,
      });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({
        status: 'fail',
        message: 'Terjadi kesalahan saat memproses permintaan.',
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
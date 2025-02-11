import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/quran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error('Terjadi kesalahan saat memproses permintaan.');
      }

      const data = await res.json();
      const rawText = data.message.candidates[0].content.parts[0].text;

      // Hapus ```json\n dan ``` di awal/akhir
      const cleanedText = rawText.replace(/```json\n|\n```/g, "");

      // Parse menjadi objek JSON
      const parsedData = JSON.parse(cleanedText);

      setResponse(parsedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Text Analysis</h1>
      <p className={styles.description}>Ajukan berita, isi document, isi pdf dan dapatkan analisis mendalam dari AI.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Masukan Anda"
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Memproses...' : 'Kirim'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {response && (
        <div className={styles.response}>
          <h2 className={styles.responseTitle}>Hasil Analisis:</h2>
          <div className={styles.card}>
          {Object.entries(response).map(([category, details]) => (
            <div key={category}>
              <h3>{category}</h3>
              <p><strong>Description:</strong> {details.description}</p>
              <p><strong>Example:</strong> {Array.isArray(details.example) ? details.example.join(", ") : details.example}</p>
              <br />
            </div>
          ))}

          </div>
        </div>
      )}
    </div>
  );
}

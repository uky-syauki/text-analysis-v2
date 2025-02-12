import { useState, useRef } from 'react';
import styles from '../styles/Home.module.css';
import Mammoth from "mammoth";

export default function Home() {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    if (question) return; // Hanya terima salah satu input
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const { value } = await Mammoth.extractRawText({ arrayBuffer });
      setText(value);
      console.log(`File text: ${value}`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(`Text question: ${ text || question} `);
    // console.log(`Extracted Text: ${text}`);

    try {
      const res = await fetch('/api/quran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text || question }),
      });

      if (!res.ok) {
        throw new Error('Terjadi kesalahan saat memproses permintaan.');
      }

      const data = await res.json();
      const rawText = data.message.candidates[0].content.parts[0].text;

      const cleanedText = rawText.replace(/```json\n|\n```/g, "");
      const parsedData = JSON.parse(cleanedText);

      setResponse(parsedData);
      setText("");
      setQuestion("");
      if (fileInputRef.current) fileInputRef.current.value = "";
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
          disabled={text ? true : false}
        />
        <input ref={fileInputRef} type='file' accept='.docx' onChange={handleFileUpload} className='mt-2' disabled={question ? true : false} />
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

import { useState } from "react";
import Mammoth from "mammoth";

export default function Home() {
  const [text, setText] = useState("");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const { value } = await Mammoth.extractRawText({ arrayBuffer });
      setText(value);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">Upload and Display DOCX Text</h1>
      <input type="file" accept=".docx" onChange={handleFileUpload} className="mt-2" />
      <div className="mt-4 p-4 border rounded bg-gray-100">
        <h2 className="text-lg font-semibold">Extracted Text:</h2>
        <p className="whitespace-pre-wrap mt-2">{text || "No text extracted yet."}</p>
      </div>
    </div>
  );
}

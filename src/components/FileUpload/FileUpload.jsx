import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/api/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('success');
      setFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('error');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit" disabled={!file}>
          Upload CSV
        </button>
      </form>
      {status === 'success' && (
        <p style={{ color: '#6fcf97', fontSize: '0.82rem', marginTop: '0.75rem' }}>
          ✓ File uploaded successfully. Map pins updated.
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: '#eb5757', fontSize: '0.82rem', marginTop: '0.75rem' }}>
          ✗ Upload failed. Check the file format and try again.
        </p>
      )}
    </div>
  );
}

export default FileUpload;

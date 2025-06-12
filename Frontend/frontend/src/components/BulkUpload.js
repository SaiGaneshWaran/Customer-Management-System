import React, { useState } from 'react';
import { uploadFile } from '../services/api';

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    setMessage('Upload has started. This may take a while as it is processed in the background. You can navigate away from this page.');
    setError('');

    try {
      await uploadFile(formData);
      setFile(null); 
      document.getElementById('file-input').value = '';
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(`Upload failed: ${errorMessage}`);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
        <div className="card-header">
            <h3>Bulk Customer Create & Update</h3>
        </div>
        <div className="card-body">
            <p>Upload an Excel file (.xlsx) with columns (in this order): <strong>NIC Number</strong>, <strong>Name</strong>, <strong>DateOfBirth</strong> (YYYY-MM-DD).</p>
            
            <div className="mb-3">
                <label htmlFor="file-input" className="form-label">Excel File</label>
                <input id="file-input" className="form-control" type="file" onChange={handleFileChange} accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            </div>

            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || isLoading}>
                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Uploading...
                    </>
                ) : 'Upload File'}
            </button>

            {message && <div className="alert alert-info mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    </div>
  );
};

export default BulkUpload;
import React, { useState } from 'react';
import { encryptData } from '../utils/crypto';

const EncryptionPanel = ({ onEncrypt, encryptedData, secretKey }) => {
    const [jsonInput, setJsonInput] = useState('{\n  "name": "John Doe",\n  "id": 12345,\n  "role": "admin"\n}');
    const [error, setError] = useState('');

    const handleEncrypt = () => {
        setError('');
        try {
            const parsedJson = JSON.parse(jsonInput);
            const encrypted = encryptData(parsedJson, secretKey);
            onEncrypt(encrypted);
        } catch (e) {
            setError('Invalid JSON format.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(encryptedData);
        alert('Encrypted string copied to clipboard!');
    };

    const handleExport = () => {
        const blob = new Blob([jsonInput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="panel">
            <h1>Input Data</h1>

            <div>
                <label>JSON Data</label>
                <textarea
                    rows={10}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Enter JSON here..."
                />
            </div>

            {error && <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleEncrypt} style={{ flex: 2 }}>
                    Encrypt & Generate QR
                </button>
                <button onClick={handleExport} style={{ flex: 1, background: '#64748b' }}>
                    Export JSON
                </button>
            </div>

            {encryptedData && (
                <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ margin: 0 }}>Encrypted String (AES)</label>
                        <button
                            onClick={handleCopy}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: '#475569' }}
                        >
                            Copy
                        </button>
                    </div>
                    <div className="code-block">
                        {encryptedData}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EncryptionPanel;

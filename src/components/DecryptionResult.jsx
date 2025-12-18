import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { decryptData } from '../utils/crypto';

const DecryptionResult = ({ secretKey, encryptedData }) => {
    const [decryptedJson, setDecryptedJson] = useState(null);
    const [pendingEncryptedData, setPendingEncryptedData] = useState(null);
    const [userKey, setUserKey] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const fileInputRef = useRef(null);

    // Reset state when the prop encryptedData changes (from the left panel)
    useEffect(() => {
        if (encryptedData) {
            setDecryptedJson(null);
            setPendingEncryptedData(null);
            setShowResult(false);
            setError('');
            setUserKey('');
        }
    }, [encryptedData]);

    const handleDecrypt = () => {
        // Use uploaded data if available, otherwise use the prop data
        const dataToDecrypt = pendingEncryptedData || encryptedData;

        if (!dataToDecrypt) {
            setError("No data to decrypt.");
            setShowResult(true);
            return;
        }

        if (!userKey) {
            setError("Please enter the secret key to decrypt.");
            setShowResult(true);
            return;
        }

        const result = decryptData(dataToDecrypt, userKey);
        if (result) {
            setDecryptedJson(result);
            setShowResult(true);
            setError('');
        } else {
            setError("Failed to decrypt. Incorrect secret key or invalid data.");
            setDecryptedJson(null);
            setShowResult(true);
        }
    };

    const toggleResult = () => {
        if (showResult) {
            setShowResult(false);
        } else {
            handleDecrypt();
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Clear previous state immediately
        setDecryptedJson(null);
        setPendingEncryptedData(null);
        setError('');
        setShowResult(false);
        setIsScanning(true);

        if (file.type.startsWith('image/')) {
            // Handle Image (QR Code)
            const html5QrCode = new Html5Qrcode("reader-hidden");
            try {
                const decodedText = await html5QrCode.scanFile(file, true);
                setPendingEncryptedData(decodedText);
            } catch (err) {
                console.error("QR Scan Error:", err);
                setError("Failed to scan QR code. Please ensure the image is clear and contains a valid QR code.");
                setShowResult(true);
            } finally {
                setIsScanning(false);
                try { await html5QrCode.clear(); } catch (e) { }
            }
        } else {
            // Handle Text/Data File
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setPendingEncryptedData(content.trim());
                setIsScanning(false);
            };
            reader.onerror = () => {
                setError("Failed to read the file.");
                setShowResult(true);
                setIsScanning(false);
            };
            reader.readAsText(file);
        }

        // Reset file input
        e.target.value = '';
    };

    const handleCopyJSON = () => {
        if (decryptedJson) {
            navigator.clipboard.writeText(JSON.stringify(decryptedJson, null, 2));
            alert('Decrypted JSON copied to clipboard!');
        }
    };

    return (
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Verify Secret Key</label>
                <input
                    type="password"
                    value={userKey}
                    onChange={(e) => setUserKey(e.target.value)}
                    placeholder="Enter secret key to decrypt"
                    style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '0.875rem'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={toggleResult}
                    disabled={isScanning}
                    style={{
                        flex: 1,
                        background: showResult ? '#64748b' : '#10b981',
                        opacity: isScanning ? 0.5 : 1
                    }}
                >
                    {showResult ? 'Hide Result' : 'View Decrypted Data'}
                </button>

                <button
                    onClick={() => fileInputRef.current.click()}
                    disabled={isScanning}
                    style={{
                        flex: 1,
                        background: '#3b82f6',
                        opacity: isScanning ? 0.5 : 1
                    }}
                >
                    {isScanning ? 'Scanning...' : 'Upload Data/Image'}
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.txt,.json"
                style={{ display: 'none' }}
            />

            <div id="reader-hidden" style={{ display: 'none' }}></div>

            {isScanning && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#3b82f6' }}>
                    Processing file...
                </div>
            )}

            {/* Show Encrypted Data if uploaded and not yet decrypted */}
            {pendingEncryptedData && !showResult && !isScanning && (
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Uploaded Encrypted Data:</label>
                    <div className="code-block" style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                        {pendingEncryptedData}
                    </div>
                </div>
            )}

            {showResult && !isScanning && (
                <div>
                    {error ? (
                        <div style={{ color: '#ef4444' }}>{error}</div>
                    ) : (
                        decryptedJson && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', color: '#10b981', margin: 0 }}>Decrypted JSON Data:</label>
                                    <button
                                        onClick={handleCopyJSON}
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', background: '#065f46' }}
                                    >
                                        Copy JSON
                                    </button>
                                </div>
                                <pre className="code-block" style={{ background: '#0f172a', border: '1px solid #10b981' }}>
                                    {JSON.stringify(decryptedJson, null, 2)}
                                </pre>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default DecryptionResult;

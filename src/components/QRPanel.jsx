import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import DecryptionResult from './DecryptionResult';

const QRPanel = ({ encryptedData, secretKey }) => {
    const qrRef = useRef(null);

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = url;
        link.click();
    };

    const handleCopy = async () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        try {
            canvas.toBlob(async (blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                alert('QR Code copied to clipboard!');
            });
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy QR Code.');
        }
    };

    return (
        <div className="panel">
            <h1>QR Code</h1>

            <div className="qr-container" ref={qrRef}>
                {encryptedData ? (
                    <QRCodeCanvas
                        value={encryptedData}
                        size={256}
                        level={"H"}
                        includeMargin={true}
                    />
                ) : (
                    <div style={{ color: '#64748b' }}>
                        Encrypt data to generate QR code
                    </div>
                )}
            </div>

            {encryptedData && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                        onClick={handleDownload}
                        style={{ flex: 1, background: '#8b5cf6' }}
                    >
                        Download QR
                    </button>
                    <button
                        onClick={handleCopy}
                        style={{ flex: 1, background: '#ec4899' }}
                    >
                        Copy QR
                    </button>
                </div>
            )}

            <div style={{ marginTop: 'auto' }}>
                <DecryptionResult
                    secretKey={secretKey}
                    encryptedData={encryptedData}
                />
            </div>
        </div>
    );
};

export default QRPanel;

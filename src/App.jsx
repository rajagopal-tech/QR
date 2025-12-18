import { useState } from 'react';
import EncryptionPanel from './components/EncryptionPanel';
import QRPanel from './components/QRPanel';
import DecryptionResult from './components/DecryptionResult';

function App() {
    const [encryptedData, setEncryptedData] = useState('');
    const FIXED_KEY = "raja";

    const handleEncrypt = (data) => {
        setEncryptedData(data);
    };

    return (
        <div className="app-container">
            <EncryptionPanel
                onEncrypt={handleEncrypt}
                encryptedData={encryptedData}
                secretKey={FIXED_KEY}
            />

            <QRPanel
                encryptedData={encryptedData}
                secretKey={FIXED_KEY}
            />
        </div>
    );
}

export default App;

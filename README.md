# Secure QR Code Generator & Decryptor

A modern, secure web application for encrypting JSON data into QR codes and decrypting them back. Built with React and Vite, featuring a sleek glassmorphism dark mode UI.

## Features

### 🔐 Secure Encryption
- Uses **AES-256** encryption via `crypto-js`.
- Fixed internal security key for consistent generation.
- **Verification Step**: Requires manual entry of the secret key to view decrypted data.

### 📱 QR Code Management
- **Dynamic Generation**: Real-time QR code generation as you encrypt data.
- **Download**: Export your QR code as a high-quality PNG image.
- **Copy to Clipboard**: Copy the QR image directly for quick sharing.

### 📂 Versatile Decryption
- **Image Upload**: Upload any QR code image to decode and decrypt.
- **Data Upload**: Supports `.txt` and `.json` files containing encrypted strings.
- **Manual Check**: Displays encrypted data first, requiring an explicit "View" action.

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Sleek, transparent panels with blur effects.
- **Dark Mode**: Optimized for low-light environments.
- **Responsive Layout**: Works seamlessly on desktop and mobile.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd qr-genreate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Building for Production
To create a production-ready bundle:
```bash
npm run build
```

## Tech Stack
- **Frontend**: React (JSX)
- **Build Tool**: Vite
- **Encryption**: Crypto-JS
- **QR Generation**: qrcode.react
- **QR Scanning**: html5-qrcode
- **Styling**: Vanilla CSS

## Usage Tips
- **Secret Key**: The default verification key is `my-fixed-secret-key`.
- **JSON Format**: Ensure your input is valid JSON before encrypting.
- **Clear Images**: For best results with image uploads, ensure the QR code is clear and well-lit.

## License
MIT

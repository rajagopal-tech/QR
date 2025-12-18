import CryptoJS from 'crypto-js';

export const encryptData = (data, secretKey) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
};

export const decryptData = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) return null;
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

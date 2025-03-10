import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_CRYPTO_KEY || 'default-secret-key'; 

export const encryptData = (data) => {
  if (!data) throw new Error('No data to encrypt');
  const encrypted = CryptoJS.AES.encrypt(data.toString(), SECRET_KEY).toString();
  const urlSafeEncrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return urlSafeEncrypted;
};

export const decryptData = (encryptedData) => {
  if (!encryptedData) throw new Error('No data to decrypt');
  const paddedEncrypted = encryptedData.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - encryptedData.length % 4) % 4);
  const decrypted = CryptoJS.AES.decrypt(paddedEncrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
  if (!decrypted) throw new Error('Decrypt error');
  return decrypted;
};
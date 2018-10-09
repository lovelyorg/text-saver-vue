import CryptoJS from "crypto-js";

const iv = CryptoJS.enc.Utf8.parse("ABCDEF1234123412"); // 十六位十六进制数作为密钥偏移量

function encrypt(word, key) {
  key = CryptoJS.enc.Utf8.parse(
    Array.from(new TextEncoder().encode(key))
      .map(m => {
        return m.toString(16).padStart(2, "0");
      })
      .join("")
  );
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(CryptoJS.enc.Base64.stringify(encrypted.ciphertext))
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

function decrypt(word, key) {
  key = CryptoJS.enc.Utf8.parse(
    Array.from(new TextEncoder().encode(key))
      .map(m => {
        return m.toString(16).padStart(2, "0");
      })
      .join("")
  );
  let encryptedHexStr = CryptoJS.enc.Base64.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

export default {
  encrypt: encrypt,
  decrypt: decrypt
};

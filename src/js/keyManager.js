import aes from "../js/aes.js";

function getkey() {
  return sessionStorage.getItem("theUserTypedKey");
}

function setKey(value) {
  sessionStorage.setItem("theUserTypedKey", value);
}

function getServersideEncryptedKey() {
  return sessionStorage.getItem("serversideEncryptedKey");
}

function setServersideEncryptedKey(value) {
  sessionStorage.setItem("serversideEncryptedKey", value);
}

export default {
  getKey: getkey,
  setKey: setKey,
  getServersideEncryptedKey: getServersideEncryptedKey,
  setServersideEncryptedKey: setServersideEncryptedKey,
  checkKey: () => {
    const theUserTypedKey = getkey()
    const serversideEncryptedKey = getServersideEncryptedKey()
    return (theUserTypedKey && serversideEncryptedKey &&
      aes.encrypt(theUserTypedKey, theUserTypedKey) == serversideEncryptedKey
    )
  }
};

import aes from "../js/aes.js";

function getkey() {
  return sessionStorage.getItem("theUserTypedKey");
}

function setKey(value) {
  sessionStorage.setItem("theUserTypedKey", value);
}

function getData() {
  return sessionStorage.getItem("ciphertext");
}

function setData(value) {
  sessionStorage.setItem("ciphertext", value);
}

function getPlainttext() {
  return JSON.parse(sessionStorage.getItem("plainttext"));
}

function setPlainttext(value) {
  sessionStorage.setItem("plainttext", value);
}

export default {
  getKey: getkey,
  setKey: setKey,
  getData: getData,
  setData: setData,
  getPlainttext: getPlainttext,
  setPlainttext: setPlainttext,
  checkKey: () => {
    const key = getkey()
    const data = getData()
    try {
      let mingwen = aes.decrypt(data, key)
      return true
    } catch (error) {
      return false
    }
  }
};

export default {
  getKey: () => {
    return sessionStorage.getItem("theAesKey");
  },
  setKey: value => {
    sessionStorage.setItem("theAesKey", value);
  }
};

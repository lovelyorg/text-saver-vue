function getkey() {
  return sessionStorage.getItem('theUserTypedKey')
}

function setKey(value) {
  sessionStorage.setItem('theUserTypedKey', value)
}

function getPlainttext() {
  return JSON.parse(sessionStorage.getItem('plainttext'))
}

function setPlainttext(value) {
  sessionStorage.setItem('plainttext', value)
}

export default {
  getKey: getkey,
  setKey: setKey,
  getPlainttext: getPlainttext,
  setPlainttext: setPlainttext
}

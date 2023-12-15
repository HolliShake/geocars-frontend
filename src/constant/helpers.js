import { AES, enc } from "crypto-js"

const KEY = "g30c4r5"

const security = ({

  encrypt(string) {
    return AES.encrypt(string?.toString(), KEY)
  },

  decrypt(string) {
    try {
      return AES.decrypt(string?.toString(), KEY).toString(enc.Utf8)
    } catch (err) {
      return "null"
    }
  },

})

export default Object.freeze({
  security,
})


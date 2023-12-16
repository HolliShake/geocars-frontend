import { defineStore } from "pinia"


const useAuthStore = defineStore("AuthStore", {

  state: () => {

    let user = null, accessToken = null, userAbilities = []

    try {
      user = JSON.parse(localStorage.getItem("userData"))
      accessToken = localStorage.getItem("accessToken")
      userAbilities = JSON.parse(localStorage.getItem("userAbilities"))

    } catch (e) {}

    return ({
      user: user,
      accessToken: accessToken,
      userAbilities: userAbilities,
    })
  },

  getters: {
    getUserData() {
      return this.user
    },
    getAccessToken() {
      return this.accessToken
    },
    getRefreshToken() {
      return this.refreshToken
    },
    getUserAbilities() {
      return this.userAbilities
    },
    isLoggedIn() {
      return !!this.accessToken
    },
  },

  actions: {
    async initialize(data) {
      this.user = data
      this.accessToken = data.access_token
      this.userAbilities = data.user_access.map(a => ({ subject: a.role, action: a.action }))

      localStorage.setItem("userData", JSON.stringify(data))
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("userAbilities", JSON.stringify(this.userAbilities))
    },
  },

})

export default useAuthStore

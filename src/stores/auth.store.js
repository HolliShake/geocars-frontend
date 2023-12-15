import roles from "@/constant/roles"
import ability from "@/plugins/casl/ability"
import jwtDecode from "jwt-decode"
import { defineStore } from "pinia"


const useAuthStore = defineStore("AuthStore", {

  state: () => ({
    user: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : {},
    accessToken: null,
    refreshToken: null,
    userAbilities: null,
  }),

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
  },

  actions: {

    async initialize(data) {
      const token = jwtDecode(data.accessToken)
      const role = token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

      this.user = data
      this.accessToken = data.accessToken
      this.refreshToken = data.refreshToken
      this.userAbilities = roles[role]

      localStorage.setItem("userData", JSON.stringify(data))
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("userAbilities", JSON.stringify(roles[role]))
    },

    async updateAccess(access) {
      ability.update(access) 
      this.userAbilities = access
      
      return Promise.resolve(access)
    },
  },

})

export default useAuthStore

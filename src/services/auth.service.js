import axiosIns from "@/plugins/axios"



class AuthService {

  constructor() {
    this.endPoint = "/Core/Auth"
  }

  async login(email, password) {
    return await axiosIns.post(this.endPoint + "/Login", { email: email, password: password })
  }

  async register(payload) {
    return await axiosIns.post(this.endPoint + "/Register", payload)
  }

}


export default AuthService

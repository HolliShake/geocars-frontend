import axiosIns from "@/plugins/axios"



const AuthService = new (class {

  constructor() {
    this.endPoint = "/Core/Auth"
  }

  async refresh() {
    return await axiosIns.post('/Auth/refresh')
  }

  async login(email, password) {
    return await axiosIns.post('/Auth/login', { email: email, password: password })
  }

  async register(payload) {
    return await axiosIns.post('/Auth/register', payload)
  }

})


export default AuthService

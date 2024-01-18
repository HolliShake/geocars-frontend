import axiosIns from "@/plugins/axios"

const UserService = new (class {

  async getAllUsers() {
    return await axiosIns.get('/User/all')
  }

  async getPendingUsers() {
    return await axiosIns.get('/User/pending')
  }

  async approveUser(userId) {
    return await axiosIns.patch(`/User/approve/${userId}`)
  }

  async rejectUser(userId) {
    return await axiosIns.patch(`/User/reject/${userId}`)
  }

})


export default UserService

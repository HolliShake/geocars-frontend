import axiosIns from "@/plugins/axios"


class CompanyService {
  constructor() {
    this.endPoint = "/Company"
  }

  /*======================================= PLAN */
  async getCompaniesByUserPlanId(userPlanId) {
    return await axiosIns.get(this.endPoint + "/UserPlan" + `/${userPlanId}`)
  }

  async getMyCompanyById(id) {
    return await axiosIns.get(this.endPoint + `/${id}`)
  }

  async createCompany(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }

  async updateCompany(id, payload) {
    return await axiosIns.put(this.endPoint + "/Update" + `/${id}`, payload)
  }

  async deleteCompay(id) {
    return await axiosIns.delete(this.endPoint + "/Delete" + `/${id}`)
  }
}

export default CompanyService

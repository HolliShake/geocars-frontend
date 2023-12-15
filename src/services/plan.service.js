import axiosIns from "@/plugins/axios"



class PlanService {
  constructor() {
    this.endPoint = "/Core/Plan"
  }

  async getAllPlans() {
    return await axiosIns.get(this.endPoint + "/All")
  }

  async getPlanById(id) {
    return await axiosIns.get(this.endPoint + `/${id}`)
  }

  async createPlan(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }

  async updatePlan(id, payload) {
    return await axiosIns.put(this.endPoint + "/Update" + `/${id}`, payload)
  }

  async deletePlan(id) {
    return await axiosIns.delete(this.endPoint + "/Delete" + `/${id}`)
  }
  
}

export default PlanService

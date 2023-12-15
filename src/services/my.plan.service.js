import axiosIns from "@/plugins/axios"




class MyPlanService {
  constructor() {
    this.endPoint = "/My/Plan"
  }

  /*======================================= PLAN */
  async getMyAllPlans() {
    return await axiosIns.get(this.endPoint + "/All")
  }

  async createPlan(payload) {
    return await axiosIns.post(this.endPoint + "/Create", payload)
  }
}

export default MyPlanService

import axiosIns from "@/plugins/axios"

const SubscriptionService = new (class {
  async getAllSubscriptions() {
    return await axiosIns.get('/Subscription/all')
  }
  async getSubscription(subscription_id) {
    return await axiosIns.get(`/Subscription/${subscription_id}`)
  }
  async createSubscription(subscription) {
    return await axiosIns.post('/Subscription/create', subscription)
  }
  async updateSubscription(subscription_id, subscription) {
    return await axiosIns.put(`/Subscription/update/${subscription_id}`, subscription)
  }
  async deleteSubscription(subscription_id) {
    return await axiosIns.delete(`/Subscription/delete/${subscription_id}`)
  }
})

export default SubscriptionService

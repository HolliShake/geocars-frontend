import axiosIns from "@/plugins/axios"

const UserSubscriptionService = new (class {
  async getMySubscriptions() {
    return await axiosIns.get('/UserSubscription/My')
  }

  async subscribe(subscription_id) {
    return await axiosIns.post(`/UserSubscription/subscribe/${subscription_id}`)
  }
})

export default UserSubscriptionService


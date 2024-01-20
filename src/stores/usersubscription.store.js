import { merge } from "lodash"
import { defineStore } from "pinia"

const useUserSubscriptionStore = defineStore('userSubscription', {

  state: () => ({
    userSubscription: [],
  }),

  getters: {
    getUserSubscription() {
      return this.userSubscription
    },
  },

  actions: {
    async initialize(userSubscriptionArray) {
      this.userSubscription = userSubscriptionArray
    },
    async add(userSubscription) {
      this.userSubscription.push(userSubscription)
    },
    async udpate(userSubscription) {
      merge(
        this.userSubscription.find(x => x.id == userSubscription.id),
        userSubscription,
      )
    },
  },

})


export default useUserSubscriptionStore

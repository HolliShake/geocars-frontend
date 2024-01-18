import helpers from '@/helpers'
import { cloneDeep, merge } from 'lodash'
import { defineStore } from "pinia"

const defaultModel = () => ({
  name: '',
  description: '',
  price: 0.00,
  max_cars: 1,
  max_company: 1,
  is_analytics_enabled: false,
  is_tracking_enabled: false,
  is_search_priority: false,
  tracking_interval_in_minutes: 0,
})

const useSubscriptionStore = defineStore('Subscription', {

  state: () => ({
    subscriptions: [],
    subscriptionModel: defaultModel(), 
  }),

  getters: {
    getSubscriptions() {
      return this.subscriptions
    },
    getSubscriptionModel() {
      const model = cloneDeep(this.subscriptionModel)

      model.price = helpers.formater.numberToMoney(model.price)

      return model 
    },
  },

  actions: {
    async initialize(subscriptionArray) {
      this.subscriptions = subscriptionArray
    },
    async add(subscription) {
      this.subscriptions.push(subscription)
    },
    async update(subscription) {
      merge(
        this.subscriptions.find(item => item.id == subscription.id),
        subscription,
      )
    },
    async delete(subscription) {
      this.subscriptions = this.subscriptions.filter(item => item.id != subscription.id)
    },

    async setField(subscription) {
      this.subscriptionModel = subscription
    },
    async resetField() {
      this.subscriptionModel = defaultModel()
    },
  },

})

export default useSubscriptionStore

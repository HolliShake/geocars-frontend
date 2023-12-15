import { merge } from "lodash"
import { defineStore } from "pinia"
import { reactive } from "vue"

const KEY = "userPlan"

const useMyPlanStore = defineStore("MyPlanStore", {

  state: () => {
    let data = null

    try {
      data = JSON.parse(localStorage.getItem(KEY))
    } catch (err) {
      console.log("Invalid JSON")
    }

    return ({
      myPlans: [],
      selectedPlan: reactive({ 
        value: data,
        get() {
          return this.value
        },
        set(value) {
          this.value = value
        },
      }),
    })
  },

  getters: {
    getMyPlans() {
      return this.myPlans
    },

    getSelectedPlan() {
      return this.selectedPlan.value
    },
  },

  actions: {
    async initialize(myPlansArray) {
      this.myPlans = myPlansArray
    },

    async clear() {
      this.myPlans = []
    },

    async findAsync(userPlan) {
      return this.myPlans.find(mp => mp.id == userPlan.id)
    },

    async add(userPlan) {
      this.myPlans.push(userPlan)
    },

    async update(userPlan) {
      merge(
        await this.findAsync(userPlan.id),
        userPlan,
      )
    },

    async delete(userPlan) {
      this.myPlans = this.myPlans.filter(up => up.id != userPlan.id)
    },

    async setSelectedPlan(userPlan) {
      if (!userPlan)
        return

      localStorage.setItem(KEY, JSON.stringify(userPlan))
      this.selectedPlan.value = userPlan
    },
  },

})

export default useMyPlanStore

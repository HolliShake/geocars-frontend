import { numberToMoney } from "@core/utils/formatters"
import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const planField = () => ({
  planName: "",
  price: "0.00",
  maxNumberOfCompany: 0,
  maxNumberOfCars: 0,
  accessTime: 0,
}
)

const usePlanStore = defineStore("PlanStore", {

  state: () => ({
    plans: [],
    planModel: planField(),
  }),

  getters: {
    getPlans() {
      return this.plans
    },
    getPlanModel() {
      const copy = /**/
        cloneDeep(this.planModel)

      copy.price = numberToMoney(copy.price).raw()
      
      return copy
    },
  },

  actions: {
    async initialize(plansArray) {
      this.plans = plansArray
    },

    async findAsync(planId) {
      return this.plans.find(p => p.id == planId)
    },

    async add(plan) {
      this.plans.push(plan)
    },

    async update(plan) {
      merge(
        await this.findAsync(plan.id),
        plan,
      )
    },

    async delete(plan) {
      this.plans = this.plans.filter(p => p.id != plan.id)
    },

    setField(planData) {
      this.planModel = planData
    },

    resetField() {
      this.planModel = planField()
    },

  },

})


export default usePlanStore


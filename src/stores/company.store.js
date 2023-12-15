import { cloneDeep, merge } from "lodash"
import { defineStore } from "pinia"

const companyField = () => ({
  companyName: "",
  description: "",
  barangay: "",
  city: "",
  zipCode: "",
  userPlanId: 0,
})

const useCompanyStore = defineStore("CompanyStore", {

  state: () => ({
    companies: [],
    companyModel: companyField(),
    userPlanId: null,
  }),

  getters: {
    getCompanies() {
      return this.companies
    },
    getCompanyModel() {
      const model = /**/
        cloneDeep(this.companyModel)

      model.userPlanId = this.userPlanId
      
      return model
    },
  },

  actions: {
    async initialize(myCompanyArray) {
      this.companies = myCompanyArray
    },

    async findAsync(companyId) {
      return this.companies.find(mc => mc.id == companyId)
    },

    async add(company) {
      this.companies.push(company)
    },

    async update(company) {
      merge(
        await this.findAsync(company.id),
        company,
      )
    },

    async delete(company) {
      this.companies = this.companies.filter(mc => mc.id != company.id)
    },

    async clear() {
      this.companies = []
    },

    async setUserPlan(userPlanId) {
      this.userPlanId = userPlanId
    },

    async setField(company) {
      this.companyModel = company
    },

    async resetField() {
      this.companyModel = companyField()
    },
  },

})

export default useCompanyStore




import { numberToMoney } from "@core/utils/formatters"
import { cloneDeep } from "lodash"
import { defineStore } from "pinia"

const defaultModel = () => ({
  brand: "",
  model: "",
  type: "",
  plate: "",
  description: "",
  rate: 0,
  ratePeriod: 0,
  companyId: 0,
})

const useVehicleStore = defineStore("VehicleStore", {

  state: () => ({
    vehicles: [],
    vehicleModel: defaultModel(),
    companyId: null,
  }),

  actions: {

    async initialize(vehiclesArray) {
      this.vehicles = vehiclesArray
    },

    async add(vehicle) {
      this.vehicles.push(vehicle)
    },

    async setCompany(companyId) {
      this.companyId = companyId
    },

    async setField(vehicle) {
      this.vehicleModel = vehicle
    },

    async resetField() {
      this.vehicleModel = defaultModel()
    },
  },

  getters: {
    
    getVehicles() {
      return this.vehicles
    },

    getVehicleModel() {
      const model = /**/
        cloneDeep(this.vehicleModel)

      model.companyId = this.companyId
      model.rate = numberToMoney(model.rate).raw()
      
      return model
    },

    getCompany() {
      return this.companyId
    },
    
  },

})

export default useVehicleStore

import axios from "@axios"



class VehiclService {

  constructor() {
    this._endPoint = "/Vehicle"
  }

  async fetchAllVehicleByCompanyId(companyId) {
    return await axios.get(this._endPoint + "/Company" + `/${companyId}`)
  }

  async createVehicle(payload) {
    return await axios.post(this._endPoint + "/Create", payload)
  }

}

export default VehiclService


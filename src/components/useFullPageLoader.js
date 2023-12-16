import { defineStore } from "pinia"



const useFullPageLoader = defineStore('FullPageLoader', {
  state: () => ({
    isLoading: false,
  }),
    
  actions: {
    async setLoading(loadingState) {
      this.isLoading = loadingState
    },
  },
})


export default useFullPageLoader



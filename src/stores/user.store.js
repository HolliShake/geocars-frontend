import { defineStore } from "pinia"


const useUserStore = defineStore('Store', {

  state: () => ({
    users: [],
  }),

  getters: {
    getUsers: state => state.users,
  },

  actions: {
    initialize(users) {
      this.users = users
    },
    add(user) {
      this.users.push(user)
    },
    delete(user) {
      this.users = this.users.filter(u => u.id != user.id)
    },
  },

})

export default useUserStore

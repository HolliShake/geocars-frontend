import useAuthStore from "@/stores/auth.store"

const formater = ({
  dateToWord: function(dateString) {
    const date = new Date(dateString)
    const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    let dd = date.getDate()

    if (dd < 10)
    {
      dd = `0${dd}`
    }

    return `${MONTHS[date.getMonth()]} ${dd}, ${date.getFullYear()}`
  },
  toPhpDate: dateString => {
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ')
  },
  numberToMoney: number => {
    return parseFloat(number).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
  },
  moneyToNumber: money => {
    return parseFloat(money.replace(/,/g, ""))
  },
})

const resolver = {

  getRootPath: () => {
    const authStore = useAuthStore()
    switch(authStore.getUserData.role.toLowerCase()) {
    case "admin":
      return "/admin"
    case "renter":
      return "/user"
    case "lender":
      return "/lender"
    default:
      return "404"
    }
  },

}

export default Object.freeze({
  formater,
  resolver,
})



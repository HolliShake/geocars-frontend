



export default Object.freeze({
  [0]/*Admin*/: [
    { subject: "Auth", action: "read" },
    { subject: "Admin", action: "read" },
    { subject: "Admin", action: "write" },
    { subject: "Admin", action: "edit" },
    { subject: "Admin", action: "all" },
  ],
  [1]/*Customer*/: [
    { subject: "Auth", action: "read" },
    { subject: "Customer", action: "read" },
    { subject: "Customer", action: "write" },
    { subject: "Customer", action: "edit" },
    { subject: "Customer", action: "all" },
  ],
  [2]/*Renter*/: [
    { subject: "Auth", action: "read" },
    { subject: "Renter", action: "read" },
    { subject: "Renter", action: "write" },
    { subject: "Renter", action: "edit" },
    { subject: "Renter", action: "all" },
  ],
})

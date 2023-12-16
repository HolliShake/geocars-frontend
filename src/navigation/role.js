



export default function makeRoute(role, menuArray) {

  const menu = []

  menuArray.forEach(m => {
    menu.push({
      ...m,
      subject: role,
      action: 'read',
    })
  })

  return menu
}

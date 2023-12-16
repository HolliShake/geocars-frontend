import makeRoute from "../role"

const INNER_ICON_SIZE = 18

export default [
  ...makeRoute('admin', [
    {
      title: 'Dashboard',
      icon: { icon: 'tabler-layout-dashboard' },
      to: { name: 'admin' },
    },
    {
      title: 'Users',
      icon: { icon: 'tabler-users-group' },
      to: { name: 'admin-users' },
    },
  ]),
]

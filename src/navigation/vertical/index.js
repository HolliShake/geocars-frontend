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
    {
      title: 'Subscription',
      icon: { icon: 'tabler-ticket' },
      to: { name: 'admin-subscription' },
    },
  ]),

  ...makeRoute('lender', [
    {
      title: 'Dashboard',
      icon: { icon: 'tabler-layout-dashboard' },
      to: { name: 'lender' },
    },
    {
      title: 'Cars',
      icon: { icon: 'tabler-car-suv' },
      to: { name: 'lender-cars' },
    },
    {
      title: 'Rental',
      icon: { icon: 'tabler-shopping-cart-bolt' },
      to: { name: 'lender-rental' },
    },
    {
      title: 'My Subscription',
      icon: { icon: 'tabler-ticket' },
      to: { name: 'lender-subscription' },
    },
  ]),
]

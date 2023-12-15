
const INNER_ICON_SIZE = 18

export default [
  {
    title: 'Home',
    icon: { icon: 'tabler-smart-home' },
    to: { name: 'index' },
    subject: 'Auth',
    action: 'read',
  },
  {
    title: 'My',
    icon: { icon: 'tabler-user-bolt' },
    children: [
      /*================================= ALL =================================*/
      {
        title: 'Companies',
        icon: { icon: 'tabler-building', size: INNER_ICON_SIZE },
        to: { name: 'my-companies' },
        subject: 'Auth',
        action: 'read',
      },

      // 
      {
        title: 'Subscription',
        icon: { icon: 'tabler-rocket', size: INNER_ICON_SIZE },
        to: { name: 'my-subscriptions' },
        subject: 'Auth',
        action: 'read',
      },
    ],
  },
  {
    title: 'System',
    icon: { icon: 'tabler-settings-cog' },
    children: [
      {
        title: 'Plans',
        icon: { icon: 'tabler-rocket', size: INNER_ICON_SIZE },
        to: { name: 'system-plans' },
        subject: 'Admin',
        action: 'read',
      },
    ],
  },
]

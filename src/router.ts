import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./components/account/Profile.vue')
    },
    {
      path: '/chinese',
      name: 'chinese',
      // component: EnglishDB
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./components/ChineseDB.vue')
    },
    {
      path: '/english',
      name: 'english',
      component: () => import('./components/EnglishDB.vue')
    },
    {
      path: '/geography',
      name: 'geography',
      component: () => import('./components/GeographyDB.vue')
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./components/HistoryDB.vue')
    },
    {
      path: '/biology',
      name: 'biology',
      component: () => import('./components/BiologyDB.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./components/account/account.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./components/account/Profile.vue')
    },
    {
      path: '/geographyhandouts',
      name: 'geographyhandouts',
      component: () => import('./components/Geographyhandouts.vue')}
  ]
})
export default router
// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import SilkUnbind from '../views/SilkUnbind.vue'
import SilkCarDetails from '../views/SilkCarDetails.vue'
import SilkCarPool from '../views/SilkCarPool.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
//
//   const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/SilkUnbind',
//     name: 'SilkUnbind',
//     component: SilkUnbind
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   }
// ]
//
// const router = new VueRouter({
//   routes
// })
//
// export default router

let router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/SilkUnbind',
            name: 'SilkUnbind',
            component: SilkUnbind
        },
        {
            path: '/SilkCarDetails',
            name: 'SilkCarDetails',
            component: SilkCarDetails
        },
        {
            path: '/SilkCarPool',
            name: 'SilkCarPool',
            component: SilkCarPool
        }
    ]


})

export default router

// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import SilkUnbind from '../views/SilkUnbind.vue'
import SilkCarDetails from '../views/SilkCarDetails.vue'
import SilkCarPool from '../views/SilkCarPool.vue'
import SetGrade from '../views/SetGrade.vue'
import DoffAuto from '../views/DoffAuto.vue'
import DoffManMade from '../views/DoffManMade.vue'
import ManuPack from '../views/ManuPack.vue'
import TemBoxPack from '../views/TemBoxPack.vue'
import PackInTemBox from '../views/PackInTemBox.vue'
import SubmitExcepAndUnbind from '../views/SubmitExcepAndUnbind.vue'
import DeleteWasteSilk from '../views/DeleteWasteSilk.vue'
import ForceSilkCarPool from '../views/ForceSilkCarPool.vue'
import PrintSilkCodes from '../views/PrintSilkCodes.vue'
import JoinSilkDoff from '../views/JoinSilkDoff.vue'
import WaiGuanReport from '../views/WaiGuanReport.vue'
import DoffMatualNew from '../views/DoffMatualNew.vue'
import DoffMatualJoinSilkNew from '../views/DoffMatualJoinSilkNew.vue'
import ChoosePositionSilkCarPool from '../views/ChoosePositionSilkCarPool.vue'

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
        },
        {
            path: '/SetGrade',
            name: 'SetGrade',
            component: SetGrade
        },
        {
            path: '/DoffAuto',
            name: 'DoffAuto',
            component: DoffAuto
        },
        {
            path: '/DoffManMade',
            name: 'DoffManMade',
            component: DoffManMade
        },
        {
            path: '/ManuPack',
            name: 'ManuPack.vue',
            component: ManuPack
        },
        {
            path: '/SubmitExcepAndUnbind',
            name: 'SubmitExcepAndUnbind.vue',
            component: SubmitExcepAndUnbind
        },
        {
            path: '/TemBoxPack',
            name: 'TemBoxPack.vue',
            component: TemBoxPack
        },
        {
            path: '/PackInTemBox',
            name: 'PackInTemBox.vue',
            component: PackInTemBox
        },
        {
            path: '/DeleteWasteSilk',
            name: 'DeleteWasteSilk.vue',
            component: DeleteWasteSilk
        },
        {
            path: '/ForceSilkCarPool',
            name: 'ForceSilkCarPool.vue',
            component: ForceSilkCarPool
        },
        {
            path: '/PrintSilkCodes',
            name: 'PrintSilkCodes.vue',
            component: PrintSilkCodes
        },
        {
            path: '/JoinSilkDoff',
            name: 'JoinSilkDoff.vue',
            component: JoinSilkDoff
        },
        {
            path: '/WaiGuanReport',
            name: 'WaiGuanReport.vue',
            component: WaiGuanReport
        },
        {
            path: '/DoffMatualNew',
            name: 'DoffMatualNew.vue',
            component: DoffMatualNew
        },
        {
            path: '/DoffMatualJoinSilkNew',
            name: 'DoffMatualJoinSilkNew.vue',
            component: DoffMatualJoinSilkNew
        },
        {
            path: '/ChoosePositionSilkCarPool',
            name: 'ChoosePositionSilkCarPool.vue',
            component: ChoosePositionSilkCarPool
        }
    ]


})

export default router

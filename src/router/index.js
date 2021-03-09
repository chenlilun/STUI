// @ts-nocheck
import Vue from 'vue'
import Router from 'vue-router'
import ChoosePositionSilkCarPool from '@/views/ChoosePositionSilkCarPool.vue'
import DeleteWasteSilk from '@/views/DeleteWasteSilk.vue'
import DoffNew from '@/views/doff/DoffNew.vue'
import DoffAuto from '@/views/DoffAuto.vue'
import DoffManMade from '@/views/DoffManMade.vue'
import DoffMatualJoinSilkNew from '@/views/DoffMatualJoinSilkNew.vue'
import DoffMatualNew from '@/views/DoffMatualNew.vue'
import ForceSilkCarPool from '@/views/ForceSilkCarPool.vue'
import Home from '@/views/Home.vue'
import JoinSilkDoff from '@/views/JoinSilkDoff.vue'
import ManuPack from '@/views/ManuPack.vue'
import PackInTemBox from '@/views/PackInTemBox.vue'
import PrintSilkCodes from '@/views/PrintSilkCodes.vue'
import SetGrade from '@/views/SetGrade.vue'
import SilkCarDetails from '@/views/SilkCarDetails.vue'
import SilkCarPool from '@/views/SilkCarPool.vue'
import SilkCarPoolFinal from '@/views/SilkCarPoolFinal.vue'
import SilkCarRetrospect from '@/views/SilkCarRetrospect.vue'
import SilkCarRetrospectDetails from '@/views/SilkCarRetrospectDetails.vue'
import SilkUnbind from '@/views/SilkUnbind.vue'
import SilkUnbind2 from '@/views/SilkUnbind2.vue'
import SubmitExcepAndUnbind from '@/views/SubmitExcepAndUnbind.vue'
import TemBoxPack from '@/views/TemBoxPack.vue'
import WaiGuanReport from '@/views/WaiGuanReport.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

let router = new Router({ 
  routes: [
    { 
      path: '/ChoosePositionSilkCarPool', 
      name: 'ChoosePositionSilkCarPool', 
      component: ChoosePositionSilkCarPool, 
    },
    { 
      path: '/DeleteWasteSilk', 
      name: 'DeleteWasteSilk', 
      component: DeleteWasteSilk, 
    },
    { 
      path: '/doff/DoffNew', 
      name: 'DoffNew', 
      component: DoffNew, 
    },
    { 
      path: '/DoffAuto', 
      name: 'DoffAuto', 
      component: DoffAuto, 
    },
    { 
      path: '/DoffManMade', 
      name: 'DoffManMade', 
      component: DoffManMade, 
    },
    { 
      path: '/DoffMatualJoinSilkNew', 
      name: 'DoffMatualJoinSilkNew', 
      component: DoffMatualJoinSilkNew, 
    },
    { 
      path: '/DoffMatualNew', 
      name: 'DoffMatualNew', 
      component: DoffMatualNew, 
    },
    { 
      path: '/ForceSilkCarPool', 
      name: 'ForceSilkCarPool', 
      component: ForceSilkCarPool, 
    },
    { 
      path: '/', 
      name: 'Home', 
      component: Home, 
    },
    { 
      path: '/JoinSilkDoff', 
      name: 'JoinSilkDoff', 
      component: JoinSilkDoff, 
    },
    { 
      path: '/ManuPack', 
      name: 'ManuPack', 
      component: ManuPack, 
    },
    { 
      path: '/PackInTemBox', 
      name: 'PackInTemBox', 
      component: PackInTemBox, 
    },
    { 
      path: '/PrintSilkCodes', 
      name: 'PrintSilkCodes', 
      component: PrintSilkCodes, 
    },
    { 
      path: '/SetGrade', 
      name: 'SetGrade', 
      component: SetGrade, 
    },
    { 
      path: '/SilkCarDetails', 
      name: 'SilkCarDetails', 
      component: SilkCarDetails, 
    },
    { 
      path: '/SilkCarPool', 
      name: 'SilkCarPool', 
      component: SilkCarPool, 
    },
    { 
      path: '/SilkCarPoolFinal', 
      name: 'SilkCarPoolFinal', 
      component: SilkCarPoolFinal, 
    },
    { 
      path: '/SilkCarRetrospect', 
      name: 'SilkCarRetrospect', 
      component: SilkCarRetrospect, 
      meta: { 
        keepAlive: true 
      }
    },
    { 
      path: '/SilkCarRetrospectDetails', 
      name: 'SilkCarRetrospectDetails', 
      component: SilkCarRetrospectDetails, 
    },
    { 
      path: '/SilkUnbind', 
      name: 'SilkUnbind', 
      component: SilkUnbind, 
    },
    { 
      path: '/SilkUnbind2', 
      name: 'SilkUnbind2', 
      component: SilkUnbind2, 
    },
    { 
      path: '/SubmitExcepAndUnbind', 
      name: 'SubmitExcepAndUnbind', 
      component: SubmitExcepAndUnbind, 
    },
    { 
      path: '/TemBoxPack', 
      name: 'TemBoxPack', 
      component: TemBoxPack, 
    },
    { 
      path: '/WaiGuanReport', 
      name: 'WaiGuanReport', 
      component: WaiGuanReport, 
    }
  ] 
})

export default router

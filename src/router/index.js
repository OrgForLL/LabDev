import Vue from 'vue'
import Router from 'vue-router'
import MassProductionQualityMain from '@/components/MassProductionQuality/Main'
import CreateCode from '@/components/CreateCode/CreateCode'
import Upload from '@/components/Utils/Upload'
import Test from '@/components/MassProductionQuality/Test'

import ProcessControlMain from '@/components/ProcessControl/Main'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/MassProductionQuality',
      default: 'MassProductionQualityMain',
      component: MassProductionQualityMain,
    } ,
    {
      path: '/ProcessControl',
      default: 'ProcessControlMain',
      component: ProcessControlMain,
    } ,
    {
      path: '/Upload',
      default: 'Upload',
      component: Upload,
    } ,
    {
      path: '/code',
      default: 'CreateCode',
      component: CreateCode,
    },
    {
      path: '/test',
      default: 'Test',
      component: Test,
    }      
  ]
})

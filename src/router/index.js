import Vue from 'vue'
import Router from 'vue-router'
import CreateCode from '@/components/test/CreateCode'
import Upload from '@/components/Utils/Upload'
import Test from '@/components/test/Test'
import Login from '@/components/Utils/Login'
import FlowLog from '@/components/Utils/FlowLog'
import Empty from '@/components/Utils/Empty'

// 这里用到了webpack2的import()它会返回一个promise
let ProcessControlMain = () => import('@/components/ProcessControl/Main')
let MaterialApplyMain = () => import('@/components/MaterialApply/Main')
// import ProcessControlMain from '@/components/ProcessControl/Main'
let MassProductionQualityMain = () => import('@/components/MassProductionQuality/Main')
let FactoryWashMain = () => import('@/components/FactoryWash/Main')
// import MassProductionQualityMain from '@/components/MassProductionQuality/Main'
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
      meta:{
        requireAuth:true 
      }
    } ,
    {
      path: '/MaterialApply',
      default: 'MaterialApplyMain',
      component: MaterialApplyMain,
      meta:{
        requireAuth:true,
        title:"调样"
      }
    } ,    
    {
      path: '/FactoryWash',
      default: 'FactoryWashMain',
      component: FactoryWashMain,
      meta:{
        requireAuth:true 
      }
    } ,      
    {
      path: '/Login',
      default: 'Login',
      component: Login,
    } ,   
    {
      path: '/FlowLog',
      default: 'FlowLog',
      component: FlowLog,
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
      path: '/',
      default: 'Empty',
      component: Empty,
    },      
    {
      path: '/test',
      default: 'Test',
      component: Test,
    }      
  ]
})

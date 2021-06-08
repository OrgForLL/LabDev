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
let MassProductionQualityMain = () => import('@/components/MassProductionQuality/Main')
let FactoryWashMain = () => import('@/components/FactoryWash/Main')
let MaterielCodeMain = () => import('@/components/MaterielCode/Main')
let SampleCardMain = () => import('@/components/SampleCard/Main')
let FactoryWashLabMain = () => import('@/components/FactoryWashLab/Main')
let AccessoriesMain = () => import('@/components/Accessories/Main')
let UploadVant = () => import('@/components/Utils/UploadVant')
// import MassProductionQualityMain from '@/components/MassProductionQuality/Main'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/MassProductionQuality',//面料大货质量跟进,高 ,没用
      default: 'MassProductionQualityMain',
      component: MassProductionQualityMain,
    } ,
    {
      path: '/ProcessControl',//产品质量记录信息叶总
      default: 'ProcessControlMain',
      component: ProcessControlMain,
      meta:{
        requireAuth:true 
      }
    } ,
    {
      path: '/FactoryWashLab',//成衣水洗实验室上传图片
      default: 'FactoryWashLabMain',
      component: FactoryWashLabMain,
      meta:{
        requireAuth:true 
      }
    } ,    
    {
      path: '/Accessories',//产品质量记录信息叶总
      default: 'AccessoriesMain',
      component: AccessoriesMain,
      meta:{
        requireAuth:true 
      }
    } ,    
    {
      path: '/SampleCard',//研发面料样卡接收
      default: 'SampleCardMain',
      component: SampleCardMain,
      meta:{
        requireAuth:true 
      }
    } ,    

    {
      path: '/MaterielCode',//材料编码财务
      default: 'MaterielCodeMain',
      component: MaterielCodeMain,
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
      path: '/FactoryWash',//成衣水洗叶总
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
    },
    {
      path: '/UploadVant',
      default: 'UploadVant',
      component: UploadVant,
    }    
  ]
})

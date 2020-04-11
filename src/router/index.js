import Vue from 'vue'
import Router from 'vue-router'
import Collec from '@/components/ClothInfo/Collec'
import ClothInfo from '@/components/ClothInfo/ClothInfo'
import Test from '@/components/Utils/UploadImg' 
import printZp from '@/views/printZp.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      default: 'Collec',
      component: Collec,
    } ,
    {
      path: '/c',
      default: 'ClothInfo',
      component: ClothInfo,
    } ,
    {
      path: '/test',
      default: 'Test',
      component: Test,
    } ,    
    {
      path:'/dayinZp',
      component: printZp
    }
    ,
    {
      path:'/dayinRz',
      component: ()=>import('@/views/printRz.vue')
    },
    {
      path:'/dayinSp',
      component: ()=>import('@/views/printSp.vue')
    },
    {
      path:'/dayinSx',
      component: ()=>import('@/views/printSx.vue')
    }
  ]
})

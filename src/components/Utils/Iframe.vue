<template>
  <el-container style="padding-left:0px;padding-right:0px" >  
    <el-main :style="mainHeight">
  
        <div class="iframe-body-sty" >
          <iframe id="iframe-shrink"  :style="scaleFun" :src="detailUrl"></iframe>
        </div>
   
    </el-main>
    <el-footer :style="footHeight" > 
      <NgvCollecBtn  @goback="goback"></NgvCollecBtn> 
    </el-footer>       
  </el-container>  
</template>

<script>
import { getUrlKey } from "@/assets/js/utils";
import { loadJS } from "@/assets/js/utils";
export default {
  name: "Iframe",
  components: {
    'NgvCollecBtn': () => import('@/components/Utils/NgvCollecBtn'), 
  },
  props: {
    parIn: Object,
  },
  data: function () {
    return {
      scale:0.55,
      iframeWidth:700,
      mainHeight: {
        height: '360px'
      },      
      headerHeight: {
        height: '0px',
        marginTop: '0px',
        marginLeft: '0px',
        marginRight: '0px',
        lineHeight: '0px'
      },
      footHeight: {
        height: '60px',
        marginLeft: '20px',
        marginRight: '20px',
        marginBottom: '20px',
        lineHeight: '60px',
        textAlign: 'right'
      },      
      mdata: {
     
      },
      show: true, //显示或者隐藏
      loading: true, //等待状态
      errmsg: "",
      gobackVisible: true, //是否显示返回按钮
      isComponents: true, //是否是嵌在父组件里，还是直接URL打开
      detailUrl:this.parIn.detailUrl,
    };
  },
  methods: {
    getHeight () {
      this.mainHeight.height = window.innerHeight - Number(this.headerHeight.height.replace('px', '')) - Number(this.footHeight.height.replace('px', '')) - Number(this.headerHeight.marginTop.replace('px', '')) - Number(this.footHeight.marginBottom.replace('px', '')) + 'px'      
      console.log(window.innerWidth,window.innerHeight)
    },    
    goback() {
      //释放vue对象
      if(this.mdata.vueExtJSKey && typeof VueExtJS  =="object") VueExtJS.dispose();
      // window.removeEventListener("scroll", this.scroll,true);
      this.$emit("goback");
    },
    test() {
      // VueExtJS.getData();
      // this.getData();
    },

  },
  mounted() {

   
  },
  watch: {},
  computed: {
    scaleFun:function () {
            var scale = this.scale;
            
            //return `transform:scale(${scale})`
            let iframeWidth = this.iframeWidth;
            scale=window.innerWidth/iframeWidth;
            let iframeHeight=Number(this.mainHeight.height.replace('px', ''))/scale

            let left=-(iframeWidth*(1-scale))/2
            let top=-(iframeHeight*(1-scale))/2;
            
            console.log(iframeHeight)
            return `width:${iframeWidth}px;height:${iframeHeight}px;transform:scale(${scale});left:${left}px;top:${top}px;`
          }
  },
  created() { 
    

   // 页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener('resize', this.getHeight)
    this.getHeight()    
  },
  beforeCreate() {},
};
</script>

<style scoped>
.iframe-body-sty{position: relative;overflow: hidden;height:1200px;}
	.iframe-body-sty>#iframe-shrink{position: absolute;} 
 .el-main{
   padding: 0px;
   
 }
</style>

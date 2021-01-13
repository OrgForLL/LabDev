<template>
  <el-container>    
    <el-header :style="headerHeight">
      <h2 style="text-align: center">审批意见</h2>
    </el-header>
    <el-main :style="mainHeight">
    <!-- <el-button type="primary" style="width: 100%" @click="test">查询</el-button> -->
    <div v-show="this.errmsg.length > 0 ? true : false">{{ this.errmsg }}</div>
    <el-timeline :reverse="false" style="margin-left: 20px; margin-right: 20px">
      <el-timeline-item
        v-for="activity in mdata.flowData"
        :key="activity.flowopinionid"
        :timestamp="activity.created + ' ' + activity.creator"
      >
       <div class="text-wrapper"> {{ activity.body }}</div>
      </el-timeline-item>
    </el-timeline>
    </el-main>
    <el-footer :style="footHeight" > 
      <NgvCollecBtn  @goback="goback"></NgvCollecBtn> 
    </el-footer>     
    <!-- <div class="gobacFloatDiv" ref="gobacFloatDiv" v-show="gobackVisible">
      <el-button type="primary" @click="goback">返回</el-button>
    </div>    -->
  </el-container>  
</template>

<script>
import { getUrlKey } from "@/assets/js/utils";
import { loadJS } from "@/assets/js/utils";
export default {
  name: "FlowLog",
  components: {
    'NgvCollecBtn': () => import('@/components/Utils/NgvCollecBtn'), 
  },
  props: {
    parIn: Object,
  },
  data: function () {
    return {
      mainHeight: {
        height: '360px'
      },      
      headerHeight: {
        height: '60px',
        marginTop: '0px',
        marginLeft: '20px',
        marginRight: '20px',
        lineHeight: '30px'
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
        //流程相关的参数
        flowData: [
          //   {
          //   contentType:"",//TODO 不同的类型
          //   body: '活动按期开始',
          //   created: '2018-04-15',
          //   creator:"张三",
          //   cs:"",
          //   flowopinionid:10,
          //   nodeid:0,
          //   nodename:"",
          // }, {
          //   body: '通过审核',
          //   contentType:"",//TODO 不同的类型
          //   created: '2018-04-15',
          //   creator:"张三",
          //   cs:"",
          //   flowopinionid:20,
          //   nodeid:0,
          //   nodename:"",
          // }, {
          //   body: '创建成功',
          //   contentType:"",//TODO 不同的类型
          //   created: '2018-04-15',
          //   creator:"张三",
          //   cs:"",
          //   flowopinionid:30,
          //   nodeid:0,
          //   nodename:"",
          // }
        ],
        flowid: ( this.parIn && this.parIn.Flowid) || 0,
        docid: this.parIn && this.parIn.Docid || 0,
        tzid: this.parIn && this.parIn.tzid || 0,
        ppdm: this.parIn && this.parIn.ppdm || "",
        action: this.parIn && this.parIn.action || "",
        ext: this.parIn && this.parIn.extIn || "1",
        vueExtJSKey: this.parIn && this.parIn.vueExtJSKey || "", //加载外部JS的KEY
      },
      show: true, //显示或者隐藏
      loading: true, //等待状态
      errmsg: "",
      gobackVisible: true, //是否显示返回按钮
      isComponents: true, //是否是嵌在父组件里，还是直接URL打开
    };
  },
  methods: {
    getHeight () {
      this.mainHeight.height = window.innerHeight - Number(this.headerHeight.height.replace('px', '')) - Number(this.footHeight.height.replace('px', '')) - Number(this.headerHeight.marginTop.replace('px', '')) - Number(this.footHeight.marginBottom.replace('px', '')) + 'px'      
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
    getData() {
      if (!this.mdata.flowid || !this.mdata.docid || !this.mdata.tzid) {
        this.errmsg = "flowi,docid,tzid必传";
        this.loading = false;
        return false;
      }
      let input = {};
      input.flowid = this.mdata.flowid;
      input.docid = this.mdata.docid;
      input.tzid = this.mdata.tzid;
      input.ppdm = this.mdata.ppdm;
      input.action = this.mdata.action;
      input.ext = this.mdata.ext;
      this.$axiosPost
        .post(APIUTL + "?action=getFlowLog", input)
        .then((response) => {
          if (response.data.errcode == 0) {
            //TODO 每个意见需要单独处理
            this.mdata.flowData.splice(0, this.mdata.flowData.length);
            for (var i = 0; i < response.data.data.flowData.length; i++) {
              if(this.mdata.vueExtJSKey && typeof VueExtJS  =="object"){
                VueExtJS.done(response.data.data.flowData[i],"vue",response.data.data.extData);
              }
              this.mdata.flowData.push(response.data.data.flowData[i]); //有响应
            }
          } else {
            console.log(response);
          }
          this.loading = false;
        });
    },
    // scroll() {
    //   var scrollTop =
    //     document.documentElement.scrollTop || document.body.scrollTop;
    //   var oDiv = this.$refs["gobacFloatDiv"];
    //   //oDiv.offsetHeight 获取div的高度
    //   oDiv.style.top =
    //     document.documentElement.clientHeight -
    //     oDiv.offsetHeight +
    //     scrollTop +
    //     "px";
    // },
  },
  mounted() {
    // if (this.gobackVisible) {
    //   //如果有显示返回按钮，才需要监听滚动调整按钮的位置      
    //   window.addEventListener(
    //     "scroll",       
    //     this.scroll,
    //     true
    //   );
    // }    
    loadJS(this, (bo) => {
      if (bo.errcode==0) {
        console.log(this,bo.data);
        this.getData();
      }
      else {
        console.log(this,bo.data);
        this.errmsg = "加载外部JS失败.无法继续";
        this.loading = false;
        return false;
      }
      
    });
  },
  watch: {},
  computed: {},
  created() {
    if (getUrlKey("isComponents", window.location.href)) 
      this.isComponents =
        getUrlKey("isComponents", window.location.href) == "true";
    
    if (this.isComponents == false) {
      //不是父组件的子组件，那参数由URL传
      this.mdata.flowid = getUrlKey("flowid", window.location.href);
      this.mdata.docid = getUrlKey("docid", window.location.href);
      this.mdata.tzid = getUrlKey("tzid", window.location.href);
      this.mdata.ppdm =
        getUrlKey("ppdm", window.location.href) || this.mdata.ppdm;
      this.mdata.action = getUrlKey("action", window.location.href);
      this.mdata.ext = getUrlKey("ext", window.location.href) || this.mdata.ext;
      this.mdata.vueExtJSKey =
        getUrlKey("vueExtJSKey", window.location.href) ||
        this.mdata.vueExtJSKey;
      // console.log(this.mdata.vueExtJSKey);
    }
   // 页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener('resize', this.getHeight)
    this.getHeight()    
  },
  beforeCreate() {},
};
</script>

<style>
.gobacFloatDiv {
  width: 80px;
  height: 60px;

  position: absolute;
  right: 0;
  bottom: 0;
}

.text-wrapper {
  white-space: pre-wrap;
}
</style>

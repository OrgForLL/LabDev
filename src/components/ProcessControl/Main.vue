<template>
  <div
    id="ProcessControl"
    style="margin-left: 10px; margin-right: 10px; font-size: 14px"
  >
    <div v-loading="loading">
      <div v-show="scanVisible">
        <h2 style="text-align: center">产品质量记录信息</h2>
        <el-form :model="mdata">
          <el-form-item>
            <el-col :span="4">货号:</el-col>
            <el-col :span="20"
              ><el-input v-model="mdata.sphh"></el-input
            ></el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="search"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width: 100%" @click="scan"
              >扫描</el-button
            >
          </el-form-item>
        </el-form>

        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>扫描记录</span>
          </div>
          <div v-for="item in historyList" :key="item.tm" class="text item">
            <a href="#" @click.stop="bqLogSearch(item)">{{ item.tm }}</a>
          </div>
        </el-card>
      </div>
      <!--详情页-->
      <div v-if="colVisible">
        <Detail @goback="scanGoback" v-bind:sphhIn="this.mdata.sphh"></Detail>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "ProcessControl",
  components: {      
    'Detail': () => import('@/components/ProcessControl/Detail')
  },
  data: function () {
    return {      
      mdata: {
        sphh: "",    
      },
      historyList: [
        // {tm:"test"}
      ],
      loading: false,   
      colVisible: false,//详情页是否隐藏
      scanVisible: true,//扫描页是否隐藏
    };
  },
  methods: {
    init() {      
      llApp.init();
    },
    scanGoback(){
      this.scanVisible=true;
      this.colVisible=false;
    },
    search() {
      if (this.mdata.sphh.length == 0) {
        this.$message("请扫描或者输入货号");
        return false;
      }
      this.colVisible = true;
      this.scanVisible=false;   
      this.addLog(this.mdata.sphh); //增加扫描记录  
    
    },
    scan() {
      llApp.scanQRCode((result) => {
        this.mdata.sphh = result;
        this.search();
      });
    },
   bqLogSearch(item) {
      this.mdata.sphh = item.tm;
      this.search();
    },    
    addLog(result) {
      var obj = {};
      obj.tm = result;
      this.historyList.forEach((element) => {
        if (element.tm == result) {
          obj = {};
        }
      });
      obj && this.historyList.push(obj);
    },
    
  },
  mounted() {},
  watch: {

  },
  computed: {
    
  },
  created() {
    this.init();
  },
};
</script>

<style scoped>

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
@media screen and (max-width: 500px) {
  .el-message-box {
    width: 300px !important;
  }
  .box-card {
    width: 100% !important;
  }
}

.title-context {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
}
</style>

<template>
  <div
    id="ProcessControl"
    
  >
    <div v-loading="loading">
      <div class="wrap" v-show="scanVisible">
        <h2 style="text-align: center">产品质量记录信息</h2>
        <van-cell-group>
          <van-field  size="large"  v-model="mdata.sphh" label="货号" />
        </van-cell-group>
        <van-button
          block
          size="large"
          @click="search"
          type="primary"
          style="margin-top: 10px; margin-bottom: 10px"
          >查询</van-button
        >
        <van-button block size="large" @click="scan" type="primary"
          >扫描</van-button
        >
        <van-divider
          :style="{
            color: '#1989fa',
            borderColor: '#1989fa',
            padding: '0 16px',
          }"
          content-position="left"
          >扫描记录</van-divider
        >
        
        <van-cell-group  >
          <van-cell v-for="item in historyList" :key="item.tm" :title="item.tm"
           @click="bqLogSearch(item)" is-link />
        </van-cell-group>   
      </div>
      <!--详情页-->
      <div v-if="colVisible">
        <Detail @goback="scanGoback" v-bind:sphhIn="this.mdata.sphh"></Detail>
      </div>
    </div>
  </div>
</template>

<script>
import { Button as VanButton } from "vant";
import { Popup as VanPopup } from "vant";
import { Field as VanField } from "vant";
import { Divider as VanDivider } from "vant";
import { Cell as VanCell } from "vant";
import { CellGroup as VanCellGroup } from "vant";
export default {
  name: "ProcessControl",
  components: {
    Detail: () => import("@/components/ProcessControl/Detail"),
    VanButton,
    VanPopup,
    VanField,
    VanDivider,VanCell,VanCellGroup
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
      colVisible: false, //详情页是否隐藏
      scanVisible: true, //扫描页是否隐藏
    };
  },
  methods: {
    init() {
      llApp.init();
    },
    scanGoback() {
      this.scanVisible = true;
      this.colVisible = false;
    },
    search() {
      if (this.mdata.sphh.length == 0) {
        this.$message("请扫描或者输入货号");
        return false;
      }
      this.colVisible = true;
      this.scanVisible = false;
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
      for(let i=0;i<this.historyList.length;i++){
        if(this.historyList[i].tm==result) obj=null;
      }
      if(obj) this.historyList.push(obj);
 
    },
  },
  mounted() {},
  watch: {},
  computed: {},
  created() {
    this.init();
  },
};
</script>

<style scoped>

.wrap {
  height: calc(100% - 0px);
  overflow-y: auto;  
  margin-left: 20px;
  margin-right: 20px;
}

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

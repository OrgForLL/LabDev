<template>
  <div id="ProcessControl">
    <div v-loading="loading">
      <div class="wrap" v-show="scanVisible">
        <h2 style="text-align: center">样卡接收</h2>
        <van-cell-group>
          <van-field size="normal" v-model="mdata.tmxx" label="二维码信息" />
        </van-cell-group>
        <van-button
          block
          size="normal"
          @click="search"
          type="primary"
          style="margin-top: 10px; margin-bottom: 10px"
          >查询</van-button
        >
        <van-button block size="normal" @click="scan" type="primary"
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

        <van-cell-group>
          <van-cell
            v-for="item in historyList"
            :key="item.tm"
            :title="item.tm"
            @click="bqLogSearch(item)"
            is-link
          />
        </van-cell-group>
      </div>
      <!--详情页-->
      <div v-if="colVisible" style="margin-left: 20px; margin-right: 20px;text-align:center">
        <van-cell-group>
          <van-field v-model="mdata.chdm" readonly label="材料编码" />
          <van-field v-model="mdata.chmc" readonly label="材料名称" />
          <van-field v-model="mdata.xmjl" readonly label="项目经理" />
          <van-field v-model="mdata.sl" readonly label="调样数量" />
          <van-field v-model="mdata_zt" readonly label="状态" />
        </van-cell-group>

        <van-image :src="mdata.tp" width="200" @click="ImageClick()" />
        <van-button
          block
          size="normal"
          @click="save"
          type="primary"
          :disabled="saveDisabled"
          style="margin-top: 10px; margin-bottom: 10px"
          >接收</van-button
        >
        <van-button block size="normal" @click="goback" type="primary"
          >返回</van-button
        >        
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
import { ImagePreview } from "vant";
import { Image as VanImage } from "vant";
export default {
  name: "SampleCard",
  components: {
    VanButton,
    VanPopup,
    VanField,
    VanDivider,
    VanCell,
    VanCellGroup,
    VanImage,
  },
  data: function () {
    return {
      mdata: {
        tmxx: "",
        xmjl: "test", //项目经理
        chdm: "test", //材料编号
        chmc: "test", //材料名称
        sl: "4", //调样量
        tp: "", //材料图片
        djlx: "0", //
      },
      mdata_zt: "",
      saveDisabled: true, //是否能接收
      historyList: [
        // {tm:"test"}
      ],
      loading: false,
      userInfo: this.$status.userInfo,
      colVisible: false, //详情页是否隐藏
      scanVisible: true, //扫描页是否隐藏
    };
  },
  methods: {
    init() {
      llApp.init();
      this.errMsg('请从应用里面进入');
      return false;
    },
    goback() {
      this.scanVisible = true;
      this.colVisible = false;
      this.mdata.tmxx=''
    },
    search() {
      if (this.mdata.tmxx.length == 0) {
        this.$message("请扫描信息");
        return false;
      }   
      this.errMsg('请从应用里面进入');
      return false;   
      this.loading = true;
      this.searchPromise(this.mdata.tmxx);
    },
    ImageClick() {
      let images = new Array();
      images.push(this.mdata.tp);

      ImagePreview({ images: images });
    },
    searchPromise(tmxx) {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(APIUTL, {
            params: {
              serviceName: "svr-external",
              action: "fabricStorage/sampleCardInfo",
              tmxx: tmxx,
              userid: this.userInfo.userid,
            },
          })
          .then((response) => {
            let result = response.data;
            console.log(result);
            if (result.errcode != 0) {
              this.errMsg(result.errmsg);
              return;
            }
            this.loading = false;
            this.addLog(this.mdata.tmxx); //增加扫描记录
            
            if (result.data.length == 0) {
              this.errMsg("没有记录");
              return false;
            }
            this.colVisible = true;
            this.scanVisible = false;            
            this.mdata.chdm = result.data[0].chdm;
            this.mdata.chmc = result.data[0].chmc;
            this.mdata.djlx = result.data[0].djlx;
            this.mdata.sl = result.data[0].sl;
            this.mdata.tp = result.data[0].tp;
            this.mdata.xmjl = result.data[0].xmjl;
            this.mdata_zt = result.data[0].zt;
            resolve();
          })
          .catch((error) => {
            this.loading = false;
            this.errMsg(error);
            reject(error);
          });
      });
    },
    save() {
      this.loading = true;
      // this.errMsg('请从应用里面进入');//不用这个
      this.savePromise(this.mdata.tmxx)
    },
    savePromise(tmxx) {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(APIUTL, {
            params: {
              serviceName: "svr-external",
              action: "fabricStorage/sampleCardSave",
              tmxx: tmxx,
              userid:this.userInfo.userid
            },
          })
          .then((response) => {
            let result = response.data;
            console.log(result);
            if (result.errcode != 0) {
              this.errMsg(result.errmsg);
              return;
            }
            this.loading = false;
            if(result.data.length==1){
              if(result.data[0].errcode==0){
                this.colVisible = false;
                this.scanVisible = true;
                this.mdata.tmxx=''  
                this.errMsg('接收成功');
                resolve();
              }else{
                resolve(1);
              }
            }else{
              resolve(1);
            }
          })
          .catch((error) => {
            this.errMsg(error);
            reject(error);
          });
      });
    },
    errMsg(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: "error",
      });
    },
    scan() {
      llApp.scanQRCode((result) => {
        this.mdata.tmxx = result;
        this.search();
      });
    },
    bqLogSearch(item) {
      this.mdata.tmxx = item.tm;
      this.search();
    },
    addLog(result) {
      var obj = {};
      obj.tm = result;
      for (let i = 0; i < this.historyList.length; i++) {
        if (this.historyList[i].tm == result) obj = null;
      }
      if (obj) this.historyList.push(obj);
    },
  },
  mounted() {},
  watch: {
    mdata_zt(newValue, oldvalue) {
      this.saveDisabled = newValue != "未接收";
    },
  },
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

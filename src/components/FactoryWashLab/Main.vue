<template>
  <div id="ProcessControl">
    <div v-loading="loading">
      <div class="wrap" v-show="scanVisible">
        <h2 style="text-align: center">实验报告图片上传</h2>
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
      <div
        v-if="colVisible"
        style="margin-left: 20px; margin-right: 20px; text-align: center"
      >
        <van-uploader
          style="margin-left: 5px"
          v-model="imgList"
          :disabled="!qx"
          multiple
          :before-delete="picHandleChangeDel"
          :deletable="deleteQx"
          :after-read="uploadImg"
        />
        <van-notice-bar mode="link">{{ notice }}</van-notice-bar>
        <van-tabbar v-model="active" @change="handleSelect">
          <van-tabbar-item name="close" icon="certificate"
            >关闭</van-tabbar-item
          >
        </van-tabbar>
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
import { Uploader as VanUploader } from "vant";
import { Tabbar as VanTabbar } from "vant";
import { TabbarItem as VanTabbarItem } from "vant";
import { NoticeBar as VanNoticeBar } from "vant";
import Compressor from 'compressorjs';
export default {
  name: "FactoryWashLab",
  components: {
    VanButton,
    VanPopup,
    VanField,
    VanDivider,
    VanCell,
    VanCellGroup,
    VanImage,VanUploader,
    VanTabbar,
    VanTabbarItem,VanNoticeBar,
  },
  data: function () {
    return {
      tableid: 0,
      groupid: 0,
      imgList: [],
      qx: true,
      deleteQx: true,
      notice:"",
      active: "",
      mdata:{
        tmxx:"",
      },
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
    },

    handleSelect(index) {
      if (index == "close") {
        this.active = "";
        this.scanVisible = true;
        this.colVisible = false;
        this.mdata.tmxx = "";
      }
    },
    uploadImg(e) {
      // console.log(this.imgList);
      this.notice = "上传中....";
      if (Array.isArray(e)) {
        e.forEach((item) => {
          //param.append("file", item.file, item.file.name); // 通过append向form对象添加数据
          new Compressor(item.file, {
            quality: 0.6, // 压缩质量 可以查看文档获取明细
            success: (result) => {
              // 成功后上传
              let param = new FormData(); // 创建form对象
              param.append("file", result, item.file.name); // 通过append向form对象添加数据
              this.$axiosPost
                .post(
                  APIUTLFile +
                    "?serviceGotoUrl=" +
                    encodeURIComponent(
                      NetUrlUpload +
                        "service/HttpRequestSkill.ashx?groupid=" +
                        this.groupid +
                        "&tableid=" +
                        this.tableid
                    ),
                  // APIUTLFile +
                  //   "?serviceGotoUrl=tm.lilang&groupid="+this.groupid+"&tableid="+this.tableid+"&WXOpenID=oploGjw7dgERs2FLFvG2qvjwzt90",
                  param
                )
                .then((response) => {
                  // console.log(response.data)
                  if (response.data.errcode == 0) {
                    this.notice =
                      this.notice.replace("上传中....", "") +
                      item.file.name +
                      "上传成功,";
                    //if (this.tableid == 0) {
                    this.keysLocal =
                      (this.keysLocal &&
                        this.keysLocal.concat(response.data.data.split(","))) ||
                      response.data.data.split(",");
                    //} else {
                    //this.search();
                    //}
                  } else {
                    this.notice = response.data.errmsg;
                  }
                });
            },
            error(err) {
              console.log("Compressor", err);
            },
          });
        });
      } else {
        //param.append("file", e.file, e.file.name); // 通过append向form对象添加数据
        // 开始压缩
        new Compressor(e.file, {
          quality: 0.6, // 压缩质量 可以查看文档获取明细
          success: (result) => {
            // 成功后上传
            let param = new FormData(); // 创建form对象
            param.append("file", result, e.file.name); // 通过append向form对象添加数据
            this.$axiosPost
              .post(
                APIUTLFile +
                  "?serviceGotoUrl=" +
                  encodeURIComponent(
                    NetUrlUpload +
                      "service/HttpRequestSkill.ashx?groupid=" +
                      this.groupid +
                      "&tableid=" +
                      this.tableid +
                      "&createname=" +
                      this.$status.userInfo.cname
                  ),
                // APIUTLFile +
                //   "?serviceGotoUrl=tm.lilang&groupid="+this.groupid+"&tableid="+this.tableid+"&WXOpenID=oploGjw7dgERs2FLFvG2qvjwzt90",
                param
              )
              .then((response) => {
                // console.log(response.data)
                if (response.data.errcode == 0) {
                  this.notice = e.file.name + "上传成功";
                  //if (this.tableid == 0) {
                  this.keysLocal =
                    (this.keysLocal &&
                      this.keysLocal.concat(response.data.data.split(","))) ||
                    response.data.data.split(",");
                  //} else {
                  //this.search();
                  //}
                } else {
                  this.notice = response.data.errmsg;
                }
              });
          },
          error(err) {
            console.log("Compressor", err);
          },
        });
      }
    },
    picHandleChangeDel(file) {
      // console.log(file,this.keysLocal)
      if (file.createname != this.$status.userInfo.cname) {
        this.notice = "非制单人不能删除....";
        return false;
      }
      this.notice = "删除中....";
      return new Promise((resolve, reject) => {
        this.$axios
          .get(APIUTL, {
            params: {
              serviceName: "svr-cooperativeoffice",
              action: "SealedSamples/delePic",
              djid: file.ID,
            },
          })
          .then((response) => {
            let r = response.data;
            let isExists = false;
            for (let i = 0; i < this.keysLocal; i++) {
              if (this.keysLocal[i] == Number(file.ID)) {
                this.keysLocal[i] = Number(this.keysLocal[i]) * -1;
                isExists = true;
              }
            }
            if (!isExists) {
              this.keysLocal.push(Number(file.ID) * -1);
            }

            this.notice = "删除成功....";
            if (r.errcode == 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((error) => {
            this.notice = "失败....";
            reject(error);
          });
      });
    },
    search() {
      if (this.mdata.tmxx.length == 0) {
        this.$message("请扫描信息");
        return false;
      }
      this.loading = true;
      this.groupid = 10040;
      //wtid:216758
      this.tableid = this.mdata.tmxx.split(":")[1];
      this.searchPromise();
    },
    ImageClick() {
      let images = new Array();
      images.push(this.mdata.tp);
      ImagePreview({ images: images });
    },
    searchPromise() {   
      let action = "getImgage";
      this.$axios
        .get(APIUTL, {
          params: {
            action: action,
            tableid: this.tableid,
            groupid: this.groupid,
            // keys: this.keysLocal.join(","),
          },
        })
        .then((response) => {
          if (response.data.errcode == 0) {
            let imgList = response.data.data;
            if (imgList) {
              for (let item of imgList) {
                item.url = item.URLAddress.replace(
                  "../",
                  "http://webt.lilang.com:9001/"
                );
              }
              this.imgList = imgList;
              this.scanVisible = false;
              this.colVisible = true;     
              this.notice="";
              this.addLog(this.mdata.tmxx); //增加扫描记录        
            }
          } else {
            this.errMsg("查询失败");
          }
           this.loading = false
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false
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

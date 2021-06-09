<template>
  <div class="wrap" v-if="visible">
    <van-uploader
      style="margin-left: 5px"
      v-model="imgList"
      :disabled="!qx"
      multiple
      :before-delete="picHandleChangeDel"
      :deletable="deleteQx"
      :after-read="uploadImg"
    />    
<van-notice-bar mode="link">{{notice}}</van-notice-bar>
    <van-tabbar v-model="active" @change="handleSelect">
      <van-tabbar-item name="close" icon="certificate">关闭</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Uploader as VanUploader } from "vant";
import { Tabbar as VanTabbar } from "vant";
import { TabbarItem as VanTabbarItem } from "vant";
import { NoticeBar as VanNoticeBar } from "vant";
import Compressor from 'compressorjs';
export default {
  name: "UploadVant",
  components: {
    VanUploader,
    VanTabbar,
    VanTabbarItem,VanNoticeBar,
  },
  props: {
    groupid: Number,
    tableid: Number,
    keys: Array,
    visible: {
      type: Boolean,
      default: false,
    },
    qx: {
      type: Boolean,
      default: false,
    },
    deleteQx: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      active: "",
      keysLocal: [],
      imgList: [
        // { url: "https://img01.yzcdn.cn/vant/leaf.jpg" },
        // // Uploader 根据文件后缀来判断是否为图片文件
        // // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: "https://cloud-image", isImage: true },
      ],
      notice:"",
    };
  },
  methods: {
    init() {
      this.keysLocal=(this.keys?JSON.parse(JSON.stringify(this.keys)):[]);
      if (this.visible) this.search();
    },
    picHandleChangeDel(file){
      // console.log(file,this.keysLocal)
      if(file.createname!=this.$status.userInfo.cname){
        this.notice="非制单人不能删除....";    
        return false;
      }
       this.notice="删除中....";     
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
            let r=response.data
            let isExists=false
            for(let i=0;i<this.keysLocal;i++){
              if(this.keysLocal[i]==Number(file.ID)) {
                this.keysLocal[i]=Number(this.keysLocal[i])*-1
                isExists=true
              }
            }
            if(!isExists){
              this.keysLocal.push(Number(file.ID)*-1)
            }

            this.notice="删除成功....";     
            if (r.errcode == 0) {                     
              resolve(true)
            } else {
              resolve(false)
            }            
          })
          .catch((error) => {
            this.notice="失败....";     
            reject(error);
          }); 
      });     
    },
  
    handleSelect(index) {
      if (index == "close") {
        // console.log(1);
        this.active = "";
        this.closeModal();
      }
    },

    // choiceImg() {
    //   this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
    // },
    // getImgList(img) {
    //   //只有一张
    //   let arr = [];
    //   arr.push(img.URLAddress);
    //   return arr;
    // },   
    uploadImg(e) {
      // console.log(this.imgList);
      this.notice="上传中....";      
      if (Array.isArray(e)) {
        e.forEach((item) => {
          //param.append("file", item.file, item.file.name); // 通过append向form对象添加数据
         new Compressor(item.file, {
              quality: 0.6, // 压缩质量 可以查看文档获取明细
              success:(result) =>{ 
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
                            this.tableid+"&createname="+this.$status.userInfo.cname
                        ),
                      // APIUTLFile +
                      //   "?serviceGotoUrl=tm.lilang&groupid="+this.groupid+"&tableid="+this.tableid+"&WXOpenID=oploGjw7dgERs2FLFvG2qvjwzt90",
                      param
                    )
                    .then((response) => {
                      // console.log(response.data)
                      if (response.data.errcode == 0) {
                        this.notice=this.notice.replace("上传中....","")+item.file.name+"上传成功,";
                        //if (this.tableid == 0) {
                          this.keysLocal =
                            (this.keysLocal &&
                              this.keysLocal.concat(response.data.data.split(","))) ||
                            response.data.data.split(",");
                        //} else {
                          //this.search();
                        //}
                      } else {
                        this.notice=response.data.errmsg;
                      }
                    });                    
              },
              error(err) {   
                console.log("Compressor",err)            
              }
          });          
        });
      } else {
        //param.append("file", e.file, e.file.name); // 通过append向form对象添加数据
        // 开始压缩
       new Compressor(e.file, {
            quality: 0.6, // 压缩质量 可以查看文档获取明细
            success:(result)=> { 
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
                          this.tableid+"&createname="+this.$status.userInfo.cname
                      ),
                    // APIUTLFile +
                    //   "?serviceGotoUrl=tm.lilang&groupid="+this.groupid+"&tableid="+this.tableid+"&WXOpenID=oploGjw7dgERs2FLFvG2qvjwzt90",
                    param
                  )
                  .then((response) => {
                    // console.log(response.data)
                    if (response.data.errcode == 0) {
                      this.notice=e.file.name+"上传成功";
                      //if (this.tableid == 0) {
                        this.keysLocal =
                          (this.keysLocal &&
                            this.keysLocal.concat(response.data.data.split(","))) ||
                          response.data.data.split(",");
                      //} else {
                        //this.search();
                      //}
                    } else {
                      this.notice=response.data.errmsg;
                    }
                  });                
            },
            error(err) {      
              console.log("Compressor",err)                     
            }
        });

      }
    

    },
    search() {
      // console.log(this.tableid)            
      let action = "getImgage";
      if (this.tableid == 0) {
        action = "getImgageKeys";
      }
      // console.log(this.keysLocal);
      this.$axios
        .get(APIUTL, {
          params: {
            action: action,
            tableid: this.tableid,
            groupid: this.groupid,
            keys: this.keysLocal.join(","),
          },
        })
        .then((response)=> {
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
            }
          }else{
            
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeModal(e) {
      // console.log(this.keysLocal)
      this.$emit("update:visible", false); // 传递关闭事件
      this.$emit("update:keys", this.keysLocal);
    },
  },
  created() {
    this.init();
  },
  watch: {
    visible(newValue, oldvalue) {
      // console.warn("visible", newValue, oldvalue);
      if (newValue) {
        this.init();
        this.notice="";
      }
    },
  },
};
</script>

<style scoped>
.wrap {
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>
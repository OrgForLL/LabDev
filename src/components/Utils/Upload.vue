<template>

  <div class="pop-up" id="up-pup" v-if="visible">
 
    <div style="text-align:right;margin:20px 20px 10px 0px ;">    
        <input type="file" name="file" ref="filElem" class="upload" style='display:none' multiple @change="uploadImg" />                                   
      <el-button  v-if="qx" type="primary" @click="choiceImg">上传</el-button>        
      <el-button type="primary" @click="closeModal">关闭</el-button>
    </div>

    <el-image
      v-for="(img,index) in imgList"
      :key="index"
      style="width: 100px; height: 100px;margin-left:10px;"
      :src="img.URLAddress"
      :preview-src-list="getImgList(img)"
    ></el-image>

  </div>
</template>

<script>
import EXIF from "exif-js";
export default {
  name: "Upload",
  props: {
    groupid: Number,
    tableid: Number,
    visible: {
      type: Boolean,
      default: false
    },
    qx: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {    
      imgList: [],

    };
  },
  methods: {    
    init() {
      if (this.visible) this.search();
    },
    choiceImg(){
        this.$refs.filElem.dispatchEvent(new MouseEvent('click')) 
    },    
    getImgList(img) {
      //只有一张
      let arr = [];
      arr.push(img.URLAddress);
      return arr;
    },
    uploadImg(e) {
      let that =this;
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      for (var i = 0; i < e.target.files.length; i++) {
        let param = new FormData(); // 创建form对象
        let file = e.target.files[i];
        //解决ios拍照照片自动旋转问题
        getOrientation(file, (orientation)=> {
          console.log(this,orientation);
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (evt)=> {
            const base64 = evt.target.result;
            // 将图片旋转到正确的角度 并压缩
            resetOrientation(base64, orientation, (resultBase64)=> {
              b64toBlob(resultBase64, (blob)=> {
                param.append("file", blob, file.name); // 通过append向form对象添加数据
              
                //调用接口上传图片
                return registerFace(param, config).then(
                  res => {if (res == "ok") that.$message(file.name + "上传成功");             // 上传成功逻辑 
                  },(err) => {console.log(err)});
              });
            });
          };
        });
      }
      function registerFace(param, config) {
        return new Promise(function(resolve, reject) {
          that.$axiosPost           
            .post(APIUTLFile + "?serviceGotoUrl="+
            encodeURIComponent(NetUrlUpload + "service/HttpRequestSkill.ashx?groupid="
            +that.groupid+"&tableid="
            +that.tableid), param)
            .then(function(response) {
              if (response.data.errcode == 0) {
                that.search();
                resolve("ok");
              } else {
                reject(response);                
              }
            });         
        }).catch((e) => {}); 
      }
      //  获取图片的角度
      function getOrientation(file, callback) {
        EXIF.getData(file, function() {
          var orientation = EXIF.getTag(this, "Orientation");
          console.log(orientation)
          return callback(orientation);
        });
      }
      function b64toBlob(b64, onsuccess, onerror) {
        let img = new Image();
        img.onerror = onerror;
        img.onload = function onload() {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          let width = img.width;
          let height = img.height;
          let ctx = canvas.getContext("2d");
          let rate = 1;
          ctx.drawImage(
            img,
            0,
            0,
            width,
            height,
            0,
            0,
            width * rate,
            height * rate
          );
          canvas.toBlob(onsuccess);
        };
        img.src = b64;
      }
      function resetOrientation(srcBase64, srcOrientation, callback) {
        const img = new Image();
        img.onload = function() {
          const width = img.width,
            height = img.height,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
          // 判断图片尺寸压缩一定比率
          const big = img.width > img.height ? img.width : img.height;
          let rate = 1;
          if (big > 840) {
            rate = 840 / big;
          }
          canvas.width = width * rate;
          canvas.height = height * rate;
          // 安卓机不需要矫正图片
           console.log(srcOrientation);
          if (srcOrientation && srcOrientation !== 1) {
            console.log(srcOrientation);
            // 判断图片方向，压缩并矫正
            switch (srcOrientation) {
              // 当图片旋转180°时
              case 3:
                ctx.rotate(Math.PI);
                ctx.drawImage(
                  this,
                  -this.width * rate,
                  -this.height * rate,
                  this.width * rate,
                  this.height * rate
                );
                break;
              // 当图片旋转90°时
              case 6:
                canvas.width = this.height * rate;
                canvas.height = this.width * rate;
                ctx.rotate(Math.PI / 2);
                // (0,-imgHeight) 从旋转原理图那里获得的起始点
                ctx.drawImage(
                  this,
                  0,
                  -this.height * rate,
                  this.width * rate,
                  this.height * rate
                );
                break;
              // 当图片旋转270°时
              case 8:
                canvas.width = this.height * rate;
                canvas.height = this.width * rate;
                ctx.rotate((3 * Math.PI) / 2);
                ctx.drawImage(
                  this,
                  -this.width * rate,
                  0,
                  this.width * rate,
                  this.height * rate
                );
                break;
              default:
                ctx.drawImage(
                  img,
                  0,
                  0,
                  width,
                  height,
                  0,
                  0,
                  width * rate,
                  height * rate
                );
            }
          } else {
            ctx.drawImage(
              img,
              0,
              0,
              width,
              height,
              0,
              0,
              width * rate,
              height * rate
            );
          }
          // 返回 base64
          callback(canvas.toDataURL("image/jpeg"));
        };
        img.src = srcBase64;
      }
    },
    search() {
      let that =this;
      this.$axios        
        .get(APIUTL, {
          params: {
            action: "getImgage",            
            tableid: this.tableid,
            groupid: this.groupid
          }
        })
        .then(function(response) {
          if (response.data.errcode == 0) {
            that.imgList = response.data.data;
            for (let item of that.imgList) {
              item.URLAddress = item.URLAddress.replace(
                "../",
                "http://webt.lilang.com:9001/"
              );
            }
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    closeModal(e) {
      this.$emit("update:visible", false); // 传递关闭事件
    }
  },
  created() {
    this.init();
  }, 
  watch: {
    visible(newValue, oldvalue) {     
      if (newValue) this.init();
    },    
  }
};
</script>

<style scoped>
 
#up-pup {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    margin-left: 0;
    margin-top: 0;
}
.pop-up {
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
    position: fixed;
    z-index: 999;
    min-width: 300px;
    min-height: 160px;
}
</style>
<template>
  <div class="face">
    <input type="file" name="file" class="upload" @change="uploadImg" />
    <span class="span-txt">开始认证</span>
  </div>
</template>

<script>
import EXIF from "exif-js";
export default {
  name: "UploadImg",
  data: function() {
    return {};
  },
  methods: {
    init: function(query) {},
    uploadImg: function(e) {
      let _this = this;
      const vm = this;
      let file = e.target.files[0];
      let param = new FormData(); // 创建form对象
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      //解决ios拍照照片自动旋转问题
      getOrientation(file, function(orientation) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(evt) {
          const base64 = evt.target.result;
          // 将图片旋转到正确的角度 并压缩
          resetOrientation(base64, orientation, function(resultBase64) {
            b64toBlob(resultBase64, function(blob) {
                console.log(file);
              param.append("file", blob,file.name); // 通过append向form对象添加数据
              param.append("file", blob,"A"+file.name);
              //param.append("file2", blob); // 通过append向form对象添加数据
              //调用接口上传图片
              return registerFace(param, config).then(res => {
                console.log("S1" + res);
                // 上传成功逻辑
              });
            });
          });
        };
      });
      function registerFace(param, config) {
        console.log(param);
        console.log(config);      
        _this.$axiosPost
          //.post(APIUTL + "/labaddfile", param)
          .post(APIUTL + "?action=labaddfile", param)
          .then(function(response) {});
        return new Promise(function(resolve, reject) {
          resolve(); // 将状态修改为成功
          //reject(); // 将状态修改为失败
        });
      }
      //  获取图片的角度
      function getOrientation(file, callback) {
        EXIF.getData(file, function() {
          var orientation = EXIF.getTag(this, "Orientation");
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
          if (srcOrientation && srcOrientation !== 1) {
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
    }
  }
};
</script>

<style scoped>
.face {
  margin-top: 20px;
  position: relative;
}
.face .upload {
  width: calc(100% - 40px);
  height: 43px;
  line-height: 43px;
  opacity: 0;
  position: absolute;
  z-index: 22;
  left: 0;
  margin: auto;
  right: 0;
}
.face .span-txt {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #ffffff;
  position: absolute;
  left: 0;
  margin: auto;
  right: 0;
  background: #cdab6a;
  width: calc(100% - 40px);
  height: 43px;
  line-height: 43px;
  border-radius: 4px;
  text-align: center;
}
</style>
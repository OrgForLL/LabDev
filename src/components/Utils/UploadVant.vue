<template>
  <div class="wrap" v-if="visible">
    <van-uploader
      style="margin-left: 5px"
      v-model="imgList"
      :disabled="!qx"
      multiple
      :deletable="false"
      :after-read="uploadImg"
    />

    <van-tabbar v-model="active" @change="handleSelect">
      <van-tabbar-item name="close" icon="certificate">关闭</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Uploader as VanUploader } from "vant";
import { Tabbar as VanTabbar } from "vant";
import { TabbarItem as VanTabbarItem } from "vant";
export default {
  name: "UploadVant",
  components: {
    VanUploader,
    VanTabbar,
    VanTabbarItem,
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
  },
  data: function () {
    return {
      active: "",
      keysLocal: this.keys,
      imgList: [
        // { url: "https://img01.yzcdn.cn/vant/leaf.jpg" },
        // // Uploader 根据文件后缀来判断是否为图片文件
        // // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: "https://cloud-image", isImage: true },
      ],
    };
  },
  methods: {
    init() {
      if (this.visible) this.search();
    },
    handleSelect(index) {
      if (index == "close") {
        console.log(1);
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
      console.log(this.imgList);
      let param = new FormData(); // 创建form对象
      if (Array.isArray(e)) {
        e.forEach((item) => {
          param.append("file", item.file, item.file.name); // 通过append向form对象添加数据
        });
      } else {
        param.append("file", e.file, e.file.name); // 通过append向form对象添加数据
      }
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
            if (this.tableid == 0) {
              this.keysLocal =
                (this.keysLocal &&
                  this.keysLocal.concat(response.data.data.split(","))) ||
                response.data.data.split(",");
            } else {
              this.search();
            }
          } else {
          }
        });
    },
    search() {
 
      let action = "getImgage";
      if (this.tableid == 0) {
        action = "getImgageKeys";
      }
      console.log(this.keysLocal);
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
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeModal(e) {
      this.$emit("update:visible", false); // 传递关闭事件
      this.$emit("update:keys", this.keysLocal);
    },
  },
  created() {
    this.init();
  },
  watch: {
    visible(newValue, oldvalue) {
      console.warn("visible", newValue, oldvalue);
      if (newValue) this.init();
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
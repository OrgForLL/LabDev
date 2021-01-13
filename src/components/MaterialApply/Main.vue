<template>
  <div class="wrap"> 
    <div style="margin-left: 10px; margin-right: 10px;margin-top:10px;" v-loading="loading" v-show="scanVisible">
      <van-cell-group>
        <van-field
          readonly
          clickable
          label="开发编号"
          :value="mdata.kfbh"
          placeholder="开发编号"
          @click="mdata.showKfbh = true"
        />
        <van-popup v-model="mdata.showKfbh" round position="bottom">
          <PickerSingle
            :model.sync="mdata.showKfbh"
            title="开发编号"
            type="devNumList"
            :inValue.sync="mdata.kfbhid"
            :inText.sync="mdata.kfbh"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          label="采购类别"
          :value="mdata.djlb"
          placeholder="采购类别"
          @click="mdata.showDjlb = true"
        />
        <van-popup v-model="mdata.showDjlb" round position="bottom">
          <PickerSingle
            :model.sync="mdata.showDjlb"
            title="采购类别"
            type="materialApplyDjlb"
            :inValue.sync="mdata.djlbid"
            :inText.sync="mdata.djlb"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          label="申请部门"
          :value="mdata.bm"
          placeholder="申请部门"
          @click="mdata.showBm = true"
        />
        <van-popup v-model="mdata.showBm" round position="bottom">
          <PickerSingle
            :model.sync="mdata.showBm"
            title="申请部门"
            type="materialApplyBm"
            :inValue.sync="mdata.bmid"
            :inText.sync="mdata.bm"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          label="设计风格"
          :value="mdata.xl"
          placeholder="设计风格"
          @click="mdata.showXl = true"
        />
        <van-popup v-model="mdata.showXl" round position="bottom">
          <PickerSingle
            :model.sync="mdata.showXl"
            title="设计风格"
            type="spfg"
            @goback="pickerSingleBack"
            :inValue.sync="mdata.xldm"
            :inText.sync="mdata.xl"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          label="项目经理"
          :value="mdata.xmjl"
          placeholder="项目经理"
          @click="mdata.showXmjl = true"
        />
        <van-popup v-model="mdata.showXmjl" round position="bottom">
          <PickerSingle
            :model.sync="mdata.showXmjl"
            title="项目经理"
            type="materialApplyXmjl"
            @goback="pickerSingleBack"
            :inValue.sync="mdata.xmjlid"
            :inText.sync="mdata.xmjl"
          />
        </van-popup>
      </van-cell-group>
      <van-collapse v-model="activeNames">
        <van-collapse-item
          v-for="(item, index) in mdata.detail"
          :key="index"
          :name="index"
        >
          <template #title>
            <van-row>
              <van-col span="20"
                ><div>
                  材料编号:{{ item.chdm }} 材料名称:{{ item.chmc }}
                </div></van-col
              >
              <van-col span="4">
                <van-button
                  icon="delete"
                  type="danger"
                  @click="itemRemove(item)"
                />
              </van-col>
            </van-row>
          </template>
          <div>
            <van-cell-group>
              <div>{{ item.khmc }}</div>
              <!-- 允许输入数字，调起带符号的纯数字键盘 -->
              <van-field v-model="item.sl" type="number" label="调样数量" />

              <van-field
                readonly
                clickable
                label="品类"
                :value="item.wgbs"
                placeholder="品类"
                @click="item.showWgbs = true"
              />
              <van-popup v-model="item.showWgbs" round position="bottom">
                <PickerSingle
                  :model.sync="item.showWgbs"
                  title="品类"
                  type="splb"
                  :inValue.sync="item.wgbsid"
                  :inText.sync="item.wgbs"
                  :inExtObj="{ query: 'yfdy' }"
                />
              </van-popup>

              <van-field
                readonly
                clickable
                label="颜色情况"
                :value="item.htid"
                placeholder="颜色情况"
                @click="item.showHtid = true"
              />
              <van-popup v-model="item.showHtid" round position="bottom">
                <PickerSingle
                  :model.sync="item.showHtid"
                  title="颜色情况"
                  type="materialApplyTypes"
                  :inValue.sync="item.htidid"
                  :inText.sync="item.htid"
                />
              </van-popup>

              <van-field v-model="item.zks" type="digit" label="标签数" />
            </van-cell-group>
          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
  
    <van-tabbar  v-model="active" @change="handleSelect"  >
      <van-tabbar-item name="add" icon="scan">添加</van-tabbar-item>
      <van-tabbar-item name="save" icon="certificate">保存</van-tabbar-item>
      <van-tabbar-item name="clear" icon="replay">清空</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import myStore from "@/components/Utils/Store";
import { Button as VanButton } from "vant";
import { Tabbar as VanTabbar } from "vant";
import { TabbarItem as VanTabbarItem } from "vant";
import { Collapse as VanCollapse } from "vant";
import { CollapseItem as VanCollapseItem } from "vant";
import { Field as VanField } from "vant";
import { Popup as VanPopup } from "vant";
import { Col as VanCol } from "vant";
import { Row as VanRow } from "vant";
import { Icon as VanIcon } from "vant";
export default {
  name: "MaterialApply",
  components: {
    Detail: () => import("@/components/ProcessControl/Detail"),
    PickerSingle: () => import("@/components/Utils/PickerSingle"),
    VanButton,
    VanTabbar,
    VanTabbarItem,
    VanCollapse,
    VanCollapseItem,
    VanField,
    VanPopup,
    VanCol,
    VanRow,
    VanIcon,
  },
  data: function () {
    return {
  
      active: "",
      activeNames: [0],
      mdata: {
        kfbh: "", //g开发编号
        kfbhid: 0, //开发编号
        showKfbh: false, //开发编号
        djlb: "", //采购类别
        djlbid: 0, //采购类别
        showDjlb: false, //采购类别
        xmjl: "", //项目经理
        xmjlid: 0, //项目经理
        fgid: 0, //项目经理对应的风格
        showXmjl: false, //项目经理
        bm: "", //申请部门
        bmid: 0, //申请部门
        showBm: false, //申请部门
        xl: "", //成衣设计风格
        xldm: "", //成衣设计风格
        xlid: 0, //成衣设计风格
        showXl: false, //

        detail: [
          // {
          //     chdm:"tst1",
          //     chmc:"asdfasdfasdf",
          //     sl:12,
          //     lymxid:0,kfbhdm:'', id:0,
          //     wgbs:"牛仔裤（夏）",//品类
          //     wgbsid:6382,//品类
          //     showWgbs:false,
          //     htid:"加色",//颜色情况
          //     htidid:2,//颜色情况
          //     showHtid:false,//颜色情况
          //     khid:0,//供应商
          //     khmc:"",//供应商
          //     zks:"",//标签数量
          // },
          //           {
          //     chdm:"tst1",
          //     chmc:"asdfasdfasdf",
          //     sl:12,
          //     lymxid:0,kfbhdm:'', id:0,
          //     wgbs:"牛仔裤（夏）",//品类
          //     wgbsid:6382,//品类
          //     showWgbs:false,
          //     htid:"加色",//颜色情况
          //     htidid:2,//颜色情况
          //     showHtid:false,//颜色情况
          //     khid:0,//供应商
          //     khmc:"",//供应商
          //     zks:"",//标签数量
          // },
          //           {
          //     chdm:"tst1",
          //     chmc:"asdfasdfasdf",
          //     sl:12,
          //     lymxid:0,kfbhdm:'', id:0,
          //     wgbs:"牛仔裤（夏）",//品类
          //     wgbsid:6382,//品类
          //     showWgbs:false,
          //     htid:"加色",//颜色情况
          //     htidid:2,//颜色情况
          //     showHtid:false,//颜色情况
          //     khid:0,//供应商
          //     khmc:"",//供应商
          //     zks:"",//标签数量
          // },
        
        ],
      },
      loading: false,

      scanVisible: true, //是否隐藏
    };
  },
  methods: {
    init() {
      llApp.init();
    },
    pickerSingleBack(type, mark, obj) {
      if (type == "materialApplyXmjl") {
        //项目经理
        this.mdata.fgid = obj.fgid;
      } else if (type == "spfg") {
        this.mdata.xlid = obj.id;
        console.log(this.mdata.xlid);
      }
    },
    handleSelect(index) {
      if (index == "add") {
        if (process.env.type == "231") this.search("F1810004201");
        else this.scan();
      } else if (index == "save") {
        this.save();
      } else if (index == "clear") {
        this.clear();
      }
    },
    search(chdm) {
      this.loading = true;

      this.searchPromise(chdm)
        .then((result) => {
          if (result.errcode != 0) {
            this.errMsg(result.errmsg)            
            this.loading = false;
            return;
          }

          let addItem = {};
          let data = result.data[0][0];
          for (let i = 0; i < this.mdata.detail.length; i++) {
            if (this.mdata.detail[i].khid != data.khid) {
              this.errMsg('供应商不一致')              
              this.loading = false;
              return;
            }

            if (this.mdata.detail[i].chmc == data.mlbh && process.env.type != "231") {
              this.errMsg("此材料已经扫描")              
              this.loading = false;
              return;
            }
          }

          addItem.chdm = data.llyphh;
          addItem.chmc = data.mlbh;
          addItem.khid = data.khid;
          addItem.khmc = data.sydw;
          addItem.lymxid = data.lymxid;
          addItem.id = data.id;
          addItem.zks = 0; //先默认,后端空串的时候会报错
          addItem.kfbhdm = data.kfbhdm;
          addItem.showWgbs = false; //一定要默认false不然会有异常,点不出来
          addItem.showHtid = false; //一定要默认false不然会有异常,点不出来
          this.mdata.detail.unshift(addItem);
          this.loading = false;

          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        })
        .catch((error) => {
          this.errmsg(error)        
          this.loading = false;
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        }); //测试用
    },
    searchPromise(chdm) {
      return new Promise((resolve, reject) => {
        this.$axios
          .get(APIUTL, {
            params: {
              action: "getMaterialApplyList",
              chdm: chdm,
            },
          })
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    scan() {
      llApp.scanQRCode((result) => {
        this.active = "";
        let chdm = "";
        if (result.split(":")[0] == "chdm") {
          chdm = result.split(":")[1];
        } else {
          this.errMsg("标签不对")          
          return false;
        }
        this.search(chdm);
      });
    },
    clear() {
      this.mdata.detail = [];
    },
    itemRemove(item) {
      //表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
      this.mdata.detail.splice(this.mdata.detail.indexOf(item), 1);
      return;
    },
    save() {
      let dataObj = {};
      dataObj.dataList = new Array();
      dataObj.kfbh = this.mdata.kfbhid;

      let zbObj = {};
      let mxObj = [];
      zbObj.kfbhid = this.mdata.kfbhid;
      zbObj.xlid = this.mdata.xlid;
      zbObj.cname = myStore.userInfo.cname;
      zbObj.xmjl = this.mdata.xmjl;
      zbObj.bmid = this.mdata.bmid;
      zbObj.djlbid = this.mdata.djlbid;
      if (this.mdata.djlbid == 0) {
        this.errMsg("请选择采购类别");
        this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        return;
      }

      if (this.mdata.kfbhid == 0) {
        this.errMsg("开发编号一定要填写");
        this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        return;
      }
      if (this.mdata.detail.length == 0) {
        this.errMsg("没有材料");
        this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        return;
      }
      let xmjl = "";
      if (this.mdata.bmid == 8563 || this.mdata.bmid == 8639) {
        if (this.mdata.xmjl.length == 0) {
          this.errMsg("请先填写项目经理");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return;
        }
      } else {
        xmjl = this.mdata.xmjl || myStore.userInfo.cname;
      }
      console.log(myStore.userInfo);
      if (
        this.mdata.xlid != 16902 &&
        this.mdata.xlid != 16679 &&
        this.mdata.xlid != 8985 &&
        this.mdata.xlid != 8984
      ) {
        //概念款 也放开
        if (
          (this.mdata.bmid == 8563 || this.mdata.bmid == 8639) &&
          this.mdata.fgid != this.mdata.xlid
        ) {
          // 如果是商品中心调样,或国际部调样需要控制 16902线上快返大家都能选16679鞋事业部，大家都选,定制也放开
          this.errMsg("成衣设计风格选择有误");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return false;
        }
      }

      let khid = 0;
      let isFL = false;
      for (var i = 0; i < this.mdata.detail.length; i++) {
        let mxTemp = {};
        khid = khid || this.mdata.detail[i].khid;
        if (khid != this.mdata.detail[i].khid) {
          this.errMsg("选择的供应商必须一致");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return false;
        }
        zbObj.khid = khid;
        mxTemp.id = this.mdata.detail[i].id;
        mxTemp.kfbhdm = this.mdata.detail[i].kfbhdm;
        mxTemp.lymxid = this.mdata.detail[i].lymxid;
        mxTemp.wgbsid = this.mdata.detail[i].wgbsid;
        mxTemp.htidid = this.mdata.detail[i].htidid;
        mxTemp.sl = this.mdata.detail[i].sl;
        mxTemp.chdm = this.mdata.detail[i].chdm;
        mxTemp.chmc = this.mdata.detail[i].chmc;
        mxTemp.zks = this.mdata.detail[i].zks;
        let sphhObj = {};
        sphhObj.chdm = this.mdata.detail[i].chdm;
        console.log(sphhObj);
        dataObj.dataList.push(sphhObj);
        if (!this.mdata.detail[i].zks && this.mdata.djlbid == 7748) {
          //面料才控制
          this.errMsg("请正确填写标签数量");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return false;
        }
        if (!this.mdata.detail[i].sl) {
          //面料才控制
          this.errMsg("请正确填写数量");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return false;
        }
        if (!this.mdata.detail[i].wgbsid) {
          this.errMsg("请选择好品类");
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          return false;
        }
        isFL = isFL || this.mdata.detail[i].lymxid != 9114;
        mxObj.push(mxTemp);
      }
      console.log(isFL, this.mdata.djlbid);
      if (isFL && this.mdata.djlbid == 7748) {
        this.errMsg("辅料的采购类别不能选择[面料申购]");
        this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        return false;
      }

      this.lbCheckPromise(dataObj)
        .then((result) => {
          console.log(result);
          if (result.data == "ok") {
            this.savePromise(zbObj, mxObj)
              .then((r) => {
                if (r.errcode == 0) {
                  this.$message("保存成功");
                  this.clear();
                } else {
                  this.errMsg(r.errmsg);
                }
                this.active = "";
              })
              .catch((e) => {
                this.active = "";
              });
          } else {
            let r = eval("(" + result + ")");
            let errorList = new Array();
            for (let o in r.msg) {
              errorList.push(
                "大类:" + r.msg[o].wllb + "材料:" + r.msg[o].chdm + "\r\n"
              );
            }
            this.errMsg(
              "下列材料不在方案内:" + errorList.join(",") + "\r\n请联系商控部."
            );
            this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
          }
        })
        .catch((err) => {
          console.log(err);
          this.active = ""; //不让下面的菜单选中,默认会选中再点的时候不会触发事件
        });
      //save ---end
    },

    savePromise(zbObj, mxObj) {
      return new Promise((resolve, reject) => {
        this.$axiosPost
          .post(APIUTL + "?action=SaveMaterialApply", [zbObj, mxObj])
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    lbCheckPromise(dataObj) {
      return new Promise((resolve, reject) => {
        let param = new URLSearchParams();
        param.append("from", JSON.stringify(dataObj));
        this.$axios
          .post(
            APIUTL +
              "?serviceGotoUrl=" +
              NetUrlUpload +
              "tl_yf/yf_sys_ajax_handle.ashx&from=BID.3695&tag=check" +
              "&serviceGoto=.net&encoding=gb2312&userssid=1&userid=" +
              myStore.userInfo.userid,
            param
          )
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
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
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>
 
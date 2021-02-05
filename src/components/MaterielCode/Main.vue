<template>
  <div class="wrap">
    <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <van-nav-bar
        title="物料编码"
        :left-text="cname"
        :right-text="search.isml ? '面料编码' : '辅料编码'"
      >
      </van-nav-bar>
      <van-notice-bar
        wrapable     
        :scrollable="false"
        :text="saveErr"   
      />

      <van-popup
        v-model="search.filterModel"
        position="top"
        :style="{ height: '75%' }"
      >
        <van-field name="switch" :label="search.isml ? '面料' : '辅料'">
          <template #input>
            <van-switch v-model="search.isml" @click="mlswitch" size="20" />
          </template>
        </van-field>

        <FieldPickerSingle
          title="开发编号"
          placeholder="请选择"
          :inValue.sync="search.kfbh"
          type="getDevNumList"
        />
        <van-field
          readonly
          clickable
          name="calendar"
          :value="search.ksrq"
          label="开始日期"
          placeholder="点击选择日期"
          @click="search.showCalendarStar = true"
        />
        <van-calendar
          :min-date="new Date(new Date().getFullYear() - 3, 0, 1)"
          v-model="search.showCalendarStar"
          @confirm="onCalendarStarConfirm"
        />

        <van-field
          readonly
          clickable
          name="calendar"
          :value="search.jsrq"
          label="结束日期"
          placeholder="点击选择日期"
          @click="search.showCalendarEnd = true"
        />

        <van-calendar
          v-model="search.showCalendarEnd"
          :min-date="new Date(new Date().getFullYear() - 3, 0, 1)"
          @confirm="onCalendarEndConfirm"
        />
        <van-field
          v-model="search.ghsmc"
          name="供应商"
          label="供应商"
          placeholder="供应商"
        />
        <van-field
          v-model="search.chdm"
          name="材料编码"
          label="材料编码"
          placeholder="材料编码"
        />
        <van-field
          v-model="search.mlbh"
          name="材料名称"
          label="材料名称"
          placeholder="材料名称"
        />

        <FieldPickerSingle
          title="编号状态"
          placeholder="请选择"
          :inValue.sync="search.myck"
          :dataSource="[
            { dm: 0, mc: '全部' },
            { dm: 1, mc: '已编' },
            { dm: 2, mc: '未编' },
          ]"
        />

        <van-field name="switch" label="只限调样已审">
          <template #input>
            <van-switch v-model="search.shbs" size="20" />
          </template>
        </van-field>

        <div style="text-align: right; margin-right: 30px">
          <van-notice-bar left-icon="volume-o" :text="errmsg" />

          <van-button size="small" @click="searchFun" type="primary"
            >查询</van-button
          >
          <van-button
            size="small"
            type="primary"
            @click="search.filterModel = false"
            >关闭</van-button
          >
        </div>
      </van-popup>
      <div v-for="(item, index) in mdata.list" :key="index" :name="index">
        <div
          class="van-doc-block__card"
          :class="[item.choose ? 'van-doc-block__card_choose' : '']"
        >
          <van-row>
            <van-col span="22">
              <van-row v-if="search.isml">
                <van-col span="10">{{ item.llyphh }}</van-col>
                <van-col span="14">{{ item.mlbhmc2 }}</van-col>
              </van-row>
              <van-row v-if="!search.isml">
                <van-col span="10">{{ item.llyphh }}</van-col>
                <van-col span="14">{{ item.mlbh }}</van-col>
              </van-row>
              <van-row>
                <van-col span="24">
                  {{ item.sydw }}
                </van-col>
              </van-row>
              <van-row v-if="search.isml">
                <van-col span="20">
                  {{ item.cfbl }}
                </van-col>
                <van-col span="4">
                  {{ item.dw }}
                </van-col>
              </van-row>
              <van-row v-if="search.isml">
                <van-col span="6">
                  {{ item.yplxmc }}
                </van-col>
                <van-col span="12">
                  {{ item.mllbmc }}
                </van-col>
                <van-col span="6">
                  {{ item.cwchlbmc }}
                </van-col>
              </van-row>

              <van-row v-if="!search.isml" type="flex" align="center">
                <van-col span="6">
                  {{ item.dw }}
                </van-col>
                <van-col span="6">
                  {{ item.yfdw }}
                </van-col>
                <van-col span="12">
                  <van-field
                    v-model="item.hsbl"
                    name="换算比例"
                    placeholder="换算比例"
                  />
                </van-col>
              </van-row>

              <van-row v-if="!search.isml">
                <van-col span="24">
                  {{ item.mllbmc }}
                </van-col>
              </van-row>
            </van-col>
            <van-col span="2">
              <van-checkbox
                :disabled="
                  (search.isml && (item.btx != '' ? true : false)) ||
                  (!search.isml &&
                    (item.chdmbs.length > 0 || item.llyphh.length == 0
                      ? true
                      : false))
                "
                v-model="item.choose"
              ></van-checkbox>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>

    <van-tabbar v-model="active" @change="handleSelect">
      <van-tabbar-item name="save" icon="certificate">保存</van-tabbar-item>
      <van-tabbar-item name="choose" icon="certificate">{{
        !allChoose ? "全选" : "取消"
      }}</van-tabbar-item>
      <van-tabbar-item name="search" icon="certificate">查询</van-tabbar-item>
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
import { Divider as VanDivider } from "vant";
import { NavBar as VanNavBar } from "vant";
import { NoticeBar as VanNoticeBar } from "vant";
import { Checkbox as VanCheckbox } from "vant";
import { Loading as VanLoading } from "vant";
import { Toast as VanToast } from "vant";
import { Switch as VanSwitch } from "vant";
export default {
  name: "MaterielCode",
  components: {
    FieldPickerSingle: () => import("@/components/Utils/FieldPickerSingle"),
    PickerSingle: () => import("@/components/Utils/PickerSingle"),
    PopupRowCol: () => import("@/components/Utils/PopupRowCol"),
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
    VanDivider,
    VanNavBar,
    VanNoticeBar,
    VanCheckbox,
    VanLoading,
    VanToast,
    VanSwitch,
  },
  data: function () {
    return {
      active: "",
      saveErr: "",
      activeNames: [0],

      allChoose: false,
      search: {
        isml: true,
        filterModel: true,
        ksrq: "",
        jsrq: "",
        ghsmc: "",
        chdm: "",
        mlbh: "",
        showCalendarStar: false,
        showCalendarEnd: false,
        kfbh: "",
        myck: 2,
        shbs: false,
      },
      mdata: {
        list: [],
      },

      userid: myStore.userInfo.userid,
      cname: myStore.userInfo.cname,
      errmsg: "",
    };
  },
  methods: {
    init() {},
    onCalendarStarConfirm(date) {
      this.search.ksrq = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      this.search.showCalendarStar = false;
    },
    onCalendarEndConfirm(date) {
      this.search.jsrq = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      this.search.showCalendarEnd = false;
    },
    handleSelect(index) {
      if (index == "save") {
        this.save();
      }
      if (index == "choose") {
        this.allChooseFun();
        this.active = "";
      }
      if (index == "search") {
        this.search.filterModel = true;
        this.active = "";
      }
    },
    allChooseFun() {
      if (this.allChoose) {
        this.allChoose = false;
        for (var i = 0; i < this.mdata.list.length; i++) {
          this.mdata.list[i].choose = false;
        }
      } else {
        this.allChoose = true;
        for (var i = 0; i < this.mdata.list.length; i++) {
          if (this.search.isml) {
            if (this.mdata.list[i].btx != "") {
            } else {
              this.mdata.list[i].choose = true;
            }
          } else {
            //辅料
            if (
              this.mdata.list[i].chdmbs.length > 0 ||
              this.mdata.list[i].llyphh.length == 0
            ) {
            } else {
              this.mdata.list[i].choose = true;
            }
          }
        }
      }
    },
    itemClick(item) {
      item.choose = !item.choose;
    },
    mlswitch() {
      this.mdata.list.splice(0, this.mdata.list.length);
    },
    searchFun() {
      if (
        this.search.ksrq.length == 0 &&
        this.search.jsrq.length == 0 &&
        this.search.chdm.length == 0 &&
        this.search.ghsmc.length == 0 &&
        this.search.kfbh.length == 0 &&
        this.search.mlbh.length == 0
      ) {
        this.errmsg = "请选择条件";
        return false;
      }
      this.search.filterModel = false;

      VanToast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true,
      });

      this.allChoose = false;
      this.searchPromise()
        .then((r) => {
          if (r.errcode == 0) {
            let data = r.data[0];
            for (var i = 0; i < data.length; i++) {
              if (data[i].btx == null) {
                data[i].btx = "";
              }
              if (data[i].tpname == null) {
                data[i].tpname = "";
              }
              if (data[i].hsbl == null || data[i].hsbl == 0) {
                data[i].hsbl = "";
              }
              data[i].choose = false;
            }
            this.mdata.list = data.slice(0, 100);
            VanToast.clear();
          } else {
            VanToast.fail(r.errmsg);
          }
        })
        .catch((e) => {
          VanToast.fail(e);
        });
    },

    searchPromise() {
      let param = {};
      param.ksrq = this.search.ksrq;
      param.jsrq = this.search.jsrq;
      param.mlbh = this.search.mlbh;
      param.chdm = this.search.chdm;
      param.myck = this.search.myck;
      param.shbs = this.search.shbs ? 1 : 0;
      param.ghsmc = this.search.ghsmc;
      param.kfbh = this.search.kfbh;
      param.isml = this.search.isml;

      return new Promise((resolve, reject) => {
        this.$axiosPost
          .post(
            APIUTL + "?serviceName=svr-financia-management&action=MaterielCode",
            param
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    save() {
      let param = {};
      param.data = [];
      this.saveErr = "";
      if (this.search.isml) {
        let xjchlbidCK = [];
        let hsblCK = [];
        let sjchlbidCK = [];
        let ysCK = [];

        for (var i = 0; i < this.mdata.list.length; i++) {
          if (this.mdata.list[i].choose == false) continue;
          param.data.push(this.mdata.list[i]);
          if (!this.mdata.list[i].xjchlbid) {
            xjchlbidCK.push(this.mdata.list[i].mlbhmc2);
          }

          if (!this.mdata.list[i].hsbl) {
            hsblCK.push(this.mdata.list[i].mlbhmc2);
          }
          if (!this.mdata.list[i].sjchlbid) {
            sjchlbidCK.push(this.mdata.list[i].mlbhmc2);
          }

          if (!this.mdata.list[i].ysid) {
            ysCK.push(this.mdata.list[i].mlbhmc2);
          }
        }
        if (
          xjchlbidCK.length > 0 ||
          hsblCK.length > 0 ||
          sjchlbidCK.length > 0 ||
          ysCK.length > 0
        ) {
          this.active = "";
      
          if (xjchlbidCK.length > 0)
            this.saveErr += "大小类有问题:" + xjchlbidCK.join(",");
          if (hsblCK.length > 0)
            this.saveErr += "换算比例有问题:" + hsblCK.join(",");
          if (sjchlbidCK.length > 0)
            this.saveErr += "大类有问题:" + sjchlbidCK.join(",");
          if (ysCK.length > 0)
            this.saveErr += "颜色有问题:" + ysCK.join(",");
          return false;
        }
      } else {
       
        let shblCK = [];
        let hsblCK = [];
        let sjchlbidCK = [];
        let ysCK = [];
        for (var i = 0; i < this.mdata.list.length; i++) {
          if (this.mdata.list[i].choose == false) continue;
           param.data.push(this.mdata.list[i]);
          if (Number(this.mdata.list[i].shbl)!=0) {             
            shblCK.push(this.mdata.list[i].mlbh);
          }
          if (!this.mdata.list[i].hsbl) {
           
            hsblCK.push(this.mdata.list[i].mlbh);
          }

          if (Number(this.mdata.list[i].sjchlbid) == 0) {
            sjchlbidCK.push(this.mdata.list[i].mlbh);
          }
          if (!this.mdata.list[i].ysid) {
            ysCK.push(this.mdata.list[i].mlbh);
          }
        }

        if (
          shblCK.length > 0 ||
          hsblCK.length > 0 ||
          sjchlbidCK.length > 0 ||
          ysCK.length > 0
        ) {
          this.active = "";
          
          if (shblCK.length > 0)
            this.saveErr += "损耗比例有问题:" + shblCK.join(",");
          if (hsblCK.length > 0)
            this.saveErr += "换算比例有问题:" + hsblCK.join(",");
          if (sjchlbidCK.length > 0)
            this.saveErr += "大类有问题:" + sjchlbidCK.join(",");
          if (ysCK.length > 0)
            this.saveErr += "颜色有问题:" + ysCK.join(",");         
          return false;
        }
      }
      param.userssid = 1;
      param.username = myStore.userInfo.cname;
      param.userid = this.userid;
      param.isml = this.search.isml;
      VanToast.loading({
        duration: 0,
        message: "加载中...",
        forbidClick: true,
      });
      this.savePromise(param)
        .then((r) => {
          if (r.errcode == 0) {
            //this.$message("保存成功");
            //VanToast.clear();
            let okList=[];
            let errList=[];
            for(var i=0;i<r.data.length;i++){
              let item=r.data[i];
              if(item.errcode==0){
                okList.push(item.data.llyphh);
              }else{
                errList.push(item.data.llyphh);
              }
            }
            this.saveErr = (okList.length>0?"成功"+okList.join(","):"")+(errList.length>0?"失败:"+errList.join(","):"");
            VanToast.clear();
            this.searchFun();
          } else {
            VanToast.fail(r.errmsg);
          }
          this.active = "";
        })
        .catch((e) => {
          this.active = "";
          VanToast.fail(e);
        });
    },

    savePromise(param) {
      return new Promise((resolve, reject) => {
        this.$axiosPost
          .post(
            APIUTL +
              "?serviceName=svr-financia-management&action=MaterielCode/save",
            param,
            {timeout: 600*1000}
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
  mounted() {},
  watch: {},
  computed: {},
  created() {
    llApp.init();
    this.init();
  },
};
</script>

<style scoped>
.wrap {
  height: calc(100% - 50px);
  overflow-y: auto;
}
.van-doc-block__card {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 20px;
  box-shadow: 0px 0px 10px 1px rgb(210 202 202 / 50%);
  font-size: 13px;
}
.van-doc-block__card_choose {
  border-color: #21c354;
}
</style>

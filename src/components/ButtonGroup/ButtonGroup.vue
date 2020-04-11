<template>
  <div id="ButtonGroup">
    <el-menu
      default-active
      class="el-menu-demo"
      background-color="#545c64"
      mode="horizontal"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <span class="menu-title">LiLanz</span>
      <el-button class="menu-item" @click="My_Close()">关闭</el-button>
      <el-button class="menu-item" :disabled="ableSave" @click="My_Save()">保存</el-button>
      <el-button class="menu-item" @click="My_Change()">{{ partText }}</el-button>
      <el-button class="menu-item" v-show="canDel" @click="My_Del()">删除</el-button>
      <!--<el-button id="mytd_button_办理" class="menu-item menu-item-flow" @click="flowSend()">办理</el-button>
      <el-button id="mytd_button_转办" class="menu-item menu-item-flow" @click="flowChange()">转办</el-button>
      <el-button id="mytd_button_退办" class="menu-item menu-item-flow" @click="flowReturn()">退办</el-button>
      <el-button id="mytd_button_撤办" class="menu-item menu-item-flow" @click="flowDrawn()">撤办</el-button>
      <el-button id="mytd_button_终审" class="menu-item menu-item-flow" @click="flowEnd()">终审</el-button>
      <el-button id="mytd_button_弃审" class="menu-item menu-item-flow" @click="flowCancel()">弃审</el-button>
      <el-button id="mytd_button_取消申报" class="menu-item menu-item-flow" @click="flowClear()">取消申报</el-button>-->
    </el-menu>
  </div>
</template>

<script>
import { flow_send } from "flow";
import { flow_ButtonQx } from "flow";
export default {
  name: "ButtonGroup",
  props: {
    canSave: Boolean,
    canDel: Boolean,
    mainData: Object,
    isPart: Boolean
  },
  data: function() {
    return {
      partText: "加工",
      ableSave: false,
      MyForm: {
        flowdxid: "",
        flowDocid: "",
        flowflag: "",
        flowuserid: "",
        TLsoft_menuid: "",
        MySession: "",
        flowdxlx: ""
      },
      flowSession: {
        tzid: 1,
        dxtzid: 1,
        userid: "",
        username: ""
      }
    };
  },
  methods: {
    init: function() {
      if (this.mainData.myDJid == 0) {
        return;
      }
      let _this = this;
      _this.$axios
        .get(APIUTL, {
          params: {
            action: "getFlowInfo",
            id: _this.mainData.myDJid,
            userid: _this.mainData.creatorID
          }
        })
        .then(function(response) {
          if (response.data.errcode == 5010) {
            _this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: "error"
            });
            return;
          }
          // console.log(response.data.data)
          _this.setMyForm(response.data.data);
          _this.setFlowSession(response.data.data);
          flow_ButtonQx(_this.MyForm, _this.flowSession);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    My_Save: function() {
      this.$emit("save");
    },
    My_Del: function() {
      this.$emit("del");
    },
    My_Change: function() {
      this.$emit("change");
    },
    My_Close: function() {
      window.close();
      // window.parent.close();
      var userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("Firefox") != -1 ||
        userAgent.indexOf("Chrome") != -1
      ) {
        window.location.href = "about:blank";
      } else if (
        userAgent.indexOf("Android") > -1 ||
        userAgent.indexOf("Linux") > -1
      ) {
        window.opener = null;
        window.open("about:blank", "_self", "").close();
      } else {
        // window.pener = null;
        // window.open("about:blank", "_self");
        //window.close();
      }
    },
    flowSend: function() {
      // flow_send();
    },
    flowChange: function() {
      // flow_cghsend();
    },
    flowReturn: function() {
      // flow_return();
    },
    flowDrawn: function() {
      // flow_drawn();
    },
    flowEnd: function() {
      // flow_end();
    },
    flowCancel: function() {
      // flow_cancel();
    },
    flowClear: function() {
      // flow_clear();
    },
    setMyForm: function(data) {
      this.MyForm.flowdxid = data.id;
      this.MyForm.flowDocid = data.docid;
      this.MyForm.flowflag = data.flag;
      this.MyForm.flowuserid = data.userid;
      this.MyForm.TLsoft_menuid = "TLsoft_menuid";
      this.MyForm.MySession = "MySession";
      this.MyForm.flowdxlx = data.dxlx;
    },
    setFlowSession: function(data) {
      this.flowSession.tzid = 1;
      this.flowSession.dxtzid = 1;
      this.flowSession.userid = this.mainData.creatorID;
      this.flowSession.username = data.zdr;
    },
    setAbleSave: function(flag){
      this.ableSave = flag;
    }
  },
  watch: {
    isPart: function() {
      if (this.isPart) {
        this.partText = "加工";
      } else {
        this.partText = "成品";
      }
    }
  },
  mounted: function() {
    // this.init();
  }
};
</script>

<style scoped>
.menu-title {
  height: 60px;
  line-height: 60px;
  margin: 0px;
  color: rgb(255, 255, 255);
}
.el-menu-demo {
  padding-left: 55px;
  padding-right: 55px;
}
.menu-item {
  height: 60px;
  margin: 0px;
  background-color: #545c64;
  color: rgb(255, 255, 255);
  float: right;
  border: 0px;
}
.menu-item-flow {
  display: none;
}
.menu-item:hover {
  background-color: rgb(67, 74, 80);
}
</style>

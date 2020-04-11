<template>
  <div>
    <el-drawer
      id="zpInfo"
      title="针织坯布自主开发单"
      :before-close="handleClose"
      :visible.sync="zpDrawer"
      @open="getData"
      direction="rtl"
      size="70%"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" ref="form" :rules="rules" v-loading="loading" label-width="97px">
          <div class="my_form_top">
            <el-row>
              <el-col :span="5">
                <el-form-item label="季度">
                  <DevNumPicker :devNumTemp.sync="form.jd" :disabled="true"></DevNumPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="坯布供应商" prop="pbsupplierName">
                  <el-tooltip content="右键点击或者按下回车以选择供应商" placement="right">
                    <el-input
                      v-model="form.pbsupplierName"
                      size="mini"
                      @keydown.enter.native="showSupplierPicker('pb')"
                      @click.right.native.prevent="showSupplierPicker('pb')"
                      @blur="showSupplierPicker('pb')"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品针数(WPI)" prop="wpi">
                  <el-input v-model.number="form.wpi" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="制单人">
                  <el-input v-model="form.zdr" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="成衣品类">
                  <ClothTypesPicker :clothTypesTemp.sync="form.cypl"></ClothTypesPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="坯布编号">
                  <el-input
                    v-model="form.pbbh"
                    size="mini"
                    class="cursor-default"
                    :disabled="true"
                    readonly
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品针数(CPI)" prop="cpi">
                  <el-input v-model.number="form.cpi" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="制单日期">
                  <el-input v-model="form.zdrq" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="组织结构" prop="zzjg">
                  <el-input v-model="form.zzjg" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="坯布成份" prop="pbcf">
                  <el-input v-model="form.pbcf" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品幅宽(cm)" prop="fk">
                  <el-input v-model.number="form.fk" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="合作类型">
                  <el-select v-model="form.hzlx" placeholder="请选择" class="cell_select" size="mini">
                    <el-option
                      v-for="item in hzlx"
                      :key="item.dm"
                      :label="item.mc"
                      :value="item.dm"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="价格范围">
                  <el-input v-model="form.jgfw" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="坯布版单号">
                  <el-input v-model="getVersionNum" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品克重(g/m)" prop="kz">
                  <el-input v-model.number="form.kz" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <br />
          <el-row>
            <el-col :span="6">
              <table class="el-table">
                <thead>
                  <tr>
                    <th colspan="4">
                      <div class="cell">织造要求</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="cell cell-label">织造损耗(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zzsh" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell cell-label">单线圈长度(cm/100G)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.yq.dxqcd" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell cell-label">寸数/筒径(英寸)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.yq.cstj" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell cell-label">针数/机号(G/英寸)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.yq.zsjh" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-col>
            <el-col :span="6">
              <table class="el-table">
                <thead>
                  <tr>
                    <th colspan="4">
                      <div class="cell">纱比</div>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="isShowSb">
                  <tr v-for="(item, index) in form.sb" :key="index">
                    <td>
                      <el-input
                        v-model="item.bdh"
                        class="cursor-default"
                        style="width:100px"
                        :disabled="true"
                        :readonly="true"
                        size="mini"
                      ></el-input>
                    </td>
                    <td>
                      <el-input
                        v-model="item.yt"
                        class="cursor-default"
                        style="width:50px"
                        :disabled="true"
                        :readonly="true"
                        size="mini"
                      ></el-input>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="item.bl" :readonly="item.id == ''" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4" style="line-height: 111px;">纱线信息保存后显示</td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item
                label="纱线要求"
                label-width="94px"
                style="margin-top:2px; margin-bottom:2px"
              >
                <el-input type="textarea" :rows="4" v-model="form.sxyq" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item
                label="织造要求"
                label-width="94px"
                style="margin-top:2px; margin-bottom:2px"
                prop="zzyq"
              >
                <el-input type="textarea" :rows="3" v-model="form.zzyq" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="特别注意事项" label-width="94px" prop="tbzysx">
                <el-input type="textarea" :rows="3" v-model="form.tbzysx" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="13">
              <el-form-item label="计划完成时间" label-width="94px">
                <el-date-picker
                  v-model="form.jhwcsj"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  size="mini"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="closeWindows" size="mini">返 回</el-button>
          <el-button
            type="primary"
            :disabled="!canSave"
            @click="$refs.drawer.closeDrawer()"
            :loading="saveloading"
            size="mini"
          >{{ saveloading ? '提交中 ...' : '保 存' }}</el-button>
          <el-button
            type="danger"
            :disabled="!canDel"
            @click="My_Del"
            :loading="delloading"
            size="mini"
          >{{ delloading ? '删除中 ...' : '删除' }}</el-button>

          <!-- <el-button>
            <router-link target="_blank" :to="{path:'/dayinZp',query:{id:form.id,parentID:mainData.myDJid,userssid:mainData.creatorID}}">打印</router-link>
          </el-button> -->
          <el-button  @click="print" size="mini">打印
          </el-button>
        </div>
      </div>
    </el-drawer>
    <SupplierPicker ref="SupplierPicker" @selected="updateSupplier"></SupplierPicker>
  </div>
</template>

<script>
import SupplierPicker from "@/components/Utils/SupplierPicker.vue";
import ClothTypesPicker from "@/components/Utils/ClothTypesPicker.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";

export default {
  name: "zpInfo",
  components: {
    SupplierPicker,
    ClothTypesPicker,
    DevNumPicker
  },
  props: {
    mainData: Object,
    devNumTemp: String
  },
  data: function() {
    return {
      index: 0,
      canSave: true,
      canDel: true,
      zpDrawer: false,
      loading: false,
      saveloading: false,
      delloading: false,
      isShowSb: true,
      gx: {
        gxid: 0,
        gxlx: ""
      },
      form: {
        id: 0,
        isSingle: 0,
        djh: "",
        jd: this.devNumTemp,
        cypl: [],
        wpi: "",
        zdr: this.mainData.creator,
        pbsupplierId: "",
        pbsupplierName: "",
        cpi: "",
        zdrq: this.getDate(),
        pbcf: "",
        fk: "",
        zzjg: "",
        pbbdh: "保存后自动生成",
        pbbh: "",
        kz: "",
        jgfw: "",
        zzsh: "",
        yq: {
          dxqcd: "",
          zsjh: "",
          cstj: ""
        },
        yqid: {
          dxqcdid: 0,
          zsjhid: 0,
          cstjid: 0
        },
        sb: [],
        sxyq: "",
        zzyq: "",
        tbzysx: "",
        jhwcsj: "",
        hzlx: ""
      },
      hzlx: [],
      rules: {
        wpi: [
          { required: true, message: " ", trigger: "blur" },
          { type: "number", message: " ", trigger: "blur" }
        ],
        cpi: [
          { required: true, message: " ", trigger: "blur" },
          { type: "number", message: " ", trigger: "blur" }
        ],
        zzjg: [{ required: true, message: " ", trigger: "blur" }],
        pbcf: [{ required: true, message: " ", trigger: "blur" }],
        fk: [
          { required: true, message: " ", trigger: "blur" },
          { type: "number", message: " ", trigger: "blur" }
        ],
        kz: [
          { required: true, message: " ", trigger: "blur" },
          { type: "number", message: " ", trigger: "blur" }
        ],
        pbsupplierName: [{ required: true, message: " ", trigger: "blur" }],
        zzyq: [{ required: true, message: " ", trigger: "blur" }],
        tbzysx: [{ required: true, message: " ", trigger: "blur" }]
      }
    };
  },
  methods: {
    showSingle: function(id, gxlx) {
      this.init();
      this.clearData();
      this.form.id = id;
      this.gx.gxlx = gxlx;
      this.form.isSingle = 1;
      this.zpDrawer = true;
    },
    show: function(id, index, gxid, gxlx) {
      this.clearData();
      this.form.id = id;
      this.init();
      this.index = index;
      this.gx.gxid = gxid;
      this.gx.gxlx = gxlx;
      this.zpDrawer = true;
    },
    init: function() {
      this.canSave = true;
      if (this.form.id == 0) {
        this.canDel = false;
      }
      let _this = this;
      _this.$axios
        // .get(APIUTL + "/getPbInitData", {
        .get(APIUTL, {
          params: {
            action: "getPbInitData"
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
          _this.hzlx = response.data.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getData: function() {
      let _this = this;
      if (_this.form.id) {
        _this.loading = true;
        _this.canSave = false;
        _this.canDel = false;
        _this.$axios
          .get(APIUTL, {
            params: {
              action: "getZpInfo",
              id: _this.form.id,
              parentID: _this.mainData.myDJid
            }
          })
          .then(function(response) {
            _this.loading = false;
            _this.canSave = true;
            _this.canDel = true;
            if (response.data.errcode == 5010) {
              _this.$message({
                showClose: true,
                message: response.data.errmsg,
                type: "error"
              });
              return;
            }
            let isSingleTemp = _this.form.isSingle;
            _this.form = response.data.data;
            _this.canSave = _this.mainData.creator == _this.form.zdr;
            _this.canDel =
              _this.mainData.creator == _this.form.zdr && _this.form.id != 0;
            _this.form.isSingle = isSingleTemp;
            _this.isShowSb = _this.form.sb.length != 0;
            if (
              _this.gx.gxid != 0 &&
              _this.gx.gxid != "" &&
              _this.form.sb.length != 0
            ) {
              while (_this.form.sb.length < 4) {
                _this.form.sb.push({
                  bdh: "",
                  yt: "",
                  bl: "",
                  id: ""
                });
              }
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        setTimeout(() => {
          // 新增胚布取纱比
          if (_this.gx.gxid == 0 || _this.gx.gxid == "") {
            _this.$axios
              // .get(APIUTL + "/getSxRateData", {
              .get(APIUTL, {
                params: {
                  action: "getSxRateData",
                  id: _this.mainData.myDJid
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
                _this.form.sb = response.data.data["sb"];
                _this.form.sxyq = response.data.data["sxyq"];
                _this.isShowSb = _this.form.sb.length != 0;
                while (_this.form.sb.length < 4) {
                  _this.form.sb.push({
                    bdh: "",
                    yt: "",
                    bl: "",
                    id: ""
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        }, 0);
      }
    },
    clearData: function() {
      this.form = {
        id: 0,
        isSingle: 0,
        djh: "",
        jd: this.devNumTemp,
        cypl: [],
        wpi: "",
        zdr: this.mainData.creator,
        pbsupplierId: "",
        pbsupplierName: "",
        cpi: "",
        zdrq: this.getDate(),
        pbcf: "",
        fk: "",
        zzjg: "",
        pbbdh: "保存后自动生成",
        pbbh: "",
        kz: "",
        jgfw: "",
        zzsh: "",
        yq: {
          dxqcd: "",
          zsjh: "",
          cstj: ""
        },
        yqid: {
          dxqcdid: 0,
          zsjhid: 0,
          cstjid: 0
        },
        sb: [],
        sxyq: "",
        zzyq: "",
        tbzysx: "",
        jhwcsj: "",
        hzlx: ""
      };
    },
    handleClose(done) {
      if (!this.canSave && this.form.isSingle == 1) {
        this.closeWindows();
      }
      if (!this.canSave) {
        done();
        return;
      }
      if (!this.form.pbsupplierId) {
        this.$message({
          type: "error",
          message: "请选择一个有效供应商！"
        });
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$confirm("确定要提交表单吗？")
            .then(_ => {
              this.canSave = false;
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                let _this = this;
                _this.$axiosPost
                  .post(APIUTL + "?action=doSaveZpInfo", {
                    mainData: _this.mainData,
                    zpData: _this.form,
                    gxData: _this.gx
                  })
                  .then(function(response) {
                    if (response.data.errcode == 5010) {
                      _this.$message({
                        showClose: true,
                        message: response.data.errmsg,
                        type: "error"
                      });
                      _this.canSave = true;
                      return;
                    }
                    _this.$message({
                      showClose: true,
                      message: "保存成功",
                      type: "success"
                    });
                    _this.canSave = true;
                    _this.form.id = response.data.data["id"];
                    _this.gx.gxid = response.data.data["gxid"];
                    _this.getData();
                    if (_this.form.isSingle == 0) {
                      _this.$emit(
                        "updataInfo",
                        response.data.data["id"],
                        response.data.data["gxid"],
                        _this.form.pbsupplierName,
                        response.data.data["bdh"],
                        Number(_this.form.zzsh),
                        _this.index,
                        _this.mainData.creator,
                        _this.getDate()
                      );
                    } else {
                      _this.form.id = response.data.data["id"];
                      _this.getData();
                    }
                  })
                  .catch(function(error) {
                    _this.$message({
                      showClose: true,
                      message: "保存失败！" + error,
                      type: "error"
                    });
                  });
                if (_this.form.isSingle == 0) {
                  // done();
                }
              }, 1000);
            })
            .catch(_ => {
              done();
            });
        } else {
          this.$message({
            showClose: true,
            message: "带'*'数据不允许为空！否则不能保存！",
            type: "error"
          });
        }
      });
      // }
    },
    My_Del: function() {
      this.$confirm("是否删除该子版单号！", "Tip", {
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        const load = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        this.delloading = true;
        let _this = this;
        _this.$axios
          .get(APIUTL, {
            params: {
              action: "doDelChild",
              childId: _this.form.id,
              parentId: _this.mainData.myDJid
            }
          })
          .then(function(response) {
            _this.delloading = false;
            if (response.data.errcode == 5010) {
              _this.$message({
                showClose: true,
                message: response.data.errmsg,
                type: "error"
              });
              return;
            }
            if (response.data.data["status"] != -1) {
              _this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              _this.$emit("deleteInfo", _this.index);
              _this.zpDrawer = false;
            } else {
              _this.$alert(
                response.data.data["msg"],
                "当前子版单号已被以下成品布版单号引用，请先移除！",
                {
                  confirmButtonText: "确定",
                  callback: action => {}
                }
              );
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        load.close();
      });
    },
    print(){
      const { href } = this.$router.resolve({
          path:"/dayinZp",
          name: "dayinZp",
          query: {id:this.form.id,parentID:this.mainData.myDJid,userssid:this.mainData.creatorID}
      });
      window.open(href, '_blank');
    },
    closeWindows() {
      if (this.form.isSingle == 1) {
        let userAgent = navigator.userAgent;
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
          window.close();
        }
      } else {
        this.zpDrawer = false;
      }
    },
    showSupplierPicker: function(type) {
      this.$refs.SupplierPicker.init(type, this.form.pbsupplierName);
    },
    updateSupplier: function(id, name, type) {
      this.form[type + "supplierId"] = id;
      this.form[type + "supplierName"] = name;
    },
    updateClothTypes: function(clothTypes) {
      this.form.cypl = clothTypes;
    },
    getDate: function() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    }
  },
  computed: {
    getVersionNum: function() {
      if (this.form.jd && this.form.djh) {
        this.form.sxdh = this.form.jd + this.form.djh;
      }
      return this.form.pbbdh;
    }
  },
  watch: {
    devNumTemp: function() {
      this.form.jd = this.devNumTemp;
    }
  },
  mounted: function() {
    // this.init();
  }
};
</script>

<style>
#zpInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#zpInfo .el-drawer__header {
  margin-bottom: 0;
}
#zpInfo .el-input__inner {
  height: 26px;
  padding: 0 5px;
}
#zpInfo .el-form .my_form_top .el-form-item__label {
  padding-right: 5px;
}
#zpInfo .el-textarea__inner {
  padding: 0 5px;
}
#zpInfo .el-input--prefix .el-input__inner {
  padding-left: 30px;
}
#zpInfo .el-form-item {
  margin-bottom: 0;
}
#zpInfo .el-form-item__label {
  font-size: 12px;
}
#zpInfo .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 105px;
}
#zpInfo .el-input__suffix {
  right: 0;
}
#zpInfo .el-form .my_form_top .el-col {
  height: 30px;
}
#zpInfo .el-table * {
  font-size: 12px;
  text-align: center;
}
#zpInfo .el-table .cell {
  line-height: 20px;
  padding: 0;
}
#zpInfo .el-table {
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
#zpInfo .el-table th {
  padding: 3px 0;
  font-weight: normal !important;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
#zpInfo .el-table td {
  padding: 3px 0;
  border-right: 1px solid #ebeef5;
}
#zpInfo .el-table tbody td {
  padding: 0;
}
#zpInfo .el-table input {
  width: 100%;
  border-radius: 0;
  border: 0;
  height: 27px;
}
#zpInfo .my_form_top .el-date-editor .el-input__icon {
  display: none;
}
#zpInfo .my_form_top .el-date-editor input {
  padding-left: 5px;
}
#zpInfo .cell-label {
  width: 150px;
}
#zpInfo .cursor-default > input,
#zpInfo .cursor-default > textarea {
  cursor: default;
}
</style>
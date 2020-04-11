<template>
  <div>
    <el-drawer
      id="rzInfo"
      title="染整工艺开发单"
      :before-close="handleClose"
      :visible.sync="rzDrawer"
      @open="getData"
      direction="rtl"
      size="70%"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" ref="form" :rules="rules" v-loading="loading" label-width="95px">
          <div class="my_form_top">
            <el-row>
              <el-col :span="5">
                <el-form-item label="季度">
                  <DevNumPicker :devNumTemp.sync="form.jd" :disabled="true"></DevNumPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="染整供应商" prop="rzsupplierName">
                  <el-tooltip content="右键点击或者按下回车以选择供应商" placement="right">
                    <el-input
                      v-model="form.rzsupplierName"
                      size="mini"
                      @keydown.enter.native="showSupplierPicker('rz')"
                      @click.right.native.prevent="showSupplierPicker('rz')"
                      @blur="showSupplierPicker('rz')"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品经密">
                  <el-input v-model.number="form.cpjm" readonly size="mini" autocomplete="off"></el-input>
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
                <el-form-item label="染损(%)">
                  <el-input v-model="form.rs" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品纬密">
                  <el-input v-model.number="form.cpwm" readonly size="mini" autocomplete="off"></el-input>
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
                <el-form-item label="成份">
                  <el-input v-model="form.cf" readonly size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="染整单号">
                  <el-input v-model="form.rzdh" readonly size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品幅宽(cm)">
                  <el-input v-model.number="form.cpfk" readonly size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品克重(g/m)">
                  <el-input v-model.number="form.cpkz" readonly size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="15">
                <el-form-item label="纱支规格">
                  <el-input v-model="form.szgg" readonly size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <br />
          <el-row>
            <el-col :span="15">
              <table class="el-table">
                <thead>
                  <tr>
                    <th colspan="2">
                      <div class="cell">开发面料工艺</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="cell">工艺流程</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table no_border">
                        <tr>
                          <td class="cell_title">
                            <div class="cell">常规工艺</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-select
                                v-model="form.gy.cggy"
                                multiple
                                placeholder="请选择"
                                size="mini"
                              >
                                <el-option
                                  v-for="item in cggy"
                                  :key="item.dm"
                                  :label="item.mc"
                                  :value="item.dm"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">特殊工艺/染助剂</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.rzj" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">前处理</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table no_border">
                        <tr>
                          <td class="cell_title">
                            <div class="cell">工艺条件</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.qclgytj" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">品质要求</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.qclpzyq" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">印染</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table no_border">
                        <tr>
                          <td class="cell_title">
                            <div class="cell">染色方式</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-select
                                v-model="form.gy.rsfs"
                                multiple
                                placeholder="请选择"
                                size="mini"
                              >
                                <el-option
                                  v-for="item in rsfs"
                                  :key="item.dm"
                                  :label="item.mc"
                                  :value="item.dm"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">印花方式</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-select
                                v-model="form.gy.yhfs"
                                multiple
                                placeholder="请选择"
                                size="mini"
                              >
                                <el-option
                                  v-for="item in yhfs"
                                  :key="item.dm"
                                  :label="item.mc"
                                  :value="item.dm"
                                ></el-option>
                              </el-select>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">工艺条件</div>
                          </td>
                          <td colspan="3">
                            <div class="cell">
                              <el-input v-model="form.gy.yrgytj" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">品质要求</div>
                          </td>
                          <td colspan="3">
                            <div class="cell">
                              <el-input v-model="form.gy.yrpzyq" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">后整</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table no_border">
                        <tr>
                          <td class="cell_title">
                            <div class="cell">工艺条件</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.hzgytj" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="cell_title">
                            <div class="cell">品质要求</div>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.hzpzyq" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">特别注意事项</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input
                          type="textarea"
                          :rows="3"
                          placeholder
                          v-model="form.tbzysx"
                          size="mini"
                        ></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">计划完成时间</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-date-picker
                          v-model="form.jhwcsj"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          size="mini"
                        ></el-date-picker>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer" style="margin-top: 5px">
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

          <!-- <el-button @click="$router.push('/dayinRz?id='+form.id+'&parentID='+mainData.myDJid+'&userssid='+mainData.creatorID)">打印</el-button> -->
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
  name: "rzInfo",
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
      rzDrawer: false,
      loading: false,
      saveloading: false,
      delloading: false,
      gx: {
        gxid: 0,
        gxlx: ""
      },
      form: {
        id: 0,
        isSingle: 0,
        cf: "保存后自动关联",
        cpjm: "保存后自动关联",
        zdr: "",
        rzdh: "",
        cpfk: "保存后自动关联",
        cpwm: "保存后自动关联",
        zdrq: "",
        cypl: [],
        cpkz: "保存后自动关联",
        szgg: "保存后自动关联",
        jd: "",
        rzsupplierId: "",
        rzsupplierName: "",
        rs: 0,
        gy: {
          cggy: [],
          rzj: "",
          qclgytj: "",
          qclpzyq: "",
          rsfs: [],
          yhfs: [],
          yrgytj: "",
          yrpzyq: "",
          hzgytj: "",
          hzpzyq: ""
        },
        gyid: {
          cggy: 0,
          rzj: 0,
          qclgytj: 0,
          qclpzyq: 0,
          rsfs: 0,
          yhfs: 0,
          yrgytj: 0,
          yrpzyq: 0,
          hzgytj: 0,
          hzpzyq: 0
        },
        tbzysx: "",
        jhwcsj: ""
      },
      cggy: [],
      rsfs: [],
      yhfs: [],
      rules: {
        rzsupplierName: [{ required: true, message: " ", trigger: "blur" }]
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
      this.rzDrawer = true;
    },
    show: function(id, index, gxid, loss, gxlx) {
      this.clearData();
      this.form.id = id;
      this.init();
      this.index = index;
      this.gx.gxid = gxid;
      this.gx.gxlx = gxlx;
      this.rzDrawer = true;
    },
    init: function() {
      this.canSave = true;
      if (this.form.id == 0) {
        this.canDel = false;
      }
      let _this = this;
      _this.$axios
        .get(APIUTL, {
          params: {
            action: "getRzInitData"
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
          _this.cggy = response.data.data[0];
          _this.rsfs = response.data.data[1];
          _this.yhfs = response.data.data[2];
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
              action: "getRzInfo",
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
            console.log(_this.form)
            _this.canSave = _this.mainData.creator == _this.form.zdr;
            _this.canDel =
              _this.mainData.creator == _this.form.zdr && _this.form.id != 0;
            _this.form.isSingle = isSingleTemp;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    clearData: function() {
      this.form = {
        id: 0,
        isSingle: 0,
        cf: "保存后自动关联",
        cpjm: "保存后自动关联",
        zdr: this.mainData.creator,
        rzdh: "保存后自动生成",
        cpfk: "保存后自动关联",
        cpwm: "保存后自动关联",
        zdrq: this.getDate(),
        cypl: [],
        cpkz: "保存后自动关联",
        szgg: "保存后自动关联",
        jd: this.devNumTemp,
        rzsupplierId: "",
        rzsupplierName: "",
        rs: 0,
        gy: {
          cggy: [],
          rzj: "",
          qclgytj: "",
          qclpzyq: "",
          rsfs: [],
          yhfs: [],
          yrgytj: "",
          yrpzyq: "",
          hzgytj: "",
          hzpzyq: ""
        },
        gyid: {
          cggy: 0,
          rzj: 0,
          qclgytj: 0,
          qclpzyq: 0,
          rsfs: 0,
          yhfs: 0,
          yrgytj: 0,
          yrpzyq: 0,
          hzgytj: 0,
          hzpzyq: 0
        },
        tbzysx: "",
        jhwcsj: ""
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
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (!this.form.rzsupplierId) {
            this.$message({
              type: "error",
              message: "请选择一个有效供应商！"
            });
            return;
          }
          this.$confirm("确定要提交表单吗？")
            .then(_ => {
              this.canSave = false;
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                let _this = this;
                _this.$axiosPost
                  .post(APIUTL + "?action=doSaveRzInfo", {
                    mainData: _this.mainData,
                    rzData: _this.form,
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
                        _this.form.rzsupplierName,
                        response.data.data["bdh"],
                        Number(_this.form.rs),
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
              _this.rzDrawer = false;
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
        this.rzDrawer = false;
      }
    },
    print(){
      // <router-link target="_blank" :
      //to="{path:'/dayinRz',query:{id:form.id,parentID:mainData.myDJid,userssid:mainData.creatorID}}">打印</router-link>

      const { href } = this.$router.resolve({
          path:"/dayinRz",
          name: "dayinRz",
          query: {id:this.form.id,parentID:this.mainData.myDJid,userssid:this.mainData.creatorID}
      });
      window.open(href, '_blank');
    },
    showSupplierPicker: function(type) {
      this.$refs.SupplierPicker.init(type, this.form.rzsupplierName);
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
#rzInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#rzInfo .el-drawer__header {
  margin-bottom: 0;
}
#rzInfo .el-input__inner {
  height: 26px;
  padding: 0 5px;
}
#rzInfo .el-form .my_form_top .el-form-item__label {
  padding-right: 5px;
}
#rzInfo .el-textarea__inner {
  padding: 0 5px;
  border: 0;
  border-radius: 0;
}
#rzInfo .el-input--prefix .el-input__inner {
  padding-left: 30px;
}
#rzInfo .el-form-item {
  margin-bottom: 0;
}
#rzInfo .el-form-item__label {
  font-size: 12px;
}
#rzInfo .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 112px;
}
#rzInfo .el-input__suffix {
  right: 0;
}
#rzInfo .el-form .my_form_top .el-col {
  height: 30px;
}
#rzInfo .el-table * {
  font-size: 12px;
  text-align: center;
}
#rzInfo .el-table .cell {
  line-height: 20px;
  padding: 0;
}
#rzInfo .el-table {
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
#rzInfo .el-table th {
  padding: 3px 0;
  font-weight: normal !important;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
#rzInfo .el-table td {
  padding: 3px 0;
  border-right: 1px solid #ebeef5;
}
#rzInfo .el-table td.cell_title {
  width: 100px;
}
#rzInfo .el-table tbody td {
  padding: 0;
}
#rzInfo .el-table input {
  width: 100%;
  border-radius: 0;
  border: 0;
  height: 27px;
}
#rzInfo .el-table .no_border {
  border: 0;
}
#rzInfo .el-table .el-select {
  width: 100%;
}
.el-select-dropdown__item {
  font-size: 12px;
}
</style>


<template>
  <div>
    <el-drawer
      id="sxInfo"
      title="纱线自主开发单"
      :before-close="handleClose"
      :visible.sync="sxDrawer"
      @open="getData"
      direction="rtl"
      size="70%"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" ref="form" :rules="rules" label-width="90px" v-loading="loading">
          <div class="my_form_top">
            <el-row>
              <el-col :span="5">
                <el-form-item label="季度">
                  <DevNumPicker :devNumTemp.sync="form.jd" :disabled="true"></DevNumPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="纱线供应商" prop="sxsupplierName">
                  <el-tooltip content="右键点击或者按下回车以选择供应商" placement="right">
                    <el-input
                      v-model="form.sxsupplierName"
                      size="mini"
                      @keydown.enter.native="showSupplierPicker('sx')"
                      @click.right.native.prevent="showSupplierPicker('sx')"
                      @blur="showSupplierPicker('sx')"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="制单人">
                  <el-input v-model="form.zdr" size="mini" readonly autocomplete="off"></el-input>
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
                <el-form-item label="纺纱方式" prop="fsfs">
                  <el-select v-model="form.fsfs" placeholder="请选择" clearable size="mini">
                    <el-option
                      v-for="item in fsfs"
                      :key="item.dm"
                      :label="item.mc"
                      :value="item.dm"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="纱线编号">
                  <el-input
                    v-model="form.sxbh"
                    size="mini"
                    class="cursor-default"
                    :disabled="true"
                    readonly
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="纱支规格" prop="szgg">
                  <el-input v-model="form.szgg" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="织造类型" prop="zzlx">
                  <el-select v-model="form.zzlx" placeholder="请选择" clearable size="mini">
                    <el-option
                      v-for="item in zzlx"
                      :key="item.dm"
                      :label="item.mc"
                      :value="item.dm"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="纱线成份" prop="sxcf">
                  <el-input v-model="form.sxcf" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="需求数量(kg)" prop="xqsl">
                  <el-input v-model.number="form.xqsl" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="5">
                <el-form-item label="织造用途" prop="zzyt">
                  <el-select v-model="form.zzyt" placeholder="请选择" clearable size="mini">
                    <el-option
                      v-for="item in zzyt"
                      :key="item.dm"
                      :label="item.mc"
                      :value="item.dm"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="纱线单号">
                  <el-input v-model="getVersionNum" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="价格范围">
                  <el-input v-model="form.jgfw" size="mini" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <br />
          <el-row>
            <el-col :span="9">
              <el-row>
                <table class="el-table">
                  <thead>
                    <tr>
                      <th class="first-cell">
                        <div class="cell">原料成分(天然纤维)</div>
                      </th>
                      <th>
                        <div class="cell">品级</div>
                      </th>
                      <th>
                        <div class="cell">长度(mm)</div>
                      </th>
                      <th>
                        <div class="cell">备注</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in form.trxw" :key="index">
                      <td>
                        <div class="cell">
                          <el-input v-model="item.ylcf" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.pj" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.cd" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.bz" size="mini"></el-input>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-row>
              <el-row>
                <table class="el-table">
                  <thead>
                    <tr>
                      <th class="first-cell">
                        <div class="cell">原料成分(化学纤维)</div>
                      </th>
                      <th>
                        <div class="cell">纤维细度</div>
                      </th>
                      <th>
                        <div class="cell">长度(mm)</div>
                      </th>
                      <th>
                        <div class="cell">备注</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in form.hxxw" :key="index">
                      <td>
                        <div class="cell">
                          <el-input v-model="item.ylcf" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.xwxd" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.cd" size="mini"></el-input>
                        </div>
                      </td>
                      <td>
                        <div class="cell">
                          <el-input v-model="item.bz" size="mini"></el-input>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-row>
            </el-col>
            <el-col :span="15">
              <table class="el-table">
                <thead>
                  <tr>
                    <th colspan="4">
                      <div class="cell">指标要求</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="cell">百米重量偏差(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.zlpc" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">条干不匀率CV(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.byl" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">百米重量不匀率变异系数(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.byxs" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">细节(-50％)(个/千米)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.xj" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">单纱断裂强力(CN)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.dlql" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">粗节(+50％)(个/千米)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.cj" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">最小强力(CN)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.zxql" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">棉结(+200％)(个/千米)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.mj" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">强力CV%(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.qlcv" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-select
                          v-model="form.zbyq.myType"
                          placeholder="请选择"
                          class="cell_select"
                          size="mini"
                        >
                          <el-option
                            v-for="item in my"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.my" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">单纱断裂强度(CN/TEX)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.dlqd" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">捻系数</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.nxs" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="cell">单纱断裂伸长率(%)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.dlscl" size="mini"></el-input>
                      </div>
                    </td>
                    <td>
                      <div class="cell">十万米纱疵(个)</div>
                    </td>
                    <td>
                      <div class="cell">
                        <el-input v-model="form.zbyq.swmsc" size="mini"></el-input>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item label="纱线要求" label-width="109px" style="margin:2px 0">
                <el-input type="textarea" :rows="3" placeholder v-model="form.sxyq" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="备注信息" label-width="109px">
                <el-input type="textarea" :rows="3" placeholder v-model="form.bzxx" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="15">
              <el-form-item label="计划完成时间" label-width="109px">
                <el-date-picker
                  v-model="form.jhwcsj"
                  value-format="yyyy-MM-dd"
                  type="date"
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
            <router-link target="_blank" :to="{path:'/dayinSx',query:{id:form.id,parentID:mainData.myDJid,userssid:mainData.creatorID,gxid:gx.gxid}}">打印</router-link>
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
  name: "sxInfo",
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
      sxDrawer: false,
      loading: false,
      saveloading: false,
      delloading: false,
      isChangeJD: false,
      gx: {
        gxid: 0,
        gxlx: "",
        yt: ""
      },
      form: {
        id: 0,
        isSingle: 0,
        djh: "",
        jd: this.devNumTemp,
        sxsupplierId: "",
        sxsupplierName: "",
        fsfs: "",
        zdr: this.mainData.creator,
        sxbh: "",
        szgg: "",
        zdrq: this.getDate(),
        sxcf: "",
        zzlx: "",
        xqsl: "",
        sxdh: "保存后自动生成",
        zzyt: "",
        jgfw: "",
        sxyq: "",
        bzxx: "",
        jhwcsj: "",
        trxw: [
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" }
        ],
        trxwid: [
          { ylcf: 0, pj: 0, cd: 0, bz: 0 },
          { ylcf: 0, pj: 0, cd: 0, bz: 0 },
          { ylcf: 0, pj: 0, cd: 0, bz: 0 }
        ],
        hxxw: [
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" }
        ],
        hxxwid: [
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 }
        ],
        zbyq: {
          zlpc: "",
          byl: "",
          byxs: "",
          xj: "",
          dlql: "",
          cj: "",
          zxql: "",
          mj: "",
          qlcv: "",
          myType: "my",
          my: "",
          dlqd: "",
          nxs: "",
          dlscl: "",
          swmsc: ""
        },
        zbyqid: {
          zlpc: 0,
          byl: 0,
          byxs: 0,
          xj: 0,
          dlql: 0,
          cj: 0,
          zxql: 0,
          mj: 0,
          qlcv: 0,
          myType: 0,
          my: 0,
          dlqd: 0,
          nxs: 0,
          dlscl: 0,
          swmsc: 0
        }
      },
      fsfs: [],
      zzlx: [],
      zzyt: [],
      my: [
        { value: "my", label: "毛羽（3mm）" },
        { value: "myhz", label: "毛羽H值" },
        { value: "myzs", label: "毛羽指数" }
      ],
      rules: {
        fsfs: [{ required: true, message: " ", trigger: "blur" }],
        szgg: [{ required: true, message: " ", trigger: "blur" }],
        zzlx: [{ required: true, message: " ", trigger: "blur" }],
        zzyt: [{ required: true, message: " ", trigger: "blur" }],
        sxcf: [{ required: true, message: " ", trigger: "blur" }],
        xqsl: [{ required: true, message: " ", trigger: "blur" }],
        sxsupplierName: [{ required: true, message: " ", trigger: "blur" }]
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
      this.sxDrawer = true;
    },
    show: function(id, index, gxid, yt, gxlx) {
      this.clearData();
      this.form.id = id;
      this.init();
      this.index = index;
      this.gx.gxid = gxid;
      this.gx.yt = yt;
      this.gx.gxlx = gxlx;
      this.sxDrawer = true;
    },
    init: function() {
      this.canSave = true;
      if (this.form.id == 0) {
        this.canDel = false;
      }
      let _this = this;
      _this.$axios
        // .get(APIUTL + "/getSxInitData", {
        .get(APIUTL, {
          params: {
            action: "getSxInitData"
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
          _this.fsfs = response.data.data[0];
          _this.zzlx = response.data.data[1];
          _this.zzyt = response.data.data[2];
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
          // .get(APIUTL + "/getSxInfo", {
          .get(APIUTL, {
            params: {
              action: "getSxInfo",
              id: _this.form.id,
              parentId: _this.mainData.myDJid,
              gxid: _this.gx.gxid
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
            while (_this.form.trxw.length < 3) {
              _this.form.trxw.push({
                flag: 0,
                ylcf: "",
                pj: "",
                cd: "",
                bz: ""
              });
              _this.form.trxwid.push({ ylcf: 0, pj: 0, cd: 0, bz: 0 });
            }
            while (_this.form.hxxw.length < 3) {
              _this.form.hxxw.push({
                flag: 0,
                ylcf: "",
                xwxd: "",
                cd: "",
                bz: ""
              });
              _this.form.hxxwid.push({ ylcf: 0, xwxd: 0, cd: 0, bz: 0 });
            }
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
        isSingle: 0,
        djh: "",
        jd: this.devNumTemp,
        sxsupplierId: "",
        sxsupplierName: "",
        fsfs: "",
        zdr: this.mainData.creator,
        sxbh: "",
        szgg: "",
        zdrq: this.getDate(),
        sxcf: "",
        zzlx: "",
        xqsl: "",
        sxdh: "保存后自动生成",
        zzyt: "",
        jgfw: "",
        sxyq: "",
        bzxx: "",
        jhwcsj: "",
        trxw: [
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", pj: "", cd: "", bz: "" }
        ],
        trxwid: [
          { ylcf: 0, pj: 0, cd: 0, bz: 0 },
          { ylcf: 0, pj: 0, cd: 0, bz: 0 },
          { ylcf: 0, pj: 0, cd: 0, bz: 0 }
        ],
        hxxw: [
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
          { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" }
        ],
        hxxwid: [
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
          { ylcf: 0, xwxd: 0, cd: 0, bz: 0 }
        ],
        zbyq: {
          zlpc: "",
          byl: "",
          byxs: "",
          xj: "",
          dlql: "",
          cj: "",
          zxql: "",
          mj: "",
          qlcv: "",
          myType: "my",
          my: "",
          dlqd: "",
          nxs: "",
          dlscl: "",
          swmsc: ""
        },
        zbyqid: {
          zlpc: 0,
          byl: 0,
          byxs: 0,
          xj: 0,
          dlql: 0,
          cj: 0,
          zxql: 0,
          mj: 0,
          qlcv: 0,
          myType: 0,
          my: 0,
          dlqd: 0,
          nxs: 0,
          dlscl: 0,
          swmsc: 0
        }
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
          if (!this.form.sxsupplierId) {
            this.$message({
              type: "error",
              message: "请选择一个有效供应商！"
            });
            return;
          }
          this.$confirm("确定要提交表单吗？", "提示", {
            cancelButtonText: "取消并返回"
          })
            .then(_ => {
              this.canSave = false;
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                let _this = this;
                _this.$axiosPost
                  .post(APIUTL + "?action=doSaveSxInfo", {
                    mainData: _this.mainData,
                    sxData: _this.form,
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
                        _this.form.sxsupplierName,
                        response.data.data["bdh"],
                        0,
                        _this.index,
                        _this.mainData.creator,
                        _this.getDate(),
                        _this.getzzytMC()
                      );
                      console.log(_this.getzzytMC())
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
              _this.sxDrawer = false;
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
          path:"/dayinSx",
          name: "dayinSx",
          query: {id:this.form.id,parentID:this.mainData.myDJid,userssid:this.mainData.creatorID,gxid:this.gx.gxid}
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
        this.sxDrawer = false;
      }
    },
    getzzytMC() {
      let length = this.zzyt.length;
      for (let i = 0; i < length; i++) {
        if (this.zzyt[i].dm == this.form.zzyt) {
          return this.zzyt[i].mc;
        }
      }
    },
    showSupplierPicker: function(type) {
      this.$refs.SupplierPicker.init(type, this.form.sxsupplierName);
    },
    updateSupplier: function(id, name, type) {
      this.form[type + "supplierId"] = id;
      this.form[type + "supplierName"] = name;
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
      return this.form.sxdh;
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
#sxInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#sxInfo .el-drawer__header {
  margin-bottom: 0;
}
#sxInfo .el-input__inner {
  height: 26px;
  padding: 0 5px;
}
#sxInfo .el-textarea__inner {
  padding: 0 5px;
}
#sxInfo .el-input--prefix .el-input__inner {
  padding-left: 30px;
}
#sxInfo .el-form-item {
  margin-bottom: 0;
}
#sxInfo .el-form-item__label {
  font-size: 12px;
}
#sxInfo .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 112px;
}
#sxInfo .el-input__suffix {
  right: 0;
}
#sxInfo .el-form .my_form_top .el-form-item__label {
  padding-right: 5px;
}
#sxInfo .el-form .my_form_top .el-col {
  height: 30px;
}
#sxInfo .el-table * {
  font-size: 12px;
  text-align: center;
}
#sxInfo .el-table .cell {
  line-height: 20px;
  padding: 0;
}
#sxInfo .el-table .first-cell {
  width: 110px;
}
#sxInfo .el-table {
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
#sxInfo .el-table th {
  padding: 3px 0;
  font-weight: normal !important;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
#sxInfo .el-table td {
  padding: 3px 0;
  border-right: 1px solid #ebeef5;
}
#sxInfo .el-table tbody td {
  padding: 0;
}
#sxInfo .el-table input {
  width: 100%;
  border-radius: 0;
  border: 0;
  height: 27px;
}
#sxInfo .cell_select input {
  width: 120px !important;
}
#sxInfo .my_form_top .el-date-editor .el-input__icon {
  display: none;
}
#sxInfo .my_form_top .el-date-editor input {
  padding-left: 5px;
}
#sxInfo .cursor-default > input {
  cursor: default;
}
</style>
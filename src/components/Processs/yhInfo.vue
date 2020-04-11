<template>
  <div>
    <el-drawer
      id="yhInfo"
      title="数码印花开发单"
      :before-close="handleClose"
      :visible.sync="yhDrawer"
      @open="getData"
      direction="rtl"
      size="70%"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" v-loading="loading" label-width="95px">
          <div class="my_form_top">
            <el-row>
              <el-col :span="5">
                <el-form-item label="季度">
                  <DevNumPicker :devNumTemp.sync="form.jd" :disabled="true"></DevNumPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品经密">
                  <el-input v-model="form.cpjm" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品纬密">
                  <el-input v-model="form.cpwm" size="mini" readonly autocomplete="off"></el-input>
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
                <el-form-item label="成品幅宽(cm)">
                  <el-input v-model="form.cpfk" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="成品克重(g/m)">
                  <el-input v-model="form.cpkz" size="mini" readonly autocomplete="off"></el-input>
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
                  <el-input v-model="form.cf" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="印花单号">
                  <el-input v-model="form.yhdh" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="纱支规格">
                  <el-input v-model="form.szgg" size="mini" readonly autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <br />
          <el-row>
            <el-col :span="20">
              <el-col :span="12">
                <table class="el-table" style="margin-bottom: 5px">
                  <tbody>
                    <tr>
                      <td>
                        <div class="cell">
                          <el-select
                            v-model="form.gy.pbtype"
                            placeholder="请选择"
                            class="cell_select"
                            size="mini"
                          >
                            <el-option
                              v-for="item in pbtype"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            ></el-option>
                          </el-select>
                        </div>
                      </td>
                      <td class="no_border">
                        <table class="el-table" style="border-top: none; border-left: none">
                          <tr>
                            <td class="title_cell">
                              <font class="cell">{{pbtype[form.gy.pbtype].label}}供应商</font>
                            </td>
                            <td>
                              <div class="cell">
                                <div>{{suppliers.pbsupplierName}}</div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <font class="cell">{{pbtype[form.gy.pbtype].label}}编号</font>
                            </td>
                            <td>
                              <font class="cell">
                                <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                  <el-input
                                    v-model="form.gy.pbbhshow"
                                    size="mini"
                                    @keydown.enter.native="showProcessPartPicker('pb')"
                                    @click.right.native.prevent="showProcessPartPicker('pb')"
                                    @blur="showProcessPartPicker('pb')"
                                  ></el-input>
                                </el-tooltip>
                              </font>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-col>
              <table class="el-table">
                <tbody>
                  <tr>
                    <td v-if="form.gy.pbtype == '0'">
                      <div class="cell cell-title">前处理</div>
                    </td>
                    <td v-if="form.gy.pbtype == '0'" class="no_border">
                      <table class="el-table" style="border-top: none; border-left: none">
                        <tr>
                          <td class="title_cell">
                            <font class="cell">前处理供应商</font>
                          </td>
                          <td>
                            <div class="cell">
                              <div>{{suppliers.qclsupplierName}}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">前处理编号</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                <el-input
                                  v-model="form.gy.qclbhshow"
                                  size="mini"
                                  @keydown.enter.native="showProcessPartPicker('qcl')"
                                  @click.right.native.prevent="showProcessPartPicker('qcl')"
                                  @blur="showProcessPartPicker('qcl')"
                                ></el-input>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">前处理工艺损耗（%）</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.qclsh" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td>
                      <div class="cell cell-title">上浆</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table" style="border-top: none; border-left: none">
                        <tr>
                          <td class="title_cell">
                            <font class="cell">上浆供应商</font>
                          </td>
                          <td>
                            <div class="cell">
                              <div>{{suppliers.sjsupplierName}}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">上浆编号</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                <el-input
                                  v-model="form.gy.sjbhshow"
                                  size="mini"
                                  @keydown.enter.native="showProcessPartPicker('sj')"
                                  @click.right.native.prevent="showProcessPartPicker('sj')"
                                  @blur="showProcessPartPicker('sj')"
                                ></el-input>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">上浆工艺损耗（%）</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.sjsh" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td v-if="form.gy.pbtype != '0'">
                      <div class="cell cell-title">印花</div>
                    </td>
                    <td v-if="form.gy.pbtype != '0'" class="no_border">
                      <table class="el-table" style="border-top: none; border-left: none">
                        <tr>
                          <td class="title_cell">
                            <font class="cell">印花供应商</font>
                          </td>
                          <td>
                            <div class="cell">
                              <div>{{suppliers.yhsupplierName}}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">印花编号</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                <el-input
                                  v-model="form.gy.yhbhshow"
                                  size="mini"
                                  @keydown.enter.native="showProcessPartPicker('yh')"
                                  @click.right.native.prevent="showProcessPartPicker('yh')"
                                  @blur="showProcessPartPicker('yh')"
                                ></el-input>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">印花工艺损耗（%）</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.yhsh" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td v-if="form.gy.pbtype == '0'">
                      <div class="cell cell-title">印花</div>
                    </td>
                    <td v-if="form.gy.pbtype == '0'" class="no_border">
                      <table class="el-table" style="border-top: none; border-left: none">
                        <tr>
                          <td class="title_cell">
                            <font class="cell">印花供应商</font>
                          </td>
                          <td>
                            <div class="cell">
                              <div>{{suppliers.yhsupplierName}}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">印花编号</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                <el-input
                                  v-model="form.gy.yhbhshow"
                                  size="mini"
                                  @keydown.enter.native="showProcessPartPicker('yh')"
                                  @click.right.native.prevent="showProcessPartPicker('yh')"
                                  @blur="showProcessPartPicker('yh')"
                                ></el-input>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">印花工艺损耗（%）</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.yhsh" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td>
                      <div class="cell cell-title">水洗</div>
                    </td>
                    <td class="no_border">
                      <table class="el-table" style="border-top: none; border-left: none">
                        <tr>
                          <td class="title_cell">
                            <font class="cell">后整供应商</font>
                          </td>
                          <td>
                            <div class="cell">
                              <div>{{suppliers.hzsupplierName}}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">后整编号</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-tooltip content="右键点击或者按下回车以选择面料编号" placement="right">
                                <el-input
                                  v-model="form.gy.hzbhshow"
                                  size="mini"
                                  @keydown.enter.native="showProcessPartPicker('hz')"
                                  @click.right.native.prevent="showProcessPartPicker('hz')"
                                  @blur="showProcessPartPicker('hz')"
                                ></el-input>
                              </el-tooltip>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font class="cell">后整工艺损耗（%）</font>
                          </td>
                          <td>
                            <div class="cell">
                              <el-input v-model="form.gy.hzsh" size="mini"></el-input>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td v-if="form.gy.pbtype != '0'" colspan="2"></td>
                  </tr>
                </tbody>
              </table>
            </el-col>
          </el-row>
          <br />
          <el-row>
            <el-col :span="20">
              <el-row>
                <table class="el-table">
                  <thead>
                    <th colspan="4">工艺要求</th>
                  </thead>
                  <tbody>
                    <el-row>
                      <el-col :span="12">
                        <table class="el-table no_border">
                          <tr>
                            <td>前处理</td>
                            <td class="no_border">
                              <table class="el-table no_border">
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">水洗缩率（%）</div>
                                  </td>
                                  <td style="width:30px;">
                                    <div class="cell">经向</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.jx" size="mini"></el-input>
                                    </div>
                                  </td>
                                  <td style="width:30px;">
                                    <div class="cell">纬向</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.wx" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">纬斜率（%）</div>
                                  </td>
                                  <td colspan="4">
                                    <div class="cell">
                                      <el-input v-model="form.gy.wxl" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>上浆</td>
                            <td class="no_border">
                              <table class="el-table no_border">
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">上浆后幅宽（CM）</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.sjhfk" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">上浆后克重（g/㎡）</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.sjhkz" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">底浆</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-select v-model="form.gy.dj" placeholder="请选择" size="mini">
                                        <el-option
                                          v-for="item in dj"
                                          :key="item.dm"
                                          :label="item.mc"
                                          :value="item.dm"
                                        ></el-option>
                                      </el-select>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </el-col>
                      <el-col :span="12">
                        <table class="el-table no_border">
                          <tr>
                            <td>印花</td>
                            <td class="no_border">
                              <table class="el-table no_border">
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">花型循环尺寸CM （宽*高）</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.xhcc" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">打印幅宽（CM）</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.dyfk" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>蒸化</td>
                            <td class="no_border">
                              <table class="el-table no_border">
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">温度</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.wd" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td class="cell_title">
                                    <div class="cell title_cell">时间</div>
                                  </td>
                                  <td>
                                    <div class="cell">
                                      <el-select v-model="form.gy.sj" placeholder="请选择" size="mini">
                                        <el-option
                                          v-for="item in sj"
                                          :key="item.dm"
                                          :label="item.mc"
                                          :value="item.dm"
                                        ></el-option>
                                      </el-select>
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
                                  <td>
                                    <div class="cell">
                                      <el-input v-model="form.gy.hz" size="mini"></el-input>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="24">
                        <table class="el-table no_border">
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
                                  placeholder="选择日期"
                                  size="mini"
                                ></el-date-picker>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </el-col>
                    </el-row>
                  </tbody>
                </table>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
        <br />
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
          <el-button>
            <router-link target="_blank" :to="{path:'/dayinYh',query:{id:form.id,parentID:mainData.myDJid,userssid:mainData.creatorID}}">打印</router-link>
          </el-button>
        </div>
      </div>
    </el-drawer>
    <ProcessPartPicker
      ref="ProcessPartPicker"
      @selected="updateProcessPart"
      @clean="cleanProcessPart"
    ></ProcessPartPicker>
  </div>
</template>

<script>
import ProcessPartPicker from "@/components/Utils/ProcessPartPicker.vue";
import ClothTypesPicker from "@/components/Utils/ClothTypesPicker.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";

export default {
  name: "yhInfo",
  components: {
    ProcessPartPicker,
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
      yhDrawer: false,
      loading: false,
      saveloading: false,
      delloading: false,
      gx: {
        gxid: 0,
        gxlx: "",
        loss: 0
      },
      form: {
        id: 0,
        isSingle: 0,
        yhdh: "保存后自动生成",
        cf: "保存后自动关联",
        cpjm: "保存后自动关联",
        zdr: this.mainData.creator,
        cpfk: "保存后自动关联",
        cpwm: "保存后自动关联",
        zdrq: this.getDate(),
        cypl: [],
        cpkz: "保存后自动关联",
        szgg: "保存后自动关联",
        jd: this.devNumTemp,
        gy: {
          pbtype: "0",
          pbbhshow: "保存后自动关联",
          pbbh: "",
          qclbhshow: "",
          qclbh: "",
          qclsh: 0,
          sjbhshow: "",
          sjbh: "",
          sjsh: 0,
          yhbhshow: "",
          yhbh: "",
          yhsh: 0,
          hzbhshow: "",
          hzbh: "",
          hzsh: 0,
          jx: "",
          wx: "",
          wxl: "",
          sjhfk: "",
          sjhkz: "",
          dj: "",
          xhcc: "",
          dyfk: "",
          wd: "",
          sj: "",
          hz: ""
        },
        gyid: {
          pbtype: 0,
          pbbh: 0,
          qclbh: 0,
          qclsh: 0,
          sjbh: 0,
          sjsh: 0,
          yhbh: 0,
          yhsh: 0,
          hzbh: 0,
          hzsh: 0,
          jx: 0,
          wx: 0,
          wxl: 0,
          sjhfk: 0,
          sjhkz: 0,
          dj: 0,
          xhcc: 0,
          dyfk: 0,
          wd: 0,
          sj: 0,
          hz: 0
        },
        tbzysx: "",
        jhwcsj: ""
      },
      suppliers: {
        pbsupplierName: "保存后自动关联",
        qclsupplierName: "",
        bpbsupplierName: "",
        sjsupplierName: "",
        yhsupplierName: "",
        hzsupplierName: ""
      },
      dj: [],
      sj: [],
      pbtype: [{ value: "0", label: "坯布" }, { value: "1", label: "半漂布" }]
    };
  },
  methods: {
    showSingle: function(id, gxlx) {
      this.init();
      this.clearData();
      this.form.id = id;
      this.gx.gxlx = gxlx;
      this.form.isSingle = 1;
      this.yhDrawer = true;
    },
    show: function(id, index, gxid, gxlx) {
      this.clearData();
      this.form.id = id;
      this.init();
      this.index = index;
      this.gx.gxid = gxid;
      this.gx.gxlx = gxlx;
      this.yhDrawer = true;
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
            action: "getYhInitData"
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
          _this.dj = response.data.data[0];
          _this.sj = response.data.data[1];
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
              action: "getYhInfo",
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
            _this.form = response.data.data[0];
            _this.canSave = _this.mainData.creator == _this.form.zdr;
            _this.canDel =
              _this.mainData.creator == _this.form.zdr && _this.form.id != 0;
            _this.form.isSingle = isSingleTemp;
            _this.suppliers = response.data.data[1];
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
        yhdh: "保存后自动生成",
        cf: "保存后自动关联",
        cpjm: "保存后自动关联",
        zdr: this.mainData.creator,
        cpfk: "保存后自动关联",
        cpwm: "保存后自动关联",
        zdrq: this.getDate(),
        cypl: [],
        cpkz: "保存后自动关联",
        szgg: "保存后自动关联",
        jd: this.devNumTemp,
        gy: {
          pbtype: "0",
          pbbhshow: "保存后自动关联",
          pbbh: "",
          qclbhshow: "",
          qclbh: "",
          qclsh: 0,
          sjbhshow: "",
          sjbh: "",
          sjsh: 0,
          yhbhshow: "",
          yhbh: "",
          yhsh: 0,
          hzbhshow: "",
          hzbh: "",
          hzsh: 0,
          jx: "",
          wx: "",
          wxl: "",
          sjhfk: "",
          sjhkz: "",
          dj: "",
          xhcc: "",
          dyfk: "",
          wd: "",
          sj: "",
          hz: ""
        },
        gyid: {
          pbtype: 0,
          pbbh: 0,
          qclbh: 0,
          qclsh: 0,
          sjbh: 0,
          sjsh: 0,
          yhbh: 0,
          yhsh: 0,
          hzbh: 0,
          hzsh: 0,
          jx: 0,
          wx: 0,
          wxl: 0,
          sjhfk: 0,
          sjhkz: 0,
          dj: 0,
          xhcc: 0,
          dyfk: 0,
          wd: 0,
          sj: 0,
          hz: 0
        },
        tbzysx: "",
        jhwcsj: ""
      };
      this.suppliers = {
        pbsupplierName: "保存后自动关联",
        qclsupplierName: "",
        bpbsupplierName: "",
        sjsupplierName: "",
        yhsupplierName: "",
        hzsupplierName: ""
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
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.canSave = false;
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.form.zsh = this.getzsh;
            let _this = this;
            _this.$axiosPost
              .post(APIUTL + "?action=doSaveYhInfo", {
                mainData: _this.mainData,
                yhData: _this.form,
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
                    _this.suppliers.yhsupplierName,
                    response.data.data["bdh"],
                    _this.getzsh,
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
              _this.yhDrawer = false;
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
        this.yhDrawer = false;
      }
    },
    showProcessPartPicker: function(type) {
      this.$refs.ProcessPartPicker.init(
        this.form.gy[type + "bhshow"],
        type,
        this.mainData.creatorID
      );
    },
    updateProcessPart: function(bh, dm, name, type) {
      this.form.gy[type + "bhshow"] = bh;
      this.form.gy[type + "bh"] = bh;
      this.form.gy[type + "dm"] = dm;
      this.suppliers[type + "supplierName"] = name;
    },
    cleanProcessPart: function(type) {
      this.form.gy[type + "bhshow"] = "";
      this.form.gy[type + "bh"] = "";
      this.form.gy[type + "dm"] = "";
      this.suppliers[type + "supplierName"] = "";
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
    },
    getzsh: function() {
      return (
        Number(this.form.gy.qclsh) +
        Number(this.form.gy.sjsh) +
        Number(this.form.gy.yhsh) +
        Number(this.form.gy.hzsh)
      );
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
#yhInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
#yhInfo .el-drawer__header {
  margin-bottom: 0;
}
#yhInfo .el-input__inner {
  height: 26px;
  padding: 0 5px;
}
#yhInfo .el-form .my_form_top .el-form-item__label {
  padding-right: 5px;
}
#yhInfo .el-textarea__inner {
  padding: 0 5px;
  border: 0;
  border-radius: 0;
}
#yhInfo .el-input--prefix .el-input__inner {
  padding-left: 30px;
}
#yhInfo .el-form-item {
  margin-bottom: 0;
}
#yhInfo .el-form-item__label {
  font-size: 12px;
}
#yhInfo .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 112px;
}
#yhInfo .el-input__suffix {
  right: 0;
}
#yhInfo .el-form .my_form_top .el-col {
  height: 30px;
}
#yhInfo .el-table * {
  font-size: 12px;
  text-align: center;
}
#yhInfo .el-table .cell {
  line-height: 20px;
  padding: 0;
}
#yhInfo .el-table .cell > div {
  height: 27px;
  line-height: 27px;
}
#yhInfo .el-table .first-cell {
  width: 110px;
}
#yhInfo .el-table {
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
#yhInfo .el-table th {
  padding: 3px 0;
  font-weight: normal !important;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
#yhInfo .el-table td {
  padding: 3px 0;
  border-right: 1px solid #ebeef5;
}
#yhInfo .el-table td.cell_title {
  width: 150px;
}
#yhInfo .el-table tbody td {
  padding: 0;
}
#yhInfo .el-table input {
  width: 100%;
  border-radius: 0;
  border: 0;
  height: 27px;
}
#yhInfo .no_border {
  border: 0 !important;
}
#yhInfo td.title_cell {
  width: 150px;
}
#yhInfo .el-table .el-select {
  width: 100%;
}
#yhInfo .el-table .cell_select input {
  width: 60px !important;
}
#yhInfo .el-table .cell-title {
  width: 60px !important;
}
</style>
<template>
  <div id="ClothInfo">
    <!-- ButtonGroup -->
    <ButtonGroup
      ref="myButtonGroup"
      :canSave="getCanSave"
      :canDel="canDel"
      :mainData="mainData"
      :isPart="cloth.changeToPart"
      @save="my_Save"
      @del="my_Del"
      @change="My_Change"
    ></ButtonGroup>
    <!-- MainInfo -->
    <div id="ClothInfoMainInfo">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-form :model="cloth" label-width="97px" label-position="right">
            <el-row type="flex" justify="center">
              <el-col :span="5">
                <el-form-item label="成品布版单号">
                  <el-input v-model="getVersionNum" size="mini" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="开发编号">
                  <DevNumPicker :devNumTemp.sync="cloth.devNum" :disabled="false"></DevNumPicker>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="设计风格">
                  <el-select v-model="cloth.designerStyle" size="mini" placeholder="请选择">
                    <el-option
                      v-for="item in designerStyle"
                      :key="item.dm"
                      :label="item.mc"
                      :value="item.dm"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="用途">
                  <el-select v-model="cloth.use" size="mini" placeholder="请选择">
                    <el-option
                      v-for="item in useArray"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row type="flex" justify="center">
              <el-col :span="5">
                <el-form-item label="单据号" label-width="96px">
                  <el-input v-model="cloth.documentNum" size="mini" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="源版单号" label-width="96px">
                  <el-tooltip content="右键点击或者按下回车以选择源版单号" placement="right">
                    <el-input
                      v-model="cloth.sourceVersionNum"
                      size="mini"
                      @keydown.enter.native="showSourceVersionNumPicker"
                      @click.right.native.prevent="showSourceVersionNumPicker"
                      @blur="showSourceVersionNumPicker"
                      @keydown.delete.native="clearSourceVerNum"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="制单人">
                  <el-input id="zdr" v-model="cloth.creator" size="mini" :readonly="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="制单日期">
                  <el-date-picker
                    v-model="cloth.createDate"
                    type="date"
                    :readonly="true"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    size="mini"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <SourceVersionNumPicker
        ref="SourceVersionNumPicker"
        @selectedSourceVerNum="updateSourceVerNum"
      ></SourceVersionNumPicker>
    </div>
    <!-- ColorTable -->
    <div id="ColorTable">
      <el-row type="flex">
        <el-col :span="19" :offset="3">
          <el-table :data="getColorsData()" size="mini" border>
            <el-table-column label="色号" align="center">
              <el-table-column type="index" align="center"></el-table-column>
              <el-table-column label="颜色" width="50px" align="center">
                <template v-slot:default="scope">
                  <el-input
                    v-model="scope.row.color"
                    size="mini"
                    @keydown.down.native="addRow(scope.$index, $event)"
                    @keydown.up.native="moveCell($event)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="实物贴样" align="center">
                <template v-slot:default="scope">
                  <el-input
                    v-model="scope.row.sticker"
                    size="mini"
                    @keydown.down.native="addRow(scope.$index, $event)"
                    @keydown.up.native="moveCell($event)"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="源色号" align="center">
              <template v-slot:default="scope">
                <el-tooltip content="右键点击或者按下回车以选择源色号" placement="right">
                  <el-input
                    v-model="scope.row.sourceColor"
                    size="mini"
                    @keydown.enter.native.exact="showSourceColorPicker(scope.row)"
                    @click.right.native.prevent="showSourceColorPicker(scope.row)"
                    @blur="showSourceColorPicker(scope.row)"
                    @keydown.down.native.exact="addRow(scope.$index, $event)"
                    @keydown.up.native.exact="moveCell($event)"
                    @keydown.shift.tab.native.prevent="backCell($event)"
                  >{{scope.row.sourceColor}}</el-input>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="设计师确认数量（米/kg）" align="center">
              <el-table-column v-for="(item,index) in designers" :key="index" align="right">
                <template v-slot:header="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="无效设计师，建议删除"
                    :value="delThisDesigner(item, index)"
                    :manual="true"
                    placement="top-start"
                  >
                    <el-select
                      v-model="item.designer"
                      size="mini"
                      @change="changeShow(item,index)"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option v-for="i in designerList" :key="i.dm" :label="i.mc" :value="i.dm"></el-option>
                    </el-select>
                  </el-tooltip>
                </template>
                <template v-slot:default="scope">
                  <el-input
                    v-model="scope.row['len' + (index + 1)]"
                    size="mini"
                    :disabled="item.disable"
                    oninput="value = value.replace(/[^\d.]/g,'')"
                    @keydown.down.native="addRow(scope.$index, $event)"
                    @keydown.up.native="moveCell($event)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="检测数量" align="center">
                <template v-slot:default="scope">
                  <el-input
                    v-model="scope.row.number"
                    size="mini"
                    oninput="value = value.replace(/[^\d.]/g,'')"
                    @keydown.down.native="addRow(scope.$index, $event)"
                    @keydown.up.native="moveCell($event)"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="合计" align="center">
              <template v-slot:default="scope">{{getTotal(scope.row)}}</template>
            </el-table-column>
            <el-table-column label="损耗(%)" align="center">
              <template v-slot:default="scope">{{getLossratio()}}</template>
            </el-table-column>
            <el-table-column label="损坯数量(米)" align="center">
              <template v-slot:default="scope">{{getDamagedLength(scope.row)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="scope">
                <el-button
                  type="text"
                  @click.native.prevent="insertRow(scope.$index + 1, colors)"
                  style="width:40%"
                  icon="el-icon-plus"
                  size="mini"
                ></el-button>
                <el-button
                  type="text"
                  @click.native.prevent="deleteRow(scope.row, colors)"
                  icon="el-icon-delete"
                  style="width:40%; color:#F56C6C; margin-left:0;"
                  size="mini"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <SourceColorPicker ref="SourceColorPicker" @selectedSourceColor="updateSourceColor"></SourceColorPicker>
    </div>
    <!-- ProcessInfo -->
    <div id="ProcessInfo" v-if="cloth.changeToPart">
      <el-row type="flex">
        <el-col :span="16" :offset="3">
          <el-table
            :data="getProcessData()"
            size="mini"
            id="ProcessTable"
            border
            :highlight-current-row="true"
            :default-sort="{prop: 'ProcessType'}"
          >
            <el-table-column label="子版单号" align="center">
              <template slot="header">
                <el-button
                  type="text"
                  @click.stop.native.prevent="showVerNumPicker"
                  icon="el-icon-plus"
                  size="mini"
                >插入</el-button>
                <label>子版单号</label>
              </template>
              <template v-slot:default="scope">
                <el-button
                  type="text"
                  @click="showInfo(scope.row)"
                  style="padding-top: 0px; padding-bottom: 0px;"
                >{{scope.row.versionNum}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="类型"
              prop="ProcessType"
              :sortable="true"
              :sort-method="mySort"
              align="center"
            >
              <template v-slot:default="scope">{{scope.row.ProcessTypeName}}</template>
            </el-table-column>
            <el-table-column label="制单人" prop="creator" align="center"></el-table-column>
            <el-table-column label="制单日期" prop="createDate" align="center"></el-table-column>
            <el-table-column label="供应商" prop="supplier" align="center"></el-table-column>
            <el-table-column label="织造用途" prop="yt" width="80" align="center">
              <!--<template v-slot:default="scope">
                <el-select
                  v-model="scope.row.yt"
                  :disabled="scope.row.ProcessType != 20"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in yt"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>-->
            </el-table-column>
            <el-table-column label="损耗比例" prop="loss" width="60" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template v-slot:default="scope">
                <el-button
                  type="text"
                  @click.stop.native.prevent="deleteProcessRow(scope.row, info)"
                  icon="el-icon-delete"
                  style="color:#F56C6C;"
                  size="mini"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog title="选择类型" class="myDialog" :visible.sync="dialogVisible" width="40%" center>
        <el-form style="margin-top:10px">
          <el-form-item>
            <el-button
              v-for="item in types"
              :key="item.dm"
              @click="addNewInfo(item.dm, item.mc)"
              :label="item.dm"
              size="mini"
            >{{item.mc}}</el-button>
          </el-form-item>
        </el-form>
        <ProcessPicker ref="ProcessPicker" @selectedProcess="updateSelectInfo"></ProcessPicker>
      </el-dialog>
    </div>
    <div id="ProcessInfo2" v-else>
      <el-form :inline="true">
        <el-row type="flex">
          <el-col :span="5" :offset="3">
            <el-form-item label="子版单号" label-width="85px" style="margin:0">
              <el-input v-model="cloth.cpVersionNum" size="mini" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="成品供应商" label-width="85px" style="margin:0">
              <el-tooltip content="右键点击或者按下回车以选择供应商" placement="right">
                <el-input
                  v-model="cloth.cpsupplierName"
                  size="mini"
                  @keydown.enter.native="showSupplierPicker('cp')"
                  @click.right.native.prevent="showSupplierPicker('cp')"
                  @blur="showSupplierPicker('cp')"
                ></el-input>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10" :offset="3">
            <el-form-item label="纱线要求" label-width="85px" style="margin:2px 0">
              <el-input
                type="textarea"
                style="width: 455px"
                :rows="4"
                placeholder
                v-model="cloth.sxyq"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="织造要求" label-width="85px" style="margin:2px 0">
              <el-input
                type="textarea"
                style="width: 455px"
                :rows="4"
                placeholder
                v-model="cloth.zzyq"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="10" :offset="3">
            <el-form-item label="染色要求" label-width="85px" style="margin:2px 0">
              <el-input
                type="textarea"
                style="width: 455px"
                :rows="4"
                placeholder
                v-model="cloth.rsyq"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="后整要求" label-width="85px" style="margin:2px 0">
              <el-input
                type="textarea"
                style="width: 455px"
                :rows="4"
                placeholder
                v-model="cloth.hzyq"
                size="mini"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <zpInfo
      ref="zpInfo"
      :mainData="mainData"
      :devNumTemp="cloth.devNum"
      @updataInfo="updataInfo"
      @deleteInfo="deleteInfo"
      @save="my_Save"
    ></zpInfo>
    <spInfo
      ref="spInfo"
      :mainData="mainData"
      :devNumTemp="cloth.devNum"
      @updataInfo="updataInfo"
      @deleteInfo="deleteInfo"
      @save="my_Save"
    ></spInfo>
    <sxInfo
      ref="sxInfo"
      :mainData="mainData"
      :devNumTemp="cloth.devNum"
      @updataInfo="updataInfo"
      @deleteInfo="deleteInfo"
      @save="my_Save"
    ></sxInfo>
    <rzInfo
      ref="rzInfo"
      :mainData="mainData"
      :devNumTemp="cloth.devNum"
      @updataInfo="updataInfo"
      @deleteInfo="deleteInfo"
      @save="my_Save"
    ></rzInfo>
    <yhInfo
      ref="yhInfo"
      :mainData="mainData"
      :devNumTemp="cloth.devNum"
      @updataInfo="updataInfo"
      @deleteInfo="deleteInfo"
      @save="my_Save"
    ></yhInfo>
    <SupplierPicker ref="SupplierPicker" @selected="updateSupplier"></SupplierPicker>
  </div>
</template>

<script>
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup.vue";
import SourceVersionNumPicker from "@/components/Utils/SourceVersionNumPicker.vue";
import ProcessPicker from "@/components/Utils/ProcessPicker.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";
import SourceColorPicker from "@/components/Utils/SourceColorPicker.vue";
import SupplierPicker from "@/components/Utils/SupplierPicker.vue";
import zpInfo from "@/components/Processs/zpInfo.vue";
import spInfo from "@/components/Processs/spInfo.vue";
import sxInfo from "@/components/Processs/sxInfo.vue";
import rzInfo from "@/components/Processs/rzInfo.vue";
import yhInfo from "@/components/Processs/yhInfo.vue";

export default {
  name: "clothInfo",
  inject: ["reload"],
  components: {
    ButtonGroup,
    SourceVersionNumPicker,
    ProcessPicker,
    DevNumPicker,
    SourceColorPicker,
    SupplierPicker,
    zpInfo,
    spInfo,
    sxInfo,
    rzInfo,
    yhInfo
  },
  data: function() {
    return {
      mainData: {
        myDJid: 0,
        djlx: 12330,
        tzid: 18069,
        creatorID: "",
        creator: "",
        flowid: 481
      },
      initData: [],
      canDel: false,
      cxlx: "",
      // MainInfo
      cloth: {
        versionNum: "",
        devNum: "",
        designerStyle: "",
        documentNum: "保存后自动生成",
        use: "",
        sourceVersionNum: "",
        creator: "",
        createDate: new Date(),
        cpid: 0,
        cpgxid: 0,
        cpVersionNum: "",
        cpsupplierId: 0,
        cpsupplierName: "",
        sxyq: "",
        zzyq: "",
        rsyq: "",
        hzyq: "",
        changeToPart: true,
        gxlx: 0
      },
      designerStyle: [],
      useArray: [
        { value: "面料" },
        { value: "里料" },
        { value: "针织配件" },
        { value: "通道布" }
      ],
      // ColorTable
      designerList: [],
      designersMxid: 0,
      designers: [
        { designer: "", disable: true },
        { designer: "", disable: true },
        { designer: "", disable: true },
        { designer: "", disable: true },
        { designer: "", disable: true },
        { designer: "", disable: true }
      ],
      colors: [
        {
          mxid: 0,
          color: "",
          sticker: "",
          sourceColorId: 0,
          sourceColor: "",
          len1: "",
          len2: "",
          len3: "",
          len4: "",
          len5: "",
          len6: "",
          number: 1,
          total: 0,
          loss: 0,
          damagedLength: "",
          isDel: 0
        }
      ],
      // ProcessInfo
      types: [],
      dialogVisible: false,
      info: [
        // 去掉默认
        /* {
          id: 0,
          versionNum: "",
          ProcessType: 20,
          ProcessTypeName: "纱线",
          parentID: Number(this.$route.query.MyDJid),
          creator: "",
          createDate: this.myGetDate(),
          supplier: "",
          yt: "",
          loss: 0,
          gxid: 0,
          isDel: 0
        } */
      ],
      rules: {
        newValue: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      banBlurEvent: false
    };
  },
  methods: {
    // 参数初始化及简单验证
    init: function() {
      console.log(this.$route)
      let _this = this;
      // if (_this.$route.query.gxlx) {
      //   if (Number(_this.$route.query.gxlx) != 5) {
      //     _this.$confirm("请通过成品布查看加工信息", "Tip", {
      //       confirmButtonText: "确定",
      //       callback: action => {
      //         this.$refs["myButtonGroup"].My_Close();
      //       }
      //     });
      //     return;
      //   }
      // }
      if (_this.$route.query.MyDJid) {
        _this.mainData.myDJid = Number(_this.$route.query.MyDJid);
        if (_this.mainData.myDJid != 0) {
          _this.canDel = true;
        }
      }
      if (_this.$route.query.cxlx) {
        _this.cxlx = _this.$route.query.cxlx;
      }
      if (_this.$route.query.tzid) {
        _this.mainData.tzid = Number(_this.$route.query.tzid);
      }
      if (_this.$route.query.creatorID) {
        _this.mainData.creatorID = Number(_this.$route.query.creatorID);
      } else {
        _this.$confirm("参数不合法", "Tip", {
          confirmButtonText: "确定",
          callback: action => {
            _this.$refs["myButtonGroup"].My_Close();
          }
        });
        return;
      }
      const load = _this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      _this.$axios
        // .get(APIUTL + "/getInitInfo", {
        .get(APIUTL, {
          params: {
            action: "getInitInfo",
            id: _this.mainData.myDJid,
            userssid: _this.mainData.creatorID
          }
        })
        .then(function(response) {
          if (response.data.errcode == 5010) {
            _this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: "error"
            });
            load.close();
            return;
          }
          _this.initData = response.data.data;
          _this.designerStyle = response.data.data[0];
          _this.designerList = response.data.data[1];
          _this.types = response.data.data[2];
          _this.mainData.creator = response.data.data[3][0].cname;
          // 初始化制单人
          _this.cloth.creator = _this.mainData.creator;
          if (_this.mainData.myDJid) {
            // MainInfo
            let data = response.data.data[4][0];
            if (data) {
              if (data.changeToPart == 1) {
                data.changeToPart = true;
              } else {
                data.changeToPart = false;
              }
              _this.cloth = data;
              // 非制单人不能保存
              _this.canDel = _this.cloth.creator == _this.mainData.creator;
              // if (response.data.data[7].length == 0) {
              //   _this.cloth.changeToPart = false;
              // }
            } else {
              _this.$confirm("参数不合法，没有这条信息！", "Tip", {
                confirmButtonText: "确定",
                callback: action => {
                  _this.loading = false;
                  _this.$refs["myButtonGroup"].My_Close();
                }
              });
            }
            // ColorTable
            _this.colors = response.data.data[5];
            if (response.data.data[6][0]) {
              _this.designersMxid = response.data.data[6][0].mxid;
              for (let i = 0; i < 6; i++) {
                let designer = Number(
                  response.data.data[6][0]["xmsx_" + (i + 1)]
                );
                if (designer != -1) {
                  _this.designers[i].designer = designer;
                  _this.designers[i].disable = false;
                }
              }
            }
            // ProcessInfo
            if (response.data.data[7].length != 0) {
              _this.info = response.data.data[7];
            }
            // // 判断当前记录是否是整布还是工艺部分（纱线、坯布、印花、染整）
            let gxlx = _this.cloth.gxlx;
            if (gxlx != 5 && gxlx != 10) {
              _this.cloth.changeToPart = true;
              if (_this.cloth.gxlx == 20) {
                _this.$refs.sxInfo.showSingle(_this.mainData.myDJid, gxlx);
              } else if (_this.cloth.gxlx == 30) {
                _this.$refs.zpInfo.showSingle(_this.mainData.myDJid, gxlx);
              } else if (_this.cloth.gxlx == 40) {
                _this.$refs.spInfo.showSingle(_this.mainData.myDJid, gxlx);
              } else if (_this.cloth.gxlx == 50) {
                _this.$refs.yhInfo.showSingle(_this.mainData.myDJid, gxlx);
              } else if (_this.cloth.gxlx == 60) {
                _this.$refs.rzInfo.showSingle(_this.mainData.myDJid, gxlx);
              }
            }
          }
          load.close();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // 保存
    my_Save: function() {
      // console.log(JSON.stringify(this.mainData));
      // console.log(JSON.stringify(this.cloth));
      // console.log(JSON.stringify(this.getColors()));
      // console.log(JSON.stringify(this.info));
      // 请求保存数据;
      this.$refs.myButtonGroup.setAbleSave(true);
      if (!this.cloth.devNum) {
        this.$message({
          showClose: true,
          message: "请选择一个开发编号",
          type: "warning"
        });
        _this.$refs.myButtonGroup.setAbleSave(false);
        return;
      }
      if (this.getColors()[2].length == 0) {
        this.$message({
          showClose: true,
          message: "请至少输入一条颜色信息",
          type: "warning"
        });
        _this.$refs.myButtonGroup.setAbleSave(true);
        return;
      }
      let _this = this;
      _this.$axiosPost
        .post(APIUTL + "?action=doSave", {
          mainData: this.mainData,
          clothData: this.cloth,
          colorData: this.getColors(),
          processData: this.getInfo()
        })
        .then(function(response) {
          if (response.data.errcode == 5010) {
            _this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: "error"
            });
            _this.$refs.myButtonGroup.setAbleSave(true);
            return;
          }
          if (
            response.data.data[0][0]["id"] != 0 &&
            response.data.data[0][0]["id"] != null
          ) {
            _this.$message({
              showClose: true,
              message: "保存成功",
              type: "success"
            });
            _this.$refs.myButtonGroup.setAbleSave(true);
            _this.$router.replace({
              path: "/",
              query: {
                MyDJid: response.data.data[0][0]["id"],
                creatorID: _this.mainData.creatorID
              }
            });
            _this.reload();
          } else {
            _this.$message({
              showClose: true,
              message: "保存失败",
              type: "error"
            });
            _this.$refs.myButtonGroup.setAbleSave(true);
          }
        })
        .catch(function(error) {
          _this.$message({
            showClose: true,
            message: "保存失败！" + error,
            type: "error"
          });
          _this.$refs.myButtonGroup.setAbleSave(true);
        });
    },
    // 删除
    my_Del: function() {
      // console.log(this.getInfo().filter(item => item.isDel == 0).length);
      if (this.getInfo().filter(item => item.isDel == 0).length != 0) {
        this.$message({
          showClose: true,
          message: "请先移除当前成品布版单号下的所有子版单号",
          type: "error"
        });
        return;
      }
      this.$confirm("是否删除该成品布版单号！", "Tip", {
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        // 因为子版单号可复用，所以仅删除父版单号信息以及父版单号与子版单号的关系记录
        const load = this.$loading({
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)"
        });
        let _this = this;
        _this.$axios
          .get(APIUTL, {
            params: {
              action: "doDelParent",
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
            if (response.data.data >= 1) {
              _this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              _this.$refs["myButtonGroup"].My_Close();
            } else {
              _this.$message({
                showClose: true,
                message: "删除失败或数据不存在",
                type: "error"
              });
            }
            load.close();
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    // 显示源版单号选择器
    showSourceVersionNumPicker: function() {
      this.$refs.SourceVersionNumPicker.init(
        this.cloth.sourceVersionNum,
        this.cloth.devNum
      );
    },
    // 跟新选中的源版单号
    updateSourceVerNum: function(sourceVersionNum) {
      this.cloth.sourceVersionNum = sourceVersionNum;
    },
    // 清除当前源版单号
    clearSourceVerNum: function() {
      this.cloth.sourceVersionNum = "";
    },
    // 返回过滤后（颜色不为空）的颜色数据
    getColors: function() {
      return [
        { designersMxid: this.designersMxid },
        this.designers,
        this.colors.filter(item => item.color.trim() != "")
      ];
    },
    // 删除当前行
    deleteRow(row, array) {
      const h = this.$createElement;
      this.$confirm(
        h("p", null, [
          h("span", null, "是否删除 ["),
          h("font", { style: "color: #E6A23C" }, row.color),
          h("span", null, "] 该颜色信息？")
        ]),
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        if (row.mxid) {
          row.isDel = 1;
        } else {
          array.splice(array.indexOf(row), 1);
        }
        if (this.getColorsData().length == 0) {
          this.insertRow(0, array);
          this.designers = [
            { designer: "", disable: true },
            { designer: "", disable: true },
            { designer: "", disable: true },
            { designer: "", disable: true },
            { designer: "", disable: true },
            { designer: "", disable: true }
          ];
        }
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
    // 插入一行
    async insertRow(index, array) {
      await array.splice(index, 0, {
        mxid: 0,
        color: "",
        sticker: "",
        sourceColorId: 0,
        sourceColor: "",
        len1: "",
        len2: "",
        len3: "",
        len4: "",
        len5: "",
        len6: "",
        number: 1,
        total: 0,
        loss: 0,
        damagedLength: "",
        isDel: 0
      });
      return 1;
    },
    // 根据选择的设计师改变文本框只读
    changeShow: function(item, index) {
      if (item.designer == "") {
        item.disable = true;
        for (let i = 0; i < this.colors.length; i++) {
          this.colors[i]["len" + (index + 1)] = "";
        }
      } else {
        for (let i = 0; i < this.designers.length; i++) {
          if (item.designer == this.designers[i].designer && i != index) {
            this.$message.error("该设计师已选择！");
            item.designer = null;
            return;
          }
        }
        item.disable = false;
      }
    },
    // 通过方向键 ↓ 来添加行或者向下移动光标
    addRow: function(index, item) {
      let cells = document
        .getElementById("ColorTable")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("input");
      let rowLen = document
        .getElementById("ColorTable")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("input").length;
      if (index == this.getColorsData().length - 1) {
        this.insertRow(this.colors.length, this.colors).then(function() {
          cells = document
            .getElementById("ColorTable")
            .getElementsByTagName("tbody")[0]
            .getElementsByTagName("input");
          for (let i = 0; i < cells.length; i++) {
            if (item.target === cells[i]) {
              if (i + rowLen <= cells.length) {
                cells[i + rowLen].focus();
              }
              break;
            }
          }
        });
      } else {
        for (let i = 0; i < cells.length; i++) {
          if (item.target === cells[i]) {
            if (i + rowLen <= cells.length) {
              cells[i + rowLen].focus();
            }
            break;
          }
        }
      }
    },
    // 通过方向键 ↑ 来向上移动光标
    moveCell: function(item) {
      let cells = document
        .getElementById("ColorTable")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("input");
      let rowLen = document
        .getElementById("ColorTable")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr")[0]
        .getElementsByTagName("input").length;
      for (let i = 0; i < cells.length; i++) {
        if (item.target === cells[i]) {
          if (i - rowLen >= 0) {
            cells[i - rowLen].focus();
          }
          break;
        }
      }
    },
    // 移动焦点时手动操作，以忽略选择器的触发事件
    backCell: function(item) {
      let cells = document
        .getElementById("ColorTable")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("input");
      for (let i = 0; i < cells.length; i++) {
        if (item.target === cells[i]) {
          if (i - 1 >= 0) {
            cells[i - 1].focus();
          }
          break;
        }
      }
    },
    // 显示源色号选择器
    showSourceColorPicker: function(row) {
      if (this.cloth.sourceVersionNum) {
        let index = this.colors.indexOf(row);
        this.$refs.SourceColorPicker.init(
          index,
          this.cloth.sourceVersionNum,
          row.sourceColor
        );
      } else {
        this.$message({
          message: "请先选择一个源版单号！",
          type: "warning"
        });
      }
    },
    // 更新选中的源色号
    updateSourceColor: function(name, id, index) {
      this.colors[index].sourceColorId = id;
      this.colors[index].sourceColor = name;
    },
    // ProcessInfo
    // 切换【加工】和【成品】
    My_Change: function() {
      this.cloth.changeToPart = !this.cloth.changeToPart;
    },
    // 获取当前有效的工艺分解列表
    getInfo: function() {
      return this.info.filter(item => item.versionNum.trim() != "");
    },
    // 显示子版单号插入框
    showVerNumPicker: function() {
      if (this.mainData.myDJid == 0) {
        this.$message({
          showClose: true,
          message: "请先保存当前整布信息",
          type: "warning"
        });
        return;
      }
      // 打开前清空查询结果，防止已删除子版单号仍然存在
      if (this.$refs["ProcessPicker"]) {
        this.$refs.ProcessPicker.clearProcesss();
      }
      this.dialogVisible = true;
    },
    // 显示工艺部分的填写抽屉
    showInfo: function(row) {
      if (this.mainData.myDJid == 0) {
        this.$message({
          showClose: true,
          message: "请先保存当前整布信息",
          type: "warning"
        });
        return;
      }
      if (row.ProcessType == 20) {
        this.$refs.sxInfo.show(
          row.id,
          this.info.indexOf(row),
          row.gxid,
          row.yt,
          row.ProcessType
        );
      } else if (row.ProcessType == 30) {
        this.$refs.zpInfo.show(
          row.id,
          this.info.indexOf(row),
          row.gxid,
          row.ProcessType
        );
      } else if (row.ProcessType == 40) {
        this.$refs.spInfo.show(
          row.id,
          this.info.indexOf(row),
          row.gxid,
          row.ProcessType
        );
      } else if (row.ProcessType == 50) {
        this.$refs.yhInfo.show(
          row.id,
          this.info.indexOf(row),
          row.gxid,
          row.ProcessType
        );
      } else if (row.ProcessType == 60) {
        this.$refs.rzInfo.show(
          row.id,
          this.info.indexOf(row),
          row.gxid,
          row.loss,
          row.ProcessType
        );
      }
    },
    // 更新抽屉中填写的工艺部分信息
    updataInfo: function(
      id,
      gxid,
      supplier,
      versionNum,
      loss,
      index,
      zdr,
      zdrq,
      yt
    ) {
      this.info[index].id = id;
      this.info[index].gxid = gxid;
      this.info[index].supplier = supplier;
      this.info[index].loss = loss;
      this.info[index].versionNum = versionNum;
      this.info[index].creator = zdr;
      this.info[index].createDate = zdrq;
      this.info[index].yt = yt;
    },
    // 移除选中工艺部分信息
    deleteProcessRow(row, array) {
      const h = this.$createElement;
      this.$confirm(
        h("p", null, [
          h("span", null, "是否移除 ["),
          h("font", { style: "color: #E6A23C" }, row.versionNum),
          h("span", null, "] 该 "),
          h("font", { style: "color: #E6A23C" }, row.ProcessTypeName),
          h("span", null, " 信息？")
        ]),
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (row.gxid) {
            row.isDel = 1;
          } else {
            array.splice(array.indexOf(row), 1);
          }
          if (array.length == 0) {
            this.dialogVisible = true;
          }
          this.$message({
            type: "success",
            message: "移除成功!"
          });
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 更新（已存在的）选中的工艺部分信息
    updateSelectInfo(row) {
      // if (row.id) {
      //   for (let i = 0; i < this.info.length; i++) {
      //     if (this.info[i].id == row.id && this.info[i].isDel == 0) {
      //       this.$message({
      //         type: "warning",
      //         message: "该部分已存在!"
      //       });
      //       return;
      //     }
      //   }
      // }
      let data = {
        id: row.id,
        versionNum: row.versionNum,
        ProcessType: row.type,
        ProcessTypeName: row.name,
        creator: this.mainData.creator,
        createDate: this.myGetDate(),
        supplier: row.supplier,
        parentID: this.mainData.myDJid,
        yt: "",
        loss: 0,
        gxid: 0,
        isDel: 0
      };
      let lastindex = this.info.length - 1;
      this.info.splice(lastindex, 0, data);
      this.dialogVisible = false;
      this.showInfo(data);
    },
    // 移除被删除子版单号
    deleteInfo(index) {
      this.info.splice(index, 1);
    },
    // 根据工艺部分类型（新增新子版单号）插入新的工艺部分行
    addNewInfo(type, name) {
      let lastindex = this.info.length - 1;
      let data = {
        id: 0,
        versionNum: "",
        ProcessType: type,
        ProcessTypeName: name,
        creator: this.mainData.creator,
        createDate: this.myGetDate(),
        supplier: "",
        parentID: this.mainData.myDJid,
        yt: "",
        loss: 0,
        gxid: 0,
        isDel: 0
      };
      this.info.splice(lastindex, 0, data);

      this.dialogVisible = false;
      this.showInfo(data);
    },
    // 工艺部分排序
    mySort: function(a, b) {
      // 同类型按照创建时间排序
      if (a.ProcessType == b.ProcessType) {
        return new Date(a.createDate) - new Date(b.createDate);
      }
      return a.ProcessType - b.ProcessType;
    },
    // 获取当前时间
    myGetDate: function() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      return year + "-" + month + "-" + day;
    },
    // 显示供货商选择框
    showSupplierPicker: function(type) {
      this.$refs.SupplierPicker.init(type, this.cloth.cpsupplierName);
    },
    // 更新选中的供货商
    updateSupplier: function(id, name, type) {
      this.cloth[type + "supplierId"] = id;
      this.cloth[type + "supplierName"] = name;
    }
  },
  computed: {
    // 返回当前制单人或当前查询类型是否可以执行保存操作
    getCanSave: function() {
      // 当前查询方式是cx
      if (this.cxlx) return this.cxlx != "cx";
      // 当前myDJid是成品
      if (this.cloth.gxlx == 10) return false;
      // 非制单人
      if (this.mainData.creator && this.cloth.creator)
        return this.mainData.creator == this.cloth.creator;
      return true;
    },
    // 返回版单号
    getVersionNum: function() {
      if (
        this.cloth.devNum &&
        this.cloth.documentNum &&
        this.cloth.documentNum != "保存后自动生成"
      ) {
        this.cloth.versionNum = this.cloth.devNum + this.cloth.documentNum;
      } else {
        return "保存后自动生成";
      }

      return this.cloth.versionNum;
    },
    // 返回源版单号
    sourceVersionNum: function() {
      return this.cloth.sourceVersionNum;
    },
    // 返回过滤后（未被删除）的颜色信息
    getColorsData: function() {
      return function() {
        return this.colors.filter(item => item.isDel == 0);
      };
    },
    // 返回过滤后（未被删除）的工艺部分信息
    getProcessData: function() {
      return function() {
        return this.info.filter(item => item.isDel == 0);
      };
    },
    // 返回当前设计师是否有效，无效（当前设计师没有检测数量）建议删除
    delThisDesigner: function() {
      return function(item, index) {
        if (!item.disable) {
          for (let i = 0; i < this.colors.length; i++) {
            if (this.colors[i]["len" + (index + 1)]) {
              return false;
            }
          }
          return true;
        }
        return false;
      };
    },
    // 返回当前颜色的合计检测数量
    getTotal: function() {
      return function(row) {
        row.total = (
          Number(row.len1) +
          Number(row.len2) +
          Number(row.len3) +
          Number(row.len4) +
          Number(row.len5) +
          Number(row.len6) +
          Number(row.number)
        ).toFixed(2);
        return row.total;
      };
    },
    // 返回总损耗
    getLossratio: function() {
      return function() {
        if (!this.cloth.changeToPart) {
          return 0;
        }
        let sum = 0;
        for (let i = 0; i < this.info.length; i++) {
          if (this.info[i].ProcessType != 20) sum += Number(this.info[i].loss);
        }
        for (let i = 0; i < this.colors.length; i++) {
          this.colors[i].loss = sum;
        }
        return sum;
      };
    },
    // 返回损耗数量
    getDamagedLength: function() {
      return function(row) {
        row.damagedLength = (
          (row.total / (100 - this.getLossratio())) *
          100
        ).toFixed(2);
        return row.damagedLength;
      };
    }
  },
  created: function() {
    this.init();

  }
};
</script>

<style>
body .el-table th.gutter {
  display: table-cell !important;
}
#ClothInfoMainInfo {
  margin: 10px 0;
}
#ClothInfoMainInfo .el-form-item {
  margin-bottom: 5px;
}
#ClothInfoMainInfo .el-date-editor.el-input {
  width: 100%;
}
#ClothInfoMainInfo .el-select {
  display: block;
}
#ColorTable {
  margin: 10px 0;
}
#ColorTable th {
  font-weight: normal !important;
}
#ColorTable .el-table thead {
  color: unset;
}
#ColorTable .el-select,
#ColorTable .el-select > * {
  padding: 0 !important;
}
#ColorTable .cell,
#ColorTable .el-table__row > td {
  vertical-align: middle;
  padding: 0;
  height: 28px;
  line-height: 28px;
}
#ColorTable .el-table__header .is-group > tr > th {
  padding: 0 !important;
}
#ColorTable .el-table th div {
  line-height: 28px;
}
#ColorTable .cell .el-input__inner {
  border: 0;
  text-align: center;
}
#ProcessInfo th {
  font-weight: normal !important;
}
#ProcessInfo .el-table thead {
  color: unset;
}
#ProcessInfo .el-select,
#ProcessInfo .el-select > * {
  padding: 0 !important;
}
#ProcessInfo .cell,
#ProcessInfo .el-table__row > td {
  vertical-align: middle;
  padding: 0px;
  line-height: 28px;
  height: 28px;
}
#ProcessInfo .el-table td div.el-select div,
#ProcessInfo .el-table td div.el-select span,
#ProcessInfo .el-table td div.el-select i,
#ProcessInfo .el-table td div.el-select input {
  text-align: center;
  line-height: 28px;
  height: 28px;
}
#ProcessInfo .cell .el-input__inner {
  text-align: center;
  border: 0;
}
#ProcessInfo .el-dialog__body {
  text-align: center;
}
#ProcessInfo .el-button {
  font-size: 12px;
}
#ProcessInfo .el-dialog__title {
  font-size: 14px;
}
.el-drawer__body {
  padding: 20px !important;
}
#ProcessInfo2 .el-textarea__inner {
  padding: 0 5px;
}
</style>

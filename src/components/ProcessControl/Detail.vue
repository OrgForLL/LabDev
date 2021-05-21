<template>
  <div id="Detail">
    <div  v-show="colVisible">
   
        <!--详情页-->
        <div v-loading="loading">
          <van-collapse class="wrapDetail" style="margin: 0px 10px 0px 10px" v-model="activeName">
            <van-collapse-item title="基本信息" disabled name="1">
              <template #right-icon>
                    <div><van-icon name="setting-o" /></div>
              </template>              
              <van-cell-group>
                <van-cell
                  v-for="item in mdata.title"
                  :key="item.mc"
                  :title="item.mc"
                  :value="item.value"
                />
              </van-cell-group>

              <!-- <div
              v-for="item in mdata.title"
              :key="item.mc"
              class="text item title-context"
            >
              <div>{{ item.mc }}</div>
              <div style="text-align: right">{{ item.value }}</div>
            </div> -->

              <van-cell-group
                v-for="item in mdata.title_cl"
                :key="item.mc + item.ghs"
                :title="item.ghs"
              >
                <van-cell :title="item.mc" :value="item.value" />
              </van-cell-group>

              <!-- <div
                v-for="item in mdata.title_cl"
                :key="item.mc + item.ghs"
                class="text item"
              >
                <div>{{ item.ghs }}</div>
                <div class="title-context">
                  <div>{{ item.mc }}</div>
                  <div style="text-align: right">{{ item.value }}</div>
                </div>
              </div> -->
            </van-collapse-item>
            <van-collapse-item title="标签信息" name="2">
              <van-cell-group>
                <van-cell
                  v-for="item in mdata.bq"
                  :key="item.mc + item.value"
                  :value="item.value"
                >
                  <template #title>
                    <img
                      v-if="item.lx == 'img'"
                      style="width: 3mm"
                      v-bind:src="item.mc"
                    />
                    <span v-else class="custom-title">{{ item.mc }}</span>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-collapse-item>
            <van-collapse-item title="工艺单" name="3">
              <a
                v-show="mdata.gydSrc.length > 0 ? true : false"
                :href="mdata.gydSrc"
                >查看</a
              >
            </van-collapse-item>
            <van-collapse-item title="配料卡" name="4">
              <a
                v-show="mdata.plkSrc.length > 0 ? true : false"
                :href="mdata.plkSrc"
                >查看</a
              >
            </van-collapse-item>
            <van-collapse-item title="面料报告" name="5">
              <van-cell-group>
                <van-cell
                  v-for="item in mdata.mlbgList"
                  :key="item.Docid"
                  :title="item.Bgbh"
                  @click="
                    item.show = true;
                    colVisible = false;
                  "
                  is-link
                />
              </van-cell-group>
            </van-collapse-item>
            <van-collapse-item title="实验室检测" name="9"> </van-collapse-item>
            <van-collapse-item title="产前封样" name="10"> </van-collapse-item>
            <van-collapse-item title="生产过程信息记录" name="6">
              <!-- <input
                type="file"
                name="file"
                ref="filElem"
                class="upload"
                style="display: none"
                multiple
                @change="uploadImg"
              /> -->
              <div
                v-for="item in mdata.lxDataList.detail"
                v-bind:key="item.Id"
                class="text item"
              >
              <div v-if="item.Id == 0">
                 <van-divider>跟踪事项</van-divider>
                <van-field
                  v-model="item.Cpbz"
                  rows="2"
                  autosize                  
                  type="textarea"
                  placeholder="请输入跟踪事项"
                >      
                 <template #button>
                  <van-button size="small" type="primary" @click="saveImg(item.Id)">新增</van-button>
                </template>
                </van-field>            
              </div>              
                <div v-else>
                  <div style="text-align: center; margin-bottom: 5px">
                    <van-divider><van-icon name="contact"></van-icon>{{ item.Zdr }} {{ item.Zdrq }}</van-divider>                     
                  </div>
                  <van-row>
                    <!-- <van-col :span="3"> -->                     
                      <!-- <div class="block">
                        <el-avatar
                          shape="square"
                          style="font-size: 12px"
                          :size="40"
                          >{{ item.Zdr }}</el-avatar
                        >
                      </div> -->
                    <!-- </van-col> -->
                    <van-col :span="21">
                      <van-grid :border="false" :column-num="2">
                        <van-grid-item 
                        v-for="(img,index) in item.imgList"
                        :key="img.URLAddress" 
                        >
                          <van-image :src="img.URLAddress" width="100" @click="ImageClick(item,index)" />
                        </van-grid-item>
                       
                      </van-grid>

                      <!-- <van-image
                        v-for="img in item.imgList"
                        :key="img.URLAddress"                       
                        :src="img.URLAddress"
                      ></van-image> -->                     
                      <div style="margin-left: 10px">{{ item.Cpbz }}</div>
                    </van-col>
                    <van-col :span="3">
                      
                      <van-button icon="upgrade" size="small" type="primary" 
                      @click="choiceImg(item.Id,mdata.lxDataList.groupid)"
                        v-show="item.Zdr == userInfo.cname ? true : false"
                      />                      
                    </van-col>
                  </van-row>
                </div>
              </div>
            </van-collapse-item >
            <van-collapse-item :title="'产中拍照'" name="11">
              <van-collapse  style="margin: 0px 0px 0px 0px" v-model="imgActiveName">
                <van-collapse-item 
                v-for="lbitem in mdata.groupname"
                :key="lbitem.groupname"
                :title="lbitem.groupname"
                :name="lbitem.key"
                >

              <van-grid :border="false" :column-num="2">

              <van-grid-item
                v-for="item in filterImg(lbitem.groupname)"
                  :key="item.groupid"
              >
                  <van-row  v-if="item.imgList.length>0">                    
                    <van-col :span="24">                     
                        <van-grid :border="false" :column-num="2">
                          <van-grid-item 
                          v-for="(img,index) in item.imgList"
                          :key="img.URLAddress" 
                          >
                            <van-image v-if="item.name=='其它' || 1==1" :src="img.URLAddress" width="100" @click="choiceImg(mdata.zlmxid,item.groupid)" />
                            <van-image v-else :src="img.URLAddress" width="100" @click="ImageClick(item,index)" />
                          </van-grid-item>
                        </van-grid>   
                    </van-col>                  
                  </van-row>
                   <div v-else >                     
                       <van-image :src="'http://webt.lilang.com:9001/tl_yf/vueimg/'+item.default" width="100" @click="choiceImg(mdata.zlmxid,item.groupid)" />                      
                    </div>

              </van-grid-item>              
            </van-grid>

                </van-collapse-item>
              </van-collapse>


            </van-collapse-item>
            <van-collapse-item :title="'成品报告 入库数：' + this.Rksl" name="7">
              <van-row style="font-weight: 800">
                <van-col span="7">报告号</van-col>
                <van-col span="10">入库意见</van-col>
                <van-col span="5">数量</van-col>
                <van-col span="2"></van-col>
              </van-row>

              <van-row
                type="flex"
                v-for="(item, index) in mdata.rkbgList"
                :key="index"
                :name="index"
                align="center"
                style="font-size: 14px"
                @click="
                  item.show = true;
                  colVisible = false;
                "
                :class="[index%2==0 ? 'thListColr' : '']"   
              >
                <van-col span="7">{{ item.Bgbh }}</van-col>
                <van-col span="10">{{ item.Zpdjg }}</van-col>
                <van-col span="5">{{ item.Sl }}</van-col>
                <van-col span="2"><van-icon name="arrow" /></van-col>
              </van-row>
            
            </van-collapse-item>
            <van-collapse-item :title="'退货分析 退货数：' + this.Tksl" name="8">
              <van-row style="font-weight: 800">
                <van-col span="5">退货原因</van-col>
                <van-col span="5">责任归属</van-col>
                <van-col span="5">判定结果</van-col>
                <van-col span="4">数量</van-col>
                <van-col span="5">判定人</van-col>
              </van-row>
              <van-row
                type="flex"
                v-for="(item, index) in mdata.thList"
                :key="index"
                :name="index"
                align="center"
                style="font-size: 14px"  
                :class="[index%2==0 ? 'thListColr' : '']"              
              >
                <van-col span="5">{{item.Thyy}}</van-col>
                <van-col span="5">{{item.Zrgs}}</van-col>
                <van-col span="5">{{item.Cljg}}</van-col>
                <van-col span="4">{{item.Sl}}</van-col>
                <van-col span="5">{{item.Npdr}}</van-col>
              </van-row>

              <!-- <el-table :data="mdata.thList" style="width: 100%">
                <el-table-column label="退货原因" prop="Thyy" width="25%">
                </el-table-column>
                <el-table-column prop="Zrgs" label="责任归属" width="4%">
                </el-table-column>
                <el-table-column prop="Cljg" width="30%" label="判定结果">
                </el-table-column>
                <el-table-column prop="Sl" width="4%" label="数量">
                </el-table-column>
                <el-table-column prop="Npdr" width="5%" label="判定人">
                </el-table-column>
              </el-table> -->
            </van-collapse-item>
          </van-collapse>
        
        </div>    
      <van-tabbar v-model="vanTabbarActive" @change="scanGoback">
        <van-tabbar-item name="close" icon="certificate">返回</van-tabbar-item>
      </van-tabbar>      
    </div>

    <div v-for="item in mdata.mlbgList" :key="item.Docid">
      <FlowLog v-if="item.show" @goback="mlbgGoback(item)" v-bind:parIn="item">
      </FlowLog>
    </div>
    <div v-for="item in mdata.rkbgList" :key="item.Docid">
      <FlowLog v-if="item.show" @goback="mlbgGoback(item)" v-bind:parIn="item">
      </FlowLog>
    </div>

    <van-overlay
      z-index="21"
      :show="uploadVisible"       
    >
      <div class="wrapper" @click.stop>
        <div class="block">
          <UploadVant
            :visible.sync="uploadVisible"
            :groupid="mdata.currentGroupid"
            :tableid="mdata.currentMydjid"
            :keys.sync="UploadVantKeys"
            :qx="uploadQx"
            :deleteQx="true"
          ></UploadVant>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import EXIF from "exif-js";
import UploadVant from "@/components/Utils/UploadVant.vue";
import { Field as VanField } from "vant";
import { Col as VanCol } from "vant";
import { Row as VanRow } from "vant";
import { Icon as VanIcon } from "vant";
import { Toast as VanToast } from "vant";
import { Collapse as VanCollapse } from "vant";
import { CollapseItem as VanCollapseItem } from "vant";
import { Overlay as VanOverlay } from "vant";
import { Tabbar as VanTabbar } from "vant";
import { TabbarItem as VanTabbarItem } from "vant";
import { NoticeBar as VanNoticeBar } from "vant";
import { Image as VanImage } from "vant";
import { Grid as VanGrid } from "vant";
import { GridItem as VanGridItem } from "vant";
import { Button as VanButton } from "vant";
import { ImagePreview } from 'vant';
import { Divider as VanDivider } from "vant";

export default {
  name: "Detail",
  components: {
    FlowLog: () => import("@/components/Utils/FlowLog"),
    NgvCollecBtn: () => import("@/components/Utils/NgvCollecBtn"),
     [ImagePreview.Component.name]: ImagePreview.Component,
    VanField,
    VanRow,
    VanCol,
    VanIcon,
    UploadVant,
    VanOverlay,VanCollapse,VanCollapseItem,VanTabbar,
    VanTabbarItem,VanNoticeBar,VanImage,VanGrid,VanGridItem,VanButton,VanDivider,VanToast
  },
  props: {
    sphhIn: String,
  },
  data: function () {
    return {
      vanTabbarActive:"",
      mainHeight: {
        height: "60px",
        paddingLeft: "0px",
        paddingRight: "0px",
      },
      footHeight: {
        height: "60px",
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom: "20px",
        lineHeight: "60px",
        textAlign: "right",
      },

      userInfo: this.$status.userInfo,
      mdata: {
        sphh: this.sphhIn,
        zlmxid:0,
        title: [
          // { mc: "xxxxxx", value: "bbbbb" },
          // { mc: "xxxxxx1", value: "bbbbb3" },
          // { mc: "xxxxxx2", value: "bbbbb4" },
        ],
        title_cl: [
          // { ghs: "test", mc: "xxxxxx", value: "bbbbb" },
          // { ghs: "test", mc: "b", value: "bbbbb" },
        ],
        bq: [
          // { lx: "img", mc: "xxxxxx", value: "bbbbb" },
          // { mc: "xxxxxx1", value: "bbbbb3" },
          // { mc: "xxxxxx2", value: "bbbbb4" },
        ],
        gydSrc: "", //工艺单
        plkSrc: "", //配料卡
        mlbgList: [], //面料报告
        rkbgList: [], //成品报告
        thList: [], //退货列表
        currentMydjid: 0, //当前选择图片是对应哪个mydjid
        currentGroupid: 0, //当前选择图片是对应哪个mydjid
        lxDataList: {
          //生产过程信息记录
          groupid: 4320,          
          detail: [
            {
              Id: 0,
              Zdrq: "2020-10-10",
              Zdr: "abc",
              Cpbz: "abc",
              Sphh: "",
              imgList: [],
            },
            {
              Id: 124,
              Zdrq: "2020-10-10",
              Zdr: "efg",
              Cpbz: "efg",
              Sphh: "",
              imgList: [],
            },
          ],
        },
        groupname:[],
        groupids:[
          {groupname:"产前准备",name:'面料缩率报告',groupid:10001,imgList:[],default:"mlslbg.png"},
          {groupname:"产前准备",name:'烫衬样',groupid:10002,imgList:[],default:"tcy.png"},
          {groupname:"产前准备",name:'预缩/松布',groupid:10003,imgList:[],default:"yssb.png"},
          {groupname:"产前准备",name:'模板使用',groupid:10004,imgList:[],default:"mbsy.png"},
          {groupname:"产前准备",name:'小工具',groupid:10005,imgList:[],default:"xgj.png"},
          {groupname:"产前准备",name:'风险评审会',groupid:10006,imgList:[],default:"fxpsh.png"},
          {groupname:"产前准备",name:'纽扣试打',groupid:10007,imgList:[],default:"nksd.png"},
          {groupname:"产前准备",name:'其它',groupid:10008,imgList:[],default:"qt.png"},
          {groupname:"产前样试穿",name:'单人正面',groupid:10011,imgList:[],default:"drzm.png"},
          {groupname:"产前样试穿",name:'齐码正面',groupid:10012,imgList:[],default:"qmzm.png"},
          {groupname:"产前样试穿",name:'单人背面',groupid:10013,imgList:[],default:"drbm.png"},
          {groupname:"产前样试穿",name:'齐码背面',groupid:10014,imgList:[],default:"qmbm.png"},
          {groupname:"产前样试穿",name:'试穿记录',groupid:10015,imgList:[],default:"scjl.png"},
          {groupname:"产前样试穿",name:'标签信息',groupid:10016,imgList:[],default:"bqxx.png"},
          {groupname:"产前样试穿",name:'封样单',groupid:10017,imgList:[],default:"fyd.png"},
          {groupname:"产前样试穿",name:'其它',groupid:10018,imgList:[],default:"qt.png"},
          {groupname:"转款上线",name:'成品正面',groupid:10021,imgList:[],default:"cpzm.png"},
          {groupname:"转款上线",name:'人台正面',groupid:10022,imgList:[],default:"rtzm.png"},
          {groupname:"转款上线",name:'成品背面',groupid:10023,imgList:[],default:"cpbm.png"},
          {groupname:"转款上线",name:'人台背面',groupid:10024,imgList:[],default:"rtbm.png"},
          {groupname:"转款上线",name:'检验记录/数量',groupid:10025,imgList:[],default:"jyjlsl.png"},
          {groupname:"转款上线",name:'不良部位',groupid:10026,imgList:[],default:"blbw.png"},
          {groupname:"转款上线",name:'整组生成',groupid:10027,imgList:[],default:"zzsc.png"},
          {groupname:"转款上线",name:'其它',groupid:10028,imgList:[],default:"qt.png"},        
          {groupname:"过程质量异常",name:'不良部位',groupid:10031,imgList:[],default:"blbw.png"},        
        ],

      },
      historyList: [
        // {tm:"test"}
      ],
      uploadVisible: false,
      uploadQx: true,
      UploadVantKeys: [],
     
      loading: false,
      activeName: ["1"],
      imgActiveName: ["1"],
      colVisible: true, //详情页是否隐藏
     
    };
  },
  methods: {
    ImageClick(item,index){
      let images=new Array();
      item.imgList.forEach(element => {
        images.push(element.URLAddress);
      }); 
      //console.log(images)
      ImagePreview({images:images,startPosition:index});
    },
    init() {
      //window.addEventListener("scroll", this.scroll, true);
      this.search();
    },
    getHeight() {
      this.mainHeight.height =
        window.innerHeight -
        Number(this.footHeight.height.replace("px", "")) -
        Number(this.footHeight.marginBottom.replace("px", "")) +
        "px";
      // this.tableHeight = Number(this.mainHeight.height.replace('px', '')) - 40
    },
    // scroll() {
    //   var scrollTop =
    //     document.documentElement.scrollTop || document.body.scrollTop;
    //   var oDiv = this.$refs["gobacFloatDiv"];
    //   //oDiv.offsetHeight 获取div的高度
    //   oDiv.style.top =
    //     document.documentElement.clientHeight -
    //     oDiv.offsetHeight +
    //     scrollTop +
    //     "px";
    // },
    //点击上传图片
    choiceImg(mydjid,groupid) {     
      this.mdata.currentGroupid=groupid;
      if(mydjid){
      this.mdata.currentMydjid = mydjid;
      this.UploadVantKeys.splice(0)
      //  console.log(this.mdata.lxDataList.detail)
      // console.log(mydjid)
      if(groupid==4320){
        for (var i = 0; i < this.mdata.lxDataList.detail.length; i++) {
          var sub = this.mdata.lxDataList.detail[i];
          if (sub.Id == mydjid) {
            var temp = this.mdata.lxDataList.detail[i].imgList;    
            for (let item of temp) {          
              this.UploadVantKeys.push(item.ID)
            }       
            break;
          }
        }      
      }else{       

      }
      this.uploadVisible = true;
      // console.log(this.UploadVantKeys)
      //f1记录是哪个单据点了上传图片      
      //this.$refs.filElem.dispatchEvent(new MouseEvent("click"));
      }else{
         this.$message("无法读取开发单信息");
      }
    },
    getImgList(imgList) {
      //只有一张
      let arr = [];
      for (var i = 0; i < imgList.length; i++) arr.push(imgList[i].URLAddress);
      return arr;
    },
    scanGoback(index) {
      if (index == "close") {
        // this.colVisible = false;
        // window.removeEventListener("scroll", this.scroll,true);      
        this.vanTabbarActive="";
        this.mdata.sphh = "";
        this.$emit("goback");
      }
    },
    searchImg(mydjid,groupid) {
      this.$axios
        .get(APIUTL, {
          params: {
            action: "getImgage",
            tableid: mydjid,
            groupid: groupid,
          },
        })
        .then((response) => {
          if (response.data.errcode == 0) {
            if(groupid==4320){
              for (var i = 0; i < this.mdata.lxDataList.detail.length; i++) {
                var sub = this.mdata.lxDataList.detail[i];
                if (sub.Id == mydjid) {
                  var temp = response.data.data;
                  for (let item of temp) {
                    item.URLAddress = item.URLAddress.replace(
                      "../",
                      "http://webt.lilang.com:9001/"
                    );
                  }
                  sub.imgList = temp;
                  this.$set(this.mdata.lxDataList.detail, i, sub); //有响应
                  // console.log(this.mdata.lxDataList.detail)
                  break;
                }
              }
              // console.log(this.mdata.lxDataList)
            }else{
              for(var i=0;i<this.mdata.groupids.length;i++){
                var sub=this.mdata.groupids[i]
                if(sub.groupid==groupid){
                  var temp = response.data.data;
                  for (let item of temp) {
                    item.URLAddress = item.URLAddress.replace(
                      "../",
                      "http://webt.lilang.com:9001/"
                    );
                  }
                  sub.imgList=temp;
                  this.$set(this.mdata.groupids, i, sub); //有响应
                  break;
                }
              }            
              
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    saveImg(mydjid) {
      let saveObj = {};
      for (let item of this.mdata.lxDataList.detail) {
        if (item.Id == mydjid) saveObj = item;
      }
      if (!saveObj.Cpbz || saveObj.Cpbz.length == 0) {
        this.$alert("请填写跟踪事项再新增", "提示信息", {
          confirmButtonText: "确定",
          customClass:"dev_MessageBoxCustom"
        });
      } else {
        saveObj.Sphh = this.mdata.sphh;
        saveObj.Zdr = this.userInfo.cname;
        this.$axiosPost
          .post(APIUTL + "?action=SaveSkSphh", saveObj)
          .then((response) => {
            if (response.data.errcode == 0) {
              saveObj.Id = response.data.data[0][0].id;
              // console.log(this.mdata.lxDataList.detail)
              this.$message("保存成功");
            } else {
              this.$message("保存失败");
            }
          });
      }
    },
    search() {
      this.goScan(this.mdata.sphh, (checkInfo) => {
        // console.log(checkInfo)
        if (checkInfo.result == "Successed") {
          this.mdata.sphh = checkInfo.jsonsObject[0]["货号"];
          this.mdata.zlmxid =Number(checkInfo.jsonsObject[0]["zlmxid"]);
          // this.addLog(this.mdata.sphh); //增加扫描记录
          this.getGYD(checkInfo.jsonsObject[0]["货号"], (scData) => {
            // console.log(scData);            
            this.mdata.title = [];
            this.mdata.title_cl = [];
            this.mdata.bq = [];
            this.mdata.gydSrc = "";
            this.mdata.plkSrc = "";
            this.mdata.mlbgList = [];
            this.mdata.rkbgList = [];
            this.mdata.thList = [];
            this.mdata.lxDataList.detail = [];
            this.mdata.currentMydjid = 0;
            this.activeName = ["1"];
            this.createChdmListHtml(checkInfo, scData); //构造材料列表
          });
        } else if (checkInfo.result == "Error") {
           VanToast('二维码信息查询错误');          
          // this.$alert("二维码信息查询错误", "提示信息", {
          //   confirmButtonText: "确定",
          //   callback: (action) => {
          //     this.scan();
          //   },
          // });
        } else if (checkInfo.result == "netErrorW1") {
           VanToast('网络错误'); 
          // this.$alert("网络错误", "提示信息", {
          //   confirmButtonText: "确定",
          //   callback: (action) => {
          //     this.scan();
          //   },
          // });
        } else if (checkInfo.result == "NoRows") {
          VanToast('查无数据,请检查当前用户是否有权限');                  
          // this.$alert("查无数据,请检查当前用户是否有权限", "提示信息", {
          //   confirmButtonText: "确定",
          //   callback: (action) => {
          //     this.scan();
          //   },
          // });
        }
      });
    },
    createChdmListHtml(obj, scData) {
      if (scData.CpzlgzList && scData.CpzlgzList.length > 0) {
        scData.CpzlgzList.sort(function (a, b) {
          return b.Id - a.Id;
        });
        scData.CpzlgzList.forEach((element) => {
          this.mdata.lxDataList.detail.push(element);
          this.searchImg(element.Id,this.mdata.lxDataList.groupid);
        });
      }
      //产中图片
      if(scData.ImgList && scData.ImgList.length>0){
        scData.ImgList.forEach(e=>{
          //e.GroupID
          this.mdata.groupids.forEach(img=>{
             if(img.groupid==e.GroupID){
               e.URLAddress = e.URLAddress.replace(
                      "../",
                      "http://webt.lilang.com:9001/"
                    );
               img.imgList.push(e)
             }
          })
        })
      }
      var addObj = {};
      addObj.Id = 0;
      addObj.imgList = [];
      var day2 = new Date();
      day2.setTime(day2.getTime());
      addObj.Zdrq =
        day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
      addObj.Zdr = this.userInfo.cname;
      this.mdata.lxDataList.detail.unshift(addObj);

      if (scData.WJpath && scData.WJpath.length > 0) {
        this.mdata.gydSrc =
          "http://webt.lilang.com:9001/photo/yfspkh" +
          scData.WJpath.replace("\\", "/") +
          "";
      }
      if (scData.Thsl && scData.Thsl > 0) {
        if (scData.ThList && scData.ThList.length > 0) {
          for (var i = 0; i < scData.ThList.length; i++) {
            this.mdata.thList.push(scData.ThList[i]);
          }
        }
      }
      // console.log(scData);
      if (scData.Rksl && scData.Rksl > 0) {
        if (scData.RkList && scData.RkList.length > 0) {
          for (var i = 0; i < scData.RkList.length; i++) {
            scData.RkList[i].show = false;
            scData.RkList[i].tzid = 1;
            scData.RkList[i].ppdm = "";
            scData.RkList[i].action = "getFlowLog";
            scData.RkList[i].vueExtJSKey = scData.RkList[i].Flowid;
            this.mdata.rkbgList.push(scData.RkList[i]);
          }
          // console.log(this.mdata.rkbgList);
        }
      }
      if (scData.JYBGList && scData.JYBGList.length > 0) {
        for (var i = 0; i < scData.JYBGList.length; i++) {
          scData.JYBGList[i].show = false;
          scData.JYBGList[i].tzid = 1;
          scData.JYBGList[i].ppdm = "";
          scData.JYBGList[i].action = "getFlowLog";
          scData.JYBGList[i].vueExtJSKey = scData.JYBGList[i].Flowid;
          // console.log(scData.JYBGList[i]);
          this.mdata.mlbgList.push(scData.JYBGList[i]);
        }
      }
      var checkInfos = obj.jsonsObject;
      var 材料与供货商信息 = checkInfos[0].材料与供货商信息; //
      this.mdata.plkSrc =
        "http://webt.lilang.com:9001/tl_yf/yf_plk_wordkh.aspx?yphh=" +
        checkInfos[0].样号 +
        "";
      for (var k = 0; k < checkInfos.length; k++) {
        var checkInfo = checkInfos[k];
        if (checkInfo == "") continue;
        var title = "";
        var 水洗名称,
          纤维含量,
          充绒量,
          号型,
          品名,
          版型,
          样号,
          洗涤方法,
          图标,
          简化图标,
          警告语,
          规格,
          执行标准,
          货号,
          khmc;
        水洗名称 = checkInfo.水洗名称;
        纤维含量 = checkInfo.纤维含量;
        充绒量 = checkInfo.充绒量;
        号型 = checkInfo.号型;
        品名 = checkInfo.品名;
        版型 = checkInfo.版型;
        样号 = checkInfo.样号;
        洗涤方法 = checkInfo.洗涤方法1;
        图标 = checkInfo.洗涤方法;
        简化图标 = checkInfo.洗涤方法;
        警告语 = checkInfo.警告语;
        规格 = checkInfo.规格;
        执行标准 = checkInfo.执行标准;
        khmc = checkInfo.khmc;
        货号 = checkInfo.货号;
        this.mdata.title.push({ mc: "品名", value: 品名 });
        if (
          水洗名称 == "水洗牛仔裤" ||
          水洗名称 == "休闲裤" ||
          水洗名称 == "男西裤" ||
          水洗名称 == "休闲衬衫" ||
          水洗名称 == "休闲服时尚羽绒服" ||
          水洗名称 == "茄克衫" ||
          水洗名称 == "西服套装" ||
          水洗名称 == "内衣内裤热转移印标" ||
          水洗名称 == "羽绒单衣"
        ) {
          this.mdata.title.push({ mc: "样号", value: 样号 });
        } else if (水洗名称 == "短裤内裤") {
          this.mdata.title.push({ mc: "货号", value: 货号 });
          this.mdata.title.push({ mc: "执行标准", value: 执行标准 });
        } else {
          if (样号 == 货号) {
            this.mdata.title.push({ mc: "样号", value: 样号 });
          } else {
            this.mdata.title.push({
              mc: "货号 - 样号",
              value: 货号 + " - " + 样号,
            });
          }
        }
        this.mdata.title.push({ mc: "加工厂", value: khmc });

        if (水洗名称 == "水洗牛仔裤" || 水洗名称 == "水洗牛仔裤v2") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "版型", value: 版型 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
          this.mdata.bq.push({
            mc: "警告语",
            value: 警告语.replace("警告语", ""),
          });
        } else if (水洗名称 == "休闲裤" || 水洗名称 == "休闲裤v2") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "版型", value: 版型 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "男西裤" || 水洗名称 == "男西裤v2") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (
          水洗名称 == "休闲衬衫" ||
          水洗名称 == "休闲衬衫v2" ||
          水洗名称 == "正衬V2" ||
          水洗名称 == "休闲衬衫v3"
        ) {
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "短裤内裤" || 水洗名称 == "短裤内裤v2") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "规格", value: 规格 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
          this.mdata.bq.push({ mc: "批号", value: "" });
        } else if (
          水洗名称 == "休闲服时尚羽绒服" ||
          水洗名称 == "休闲服时尚羽绒服v2"
        ) {
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "充绒量", value: "" });

          var 充绒量_规格 = 充绒量.规格;
          var 充绒量_重量 = 充绒量.重量;
          for (var i = 0; i < 充绒量_规格.length; i++) {
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value1,
              value: 充绒量_重量[i].value1,
            });
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value2,
              value: 充绒量_重量[i].value2,
            });
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value3,
              value: 充绒量_重量[i].value3,
            });
          }
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "羽绒单衣") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "充绒量", value: "" });
          var 充绒量_规格 = 充绒量.规格;
          var 充绒量_重量 = 充绒量.重量;
          for (var i = 0; i < 充绒量_规格.length; i++) {
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value1,
              value: 充绒量_重量[i].value1,
            });
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value2,
              value: 充绒量_重量[i].value2,
            });
            this.mdata.bq.push({
              mc: 充绒量_规格[i].value3,
              value: 充绒量_重量[i].value3,
            });
          }
          rows += row.replace("@mc", "洗涤方法").replace("@value", 洗涤方法);
          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "茄克衫" || 水洗名称 == "茄克衫v2") {
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });

          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "西服套装" || 水洗名称 == "西服套装v2") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });

          if (图标 != "") {
            var xdtb = 图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        } else if (水洗名称 == "内衣内裤热转移印标") {
          this.mdata.bq.push({ mc: "号型", value: 号型 });
          this.mdata.bq.push({ mc: "规格", value: 规格 });
          this.mdata.bq.push({ mc: "纤维含量", value: "" });
          this.getCFHtml(纤维含量, this.mdata.bq);
          this.mdata.bq.push({ mc: "洗涤方法", value: 洗涤方法 });
          if (简化图标 != "") {
            var xdtb = 简化图标.split("|");
            for (var i = 0; i < xdtb.length; i++) {
              if (xdtb[i] != "") {
                var str = xdtb[i].split("&");
                this.mdata.bq.push({
                  lx: "img",
                  mc: str[0].replace("../tl_yf", "../../res/img/ErpScan"),
                  value: str[1],
                });
              }
            }
          }
        }
      }
      var khtitl = "";      
      if (材料与供货商信息 && 材料与供货商信息 != "") {
        for (var i = 0; i < 材料与供货商信息.length; i++) {
          this.mdata.title_cl.push({
            ghs: 材料与供货商信息[i].khmc,
            mc: 材料与供货商信息[i].chdm,
            value: 材料与供货商信息[i].chmc,
          });
        }
      }
    },
    //处理成份
    getCFHtml(纤维含量, list) {
      for (var i = 0; i < 纤维含量.split("|").length; i++) {
        var tmpIgn = 纤维含量.split("|")[i];
        if (tmpIgn != "") {
          if (tmpIgn.split(":").length == 1) {
            //成份前面没有帽号和说明
            var str = tmpIgn.split(":")[0].split(" ");
          } else {
            var str = tmpIgn.split(":")[1].split(" ");
            list.push({ mc: tmpIgn.split(":")[0], value: "" });
          }
          if (str.length >= 0) {
            for (var j = 0; j < str.length; j++) {
              if (str[j] != "") {
                list.push({ mc: "", value: str[j] });
              }
            }
          }
        }
      }
    },
    goScan(result, func) {
      this.loading = true;
      this.$axios
        .get(APIUTL, {
          params: {
            serviceGotoUrl:
              NetUrl +
              (NetUrl.indexOf("192.168.35.231") >= 0 ? "qywx" : "oa") +
              "/project/erpscan/yf_cl_sphh_xsb.aspx",
            serviceGoto: ".net",
             //encoding: "gb2312",
            sphh: result,
            from: "hgz",
          },
        })
        .then((response) => {
          // console.log(response.data);
          this.loading = false;
          var obj = {};
          if (response.data == "") {
            obj.result = "NoRows";
            obj.state = "have no rows";
          } else {
            obj.result = "Successed";
            obj.jsonsObject = {};
            var jsons = response.data.split("&&&&");
            for (var i = 0; i < jsons.length; i++) {
              if (jsons[i] != "") jsons[i] = eval("(" + jsons[i] + ")");
            }
            obj.jsonsObject = jsons;
          }
          func(obj);
        })
        .catch((error) => {
          // console.log(error);
          this.loading = false;
          var obj = {};
          obj.result = "netErrorW2";
          func(obj);
        });
    },
    //工艺单
    getGYD(result, func) {
      this.loading = true;
      let param = new URLSearchParams();
      param.append("sphh", result);
      param.append("from", "gyd");
      this.$axios
        .post(
          APIUTL +
            "?serviceGotoUrl=" +
            NetUrl +
            (NetUrl.indexOf("192.168.35.231") >= 0 ? "qywx" : "oa") +
            "/project/erpscan/sphhinfo.ashx" +
            "&serviceGoto=.net&encoding=utf-8",
          param
        )
        .then((response) => {
          // console.log(response);
          this.loading = false;
          func(response.data);
        })
        .catch((error) => {
          this.loading = false;
          var obj = {};
          console.log(this, error);
          obj.result = "netErrorW3";
          func(obj);
        });
    },

    uploadImg(e) {
      // if (e.target.files.length > 0) {
      //   // this.$vux.loading.show("Loading...");
      //   let files = e.target.files || e.dataTransfer.files;
      //   if (!files.length) return;
      //   this.picValue = files[0];
      //   this.uploadName = files[0].name;

      //   // 上传图片
      //   var u = navigator.userAgent,
      //     app = navigator.appVersion;
      //   var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
      //   var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      //   if (isAndroid) {
      //     this.axiosFun(this.picValue);
      //   }
      //   if (isIOS) {
      //     this.imgPreview(this.picValue);
      //   }

      //   // 上传视频
      //   // this.axiosFun(this.picValue);
      // }
    },
    imgPreview(file) {
      // let self = this;
      // let Orientation;
      // //去获取拍照时的信息，解决拍出来的照片旋转问题
      // EXIF.getData(file, function () {
      //   Orientation = EXIF.getTag(this, "Orientation");
      // });
      // // 看支持不支持FileReader
      // if (!file || !window.FileReader) return;

      // if (/^image/.test(file.type)) {
      //   // 创建一个reader
      //   let reader = new FileReader();

      //   // 将图片2将转成 base64 格式
      //   reader.readAsDataURL(file);

      //   // 读取成功后的回调
      //   reader.onloadend = function () {
      //     let result = this.result;
      //     let img = new Image();
      //     img.src = result;
      //     //判断图片是否大于100K,是就直接上传，反之压缩图片
      //     if (this.result.length <= 100 * 1024) {
      //       self.headerImage = this.result;
      //       self.postImg();
      //     } else {
      //       img.onload = () => {
      //         let data = self.compress(img, Orientation);
      //         self.headerImage = data;
      //         self.postImg();
      //       };
      //     }
      //   };
      // }
    },
    compress(img, Orientation) {
      let _this = this;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      console.log(Orientation);
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            //不需要处理，处理了反尔有问题
            //_this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            _this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            _this.rotateImg(img, "right2", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else if (direction == "right2") {
        step = 2;
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    postImg() {
      // //这里写接口
      // // console.log(this.headerImage)
      // const block = this.headerImage.split(";");

      // const contentType = block[0].split(":")[1]; // In this case "image/jpeg"

      // const realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

      // var blob = this.b64toBlob(realData, contentType);
      // this.axiosFun(blob);
    },
    uploadDefined(file, callback) {
      let _this = this;
      // let gObjectName = data.dir + this.randomString() + this.getSuffix(this.uploadName);
      let request = new FormData();
      // request.append("OSSAccessKeyId", data.accessid); // Bucket 拥有者的Access Key Id。
      // request.append("policy", data.policy); // policy规定了请求的表单域的合法性
      // request.append("Signature", data.signature); // 根据Access Key Secret和policy计算的签名信息，OSS验证该签名信息从而验证该Post请求的合法性
      // request.append("key", "afasdf"); // 文件名字，可设置路径
      request.append("success_action_status", "200"); // 让服务端返回200,不然，默认会返回204
      request.append("x-oss-object-acl", "public-read");
      request.append("file", file, this.uploadName);
      let xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        APIUTLFile +
          "?serviceGotoUrl=" +
          encodeURIComponent(
            NetUrlUpload +
              "service/HttpRequestSkill.ashx?groupid=" +
              this.mdata.lxDataList.groupid +
              "&tableid=" +
              this.mdata.currentMydjid
          )
      );
      xhr.send(request);
      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // console.log("fileKey => " + data.host + "/" + gObjectName);
          // console.log(_this.imgPaths);
          // _this.$vux.loading.hide();
          // console.log(e)
          callback(JSON.parse(xhr.responseText));
        } else if (xhr.status === 400) {
          callback(JSON.parse(xhr.responseText));
          // _this.$vux.loading.hide();
          // _this.$vux.toast.text('图片太大,请换取小的图片')
        }
      };
    },
    async axiosFun(blob) {
      // let that = this;
      // that.uploadDefined(blob, function (d) {
      //   if (d.errcode == 0) {
      //     that.$message(that.uploadName + "上传成功"); // 上传成功逻辑
      //     that.searchImg(that.mdata.currentMydjid);
      //   } else {
      //     that.$message(that.uploadName + "上传失败"); // 上传成功逻辑
      //     console.log(d);
      //   }
      // });
    },
    randomString(len) {
      len = len || 32;
      var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    getSuffix(filename) {
      var pos = filename.lastIndexOf(".");
      var suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    mlbgGoback(item) {
      //由流程切换回详情页
      item.show = false;
      this.colVisible = true;
    },
    //分组
    groupImg(){//{groupname:"产前准备",name:'面料缩率报告',groupid:10001,imgList:[],default:"mlslbg.png"},

      this.mdata.groupids.forEach((e) => {
        let isexists=false;
        for(let i=0;i<this.mdata.groupname.length;i++){
          if(e.groupname==this.mdata.groupname[i].groupname){
            isexists=true;
          }
        }
        if(!isexists){
          this.mdata.groupname.push({groupname:e.groupname,name:e.name,key:this.mdata.groupname.length+1})
        }        
      });
      // console.log(this.mdata.groupname)
    },
    filterImg(groupname){
      let list = [];
      this.mdata.groupids.forEach((e) => {        
        if(e.groupname==groupname){
          list.push(e)
        }
      });
      return list;
    },
  },
  filters:{

  },
  mounted() {},
  watch: {
    UploadVantKeys(newValue, oldvalue) {      
      // console.log(newValue,oldvalue)
      //上传图片有更改,刷新,  
      if(newValue.length!=oldvalue.length){    
      this.searchImg(this.mdata.currentMydjid,this.mdata.currentGroupid);
      }else{
        for(var i=0;i<newValue.length;i++){        
          if(newValue[i]!=oldvalue[i]){
            this.searchImg(this.mdata.currentMydjid,this.mdata.currentGroupid);
            break;
          }
        }
      }      
      // console.warn("UploadVantKeys", newValue, oldvalue);    
    },
  },
  computed: {
    Rksl: function () {
      var temp = 0;
      this.mdata.rkbgList.forEach((element) => {
        temp += Number(element.Sl);
      });
      return temp;
    },
    Tksl: function () {
      var temp = 0;
      this.mdata.thList.forEach((element) => {
        temp += Number(element.Sl);
      });
      return temp;
    },
  },
  created() {
    this.groupImg();
    this.init();
    // 页面创建时执行一次getHeight进行赋值，顺道绑定resize事件
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
};
</script>

<style scoped>
 

.block {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.gobacFloatDiv {
  width: 80px;
  height: 60px;

  position: absolute;
  right: 0;
  bottom: 0;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
@media screen and (max-width: 500px) {
  .el-message-box {
    width: 300px !important;
  }
  .box-card {
    width: 100% !important;
  }
}

.title-context {
  -webkit-column-count: 2;
  -moz-column-count: 2;
  column-count: 2;
  -webkit-column-gap: 10px;
  -moz-column-gap: 10px;
  column-gap: 10px;
}
 .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .wrapDetail {
  padding-bottom:50px;
}
.thListColr{
  background-color: #ecf8ff;
}
</style>
<style>
.dev_MessageBoxCustom {
  width: 300px;
}
</style>

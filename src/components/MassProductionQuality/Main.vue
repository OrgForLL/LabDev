<template>
  <div id="MassProductionQuality">
    <!-- CollecBtn -->
    <CollecBtn
      ref="CollecBtn"
      @collecBtnMySave="CollecBtnMySave"
      @collecBtnMyDel="CollecBtnMyDel"
      @collecBtnClose="CollecBtnClose"
    ></CollecBtn>
    <!-- CollecBtn -->
    <el-form :model="mdata" label-width="70px" style="margin-top:20px" label-position="right">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <el-form-item label="开发编号">
                <DevNumPicker :devNum.sync="mdata.devNum" :devDisabled="false"></DevNumPicker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <el-form-item label="材料编号">
                <MassProductionQualityChdmSelect
                  :devNum="mdata.devNum"
                  :chdm.sync="mdata.chdm"
                  :chmc.sync="mdata.chmc"
                  :djid.sync="mdata.djid"
                  :desc.sync="mdata.desc"
                  :disabled="mdata.devNum.length>0?false:true"
                ></MassProductionQualityChdmSelect>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <el-form-item label="材料名称">
                {{mdata.chmc}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>      
      <div v-for="item  in lxDataList" v-bind:key="item.lx" class="text item">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
            <el-button
              style="float: right; padding: 3px 0"
              @click="openUpload(item.lx,true,item.groupid)"
              type="text"
            >上传附件</el-button>
            <el-button
              style="float: right; padding: 3px 0"
              @click="openUpload(item.lx,false,item.groupid)"
              type="text"
            >查看附件</el-button>
          </div>
          <div class="text item">
            <el-input type="textarea" v-model="mdata.desc[item.lx]"></el-input>
          </div>
        </el-card>
      </div>
    </el-form>
   
      <Upload
        :visible.sync="uploadVisible"
        :groupid="groupid"
        :tableid="mdata.djid"
        :qx="uploadQx"
      ></Upload>
    
  </div>
</template>

<script>
import CollecBtn from "@/components/Utils/CollecBtn.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";
import MassProductionQualityChdmSelect from "@/components/MassProductionQuality/ChdmSelect.vue";
import Upload from "@/components/Utils/Upload.vue";
export default {
  name: "MassProductionQuality",
  components: {
    CollecBtn,
    DevNumPicker,
    MassProductionQualityChdmSelect,
    Upload
  },
  data: function() {
    return {
      mdata: {
        chdm: "",
        chmc:"",
        devNum: "",
        djid: 0,
        desc: {}
      },
      lxDataList: [
        { lx: "bsbz", title: "备纱", groupid: 2801 },
        { lx: "rsbz", title: "染纱", groupid: 2802 },
        { lx: "zzbz", title: "织造", groupid: 2803 },
        { lx: "rsgybz", title: "染色工艺", groupid: 2804 },
        { lx: "hzbz", title: "后整工序", groupid: 2805 },
        { lx: "cpbz", title: "成品品质 ", groupid: 2806 }
      ],
      uploadVisible: false,
      groupid: -1,
      uploadQx: false
    };
  },
  methods: {
    init() {},
    CollecBtnMySave() {      
      return new Promise((resolve, reject)=> {
        let param = new Object(); //   e.bsbz,e.rsbz,e.zzbz,e.rsgybz,e.hzbz,e.cpbz
        param.kfbh = this.mdata.devNum;
        param.djid = this.mdata.djid;
        if (param.djid == null) param.djid = 0;
        param.chdm = this.mdata.chdm;
        param.bsbz = this.mdata.desc.bsbz;
        if (param.bsbz == null) param.bsbz = "";
        param.rsbz = this.mdata.desc.rsbz;
        if (param.rsbz == null) param.rsbz = "";
        param.zzbz = this.mdata.desc.zzbz;
        if (param.zzbz == null) param.zzbz = "";
        param.rsgybz = this.mdata.desc.rsgybz;
        if (param.rsgybz == null) param.rsgybz = "";
        param.hzbz = this.mdata.desc.hzbz;
        if (param.hzbz == null) param.hzbz = "";
        param.cpbz = this.mdata.desc.cpbz;
        if (param.cpbz == null) param.cpbz = "";
        this.$axiosPost          
          .post(APIUTL + "?action=SaveSGChdm", param)
          .then(response=> {
            if (response.data.errcode == 0) {
              console.log(response.data.data[0][0].id);
              this.mdata.djid = response.data.data[0][0].id;
              this.$message("保存成功");
              resolve("ok");
            } else {
              reject(response);
            }
          });
      });
    },
    CollecBtnMyDel() {
      console.log("del");
    },
    CollecBtnClose() {
      console.log("CCC");
    },
    openUpload(lx, qx, groupid) {
      this.uploadQx = qx;
      this.groupid = groupid;
      if (this.mdata.djid <= 0) {
        //先保存数据
        if (this.mdata.devNum.length == 0 || this.mdata.chdm.length == 0) {
          this.$message("请选择材料和开发编码");
        } else {
          //发送请求
          return this.CollecBtnMySave().then(res => {
            
            if (res == "ok") {

              this.uploadVisible = true;
            }
            // 上传成功逻辑
          });
        }
      } else this.uploadVisible = true;
    }
  },
  mounted() {},
   watch: {
    'mdata.devNum'(newValue, oldvalue) {
      //  console.log(newValue,oldvalue)
       if(newValue !=oldvalue){
         this.mdata.chdm="";
         this.mdata.chmc="";   
         this.mdata.djid=0;       
         this.mdata.desc={};
       }
    },
  }
};
</script>

 

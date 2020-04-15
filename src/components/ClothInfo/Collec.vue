<template>
  <div id="Collec">
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
                <DevNumPicker :devNumTemp.sync="mdata.devNum" :disabled="false"></DevNumPicker>
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
                <ChdmSelect
                  :devNum="mdata.devNum"
                  :chdm.sync="mdata.chdm"
                  :djid.sync="mdata.djid"
                  :desc.sync="mdata.desc"
                  :disabled="false"
                ></ChdmSelect>
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
        :groupidIn="groupid"
        :tableidIn="mdata.djid"
        :qx="uploadQx"
      ></Upload>
    
  </div>
</template>

<script>
import CollecBtn from "@/components/ButtonGroup/CollecBtn.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";
import ChdmSelect from "@/components/Utils/ChdmSelect.vue";
import Upload from "@/components/Utils/Upload.vue";
export default {
  name: "Collec",
  components: {
    CollecBtn,
    DevNumPicker,
    ChdmSelect,
    Upload
  },
  data: function() {
    return {
      mdata: {
        chdm: "",
        devNum: "",
        djid: 0,
        desc: {}
      },
      lxDataList: [
        { lx: "bsbz", title: "备纱", groupid: 2801 },
        { lx: "lsbz", title: "染纱", groupid: 2802 },
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
      let that = this;
      return new Promise(function(resolve, reject) {
        let param = new Object(); //   e.bsbz,e.rsbz,e.zzbz,e.rsgybz,e.hzbz,e.cpbz

        param.kfbh = that.mdata.devNum;
        param.djid = that.mdata.djid;
        if (param.djid == null) param.djid = 0;
        param.chdm = that.mdata.chdm;
        param.bsbz = that.mdata.desc.bsbz;
        if (param.bsbz == null) param.bsbz = "";
        param.rsbz = that.mdata.desc.rsbz;
        if (param.rsbz == null) param.rsbz = "";
        param.zzbz = that.mdata.desc.zzbz;
        if (param.zzbz == null) param.zzbz = "";
        param.rsgybz = that.mdata.desc.rsgybz;
        if (param.rsgybz == null) param.rsgybz = "";
        param.hzbz = that.mdata.desc.hzbz;
        if (param.hzbz == null) param.hzbz = "";
        param.cpbz = that.mdata.desc.cpbz;
        if (param.cpbz == null) param.cpbz = "";

        that.$axiosPost
          // .post(APIUTL + "/upload", param)
          .post(APIUTL + "?action=SaveSGChdm", param)
          .then(function(response) {
            if (response.data.errcode == 0) {
              console.log(response.data.data[0][0].id);
              that.mdata.djid = response.data.data[0][0].id;
              that.$message("保存成功");
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
  mounted() {}
};
</script>

<style>

</style>

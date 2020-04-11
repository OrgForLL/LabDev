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
 
    <div>
    <el-form :model="mdata" label-width="70px" label-position="right">
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-row type="flex" justify="center">
            <el-col :span="24">
              <el-form-item label="开发编号">
                <DevNumPicker  :devNumTemp.sync="mdata.devNum" :disabled="false"></DevNumPicker>
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
                <ChdmSelect :devNum="mdata.devNum" :chdm.sync="mdata.chdm" :djid.sync="mdata.djid" :disabled="false"></ChdmSelect>
              </el-form-item>             
          
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div v-for="item  in dataList" v-bind:key="item.lx" class="text item">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{item.title}}</span>
            <el-button style="float: right; padding: 3px 0" type="text">上传附件</el-button>
            <el-button style="float: right; padding: 3px 0" type="text">查看附件</el-button>
          </div>
          <div class="text item">
            <el-input type="textarea" v-model="mdata.desc"></el-input>
          </div>
        </el-card>
      </div>
    </el-form>
    </div>
  </div>
</template>

<script>
import CollecBtn from "@/components/ButtonGroup/CollecBtn.vue";
import DevNumPicker from "@/components/Utils/DevNumPicker.vue";
import ChdmSelect from "@/components/Utils/ChdmSelect.vue";
export default {
  name: "Collec",
  components: {
    CollecBtn,
    DevNumPicker,
    ChdmSelect,
    
  },
  data: function() {
    return {
      mdata: {
        chdm: "",
        devNum:"",
        chdmList:[],
        djid:0,
      },
      dataList: [
        { lx: "bs", title: "备纱" },
        { lx: "ls", title: "染纱" },
        { lx: "zc", title: "织造" },
        { lx: "lsgy", title: "染色工艺" },
        { lx: "hz", title: "后整工序" },
        { lx: "cp", title: "成品品质 " }
      ]
    };
  },
  created() {
    //this.layrun = this.debounce(this.searchCHDM, 200, false);
  },
  methods: {
    // 参数初始化及简单验证
    init: function() {
      console.log(this.$route);
      let _this = this;
    },
    CollecBtnMySave: function() {
      //this.mdata.chdm="AT2027361";
      console.log(this.mdata.djid);
      // console.log(this.mdata.chdmList);
      // this.checkList();
    },
    CollecBtnMyDel: function() {
      console.log("del");
    },
    CollecBtnClose: function() {
      console.log("CCC");
    },  
    
  },
  mounted() {}
};
</script>

<style>
</style>

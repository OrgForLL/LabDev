<template>
  <div id="SourceVersionNumPicker">
    <el-dialog
      title="源版单号选择"
      :visible.sync="isShowSourceVersionNumDialog"
      :before-close="handleClose"
      top="20px"
      center
    >
      <el-form :inline="true">
        <el-form-item label="季度">
          <el-select v-model="devNum" size="mini" clearable placeholder="请选择">
            <el-option v-for="item in devNumList" :key="item.dm" :label="item.mc" :value="item.dm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input
            v-model="query"
            size="mini"
            placeholder="请输入关键字"
            @keydown.enter.native="getData"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="sourceVerNumList.slice((currentPage-1) * pagesize, currentPage * pagesize)"
        @row-click="checkSourceVerNum"
        max-height="538px"
      >
        <el-table-column property="khmc" label="客户"></el-table-column>
        <el-table-column property="bdh" label="版单号"></el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        :total="sourceVerNumList.length"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SourceVersionNumPicker",
  data: function() {
    return {
      isShowSourceVersionNumDialog: false,
      query: "",
      devNum: "",
      isSelected: false,
      devNumList: [],
      sourceVerNumList: [],
      total: 0,
      pagesize: 15,
      currentPage: 1
    };
  },
  methods: {
    init: function(query, devNum) {
      if (!query) {
        this.$message({
          message: "请先输入模糊筛选条件",
          type: "warning"
        });
        return;
      }
      if(devNum){
        this.devNum = devNum;
      }
      this.query = query;
      this.getData();
      this.isShowSourceVersionNumDialog = true;
      this.isSelected = false;
    },
    getData: function() {
      let _this = this;
      _this.$axios
        // .get(APIUTL + "/getSourceDevNumInitInfo", {
        .get(APIUTL, {
          params: {
            action: "getSourceDevNumInitInfo",
            kfbh: _this.devNum,
            query: _this.query
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
          _this.sourceVerNumList = response.data.data[0];
          _this.devNumList = response.data.data[1];
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkSourceVerNum: function(row) {
      this.isSelected = true;
      this.$emit("selectedSourceVerNum", row.bdh);
      this.isShowSourceVersionNumDialog = false;
    },
    handleClose(done) {
      if (!this.isSelected) {
        this.$message({
          message: "您没有选择一个源版单号？？？",
          type: "warning"
        });
        this.$emit("selectedSourceVerNum", "");
      }
      done();
    }
  }
};
</script>

<style>
#SourceVersionNumPicker .el-dialog__title {
  font-size: 14px;
}
#SourceVersionNumPicker .cell {
  font-size: 12px;
}
#SourceVersionNumPicker .el-table th {
  padding: 2px 0;
}
#SourceVersionNumPicker .el-table tr td {
  padding: 5px 0;
}
#SourceVersionNumPicker .el-table {
  margin-top: 15px;
}
#SourceVersionNumPicker .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 20px;
}
#SourceVersionNumPicker table tbody tr {
  cursor: pointer;
}
#SourceVersionNumPicker .el-form-item {
  margin-bottom: 0;
}
</style>
<template>
  <div id="SourceColorPicker">
    <el-dialog
      title="源色号选择"
      :visible.sync="isShowSourceColorDialog"
      :before-close="handleClose"
      top="20px"
      center
    >
      <el-form :inline="true">
        <el-form-item label="版单号">
          <el-input v-model="verNum" size="mini" readonly></el-input>
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
        :data="sourceColorList.slice((currentPage-1) * pagesize, currentPage * pagesize)"
        @row-click="checkSourceColor"
        max-height="538px"
      >
        <el-table-column property="khmc" label="客户"></el-table-column>
        <el-table-column property="bdh" label="版单号"></el-table-column>
        <el-table-column property="yyt" label="色号"></el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        :total="sourceColorList.length"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SourceColorPicker",
  data: function() {
    return {
      index: "",
      isShowSourceColorDialog: false,
      verNum: "",
      isSelected: false,
      query: "",
      sourceColorList: [],
      total: 0,
      pagesize: 15,
      currentPage: 1
    };
  },
  methods: {
    init: function(index, sourceVerNum, query) {
      if (!query) {
        this.$message({
          message: "请先输入模糊筛选条件",
          type: "warning"
        });
        return;
      }
      this.verNum = sourceVerNum;
      this.query = query;
      this.getData();
      this.isShowSourceColorDialog = true;
      this.isSelected = false;
      this.index = index;
    },
    getData: function() {
      let _this = this;
      _this.$axios
        // .get(APIUTL + "/getSourceColorInitInfo", {
        .get(APIUTL, {
          params: {
            action: "getSourceColorInitInfo",
            bdh: this.verNum,
            query: this.query
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
          _this.sourceColorList = response.data.data[0];
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkSourceColor: function(row) {
      this.isSelected = true;
      this.$emit("selectedSourceColor", row.yyt, row.mxid, this.index);
      this.isShowSourceColorDialog = false;
    },
    handleClose(done) {
      if (!this.isSelected) {
        this.$message({
          message: "您没有选择一个源色号？？？",
          type: "warning"
        });
        this.$emit("selectedSourceColor", "", 0, this.index);
      }
      done();
    }
  }
};
</script>

<style>
#SourceColorPicker .el-dialog__title {
  font-size: 14px;
}
#SourceColorPicker .cell {
  font-size: 12px;
}
#SourceColorPicker .el-table th {
  padding: 2px 0;
}
#SourceColorPicker .el-table tr td {
  padding: 5px 0;
}
#SourceColorPicker .el-table {
  margin-top: 15px;
}
#SourceColorPicker .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 20px;
}
#SourceColorPicker table tbody tr {
  cursor: pointer;
}
#SourceColorPicker .el-form-item {
  margin-bottom: 0;
}
</style>
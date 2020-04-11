<template>
  <div id="ProcessPartPicker">
    <el-dialog
      title="面料编号列表"
      :visible.sync="isShowProcessPartDialog"
      :before-close="handleClose"
      top="20px"
      width="60%"
      center
    >
      <el-form :inline="true">
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
        :data="ProcessParts.slice((currentPage-1) * pagesize, currentPage * pagesize)"
        @row-click="checkProcessPart"
        v-loading="loading"
        max-height="530px"
      >
        <el-table-column property="chdm" label="材料编码"></el-table-column>
        <el-table-column property="chmc" label="厂家编号"></el-table-column>
        <el-table-column property="khmc" label="供应商"></el-table-column>
        <el-table-column property="cbdj" label="单价"></el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        :total="ProcessParts.length"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ProcessPartPicker",
  data: function() {
    return {
      loading: true,
      type: "",
      isShowProcessPartDialog: false,
      query: "",
      userssid: "",
      isSelected: false,
      ProcessParts: [],
      total: 0,
      pagesize: 15,
      currentPage: 1
    };
  },
  methods: {
    init: function(query, type, userssid) {
      if (!query) {
        this.$message({
          message: "请先输入模糊筛选条件",
          type: "warning"
        });
        return;
      }
      this.query = query;
      this.userssid = userssid;
      this.getData();
      this.type = type;
      this.isShowProcessPartDialog = true;
      this.isSelected = false;
    },
    getData: function() {
      let _this = this;
      _this.loading = true;
      _this.$axios
        .get(APIUTL, {
          params: {
            action: "getProcessPartList",
            query: _this.query,
            userssid: _this.userssid //18069
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
          _this.ProcessParts = response.data.data;
          _this.loading = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkProcessPart: function(row) {
      this.isSelected = true;
      if (this.type) {
        this.$emit("selected", row.chmc, row.chdm, row.khmc, this.type);
      } else {
        this.$emit("selected", row.chmc, row.chdm, row.khmc);
      }
      this.isShowProcessPartDialog = false;
    },
    handleClose(done) {
      if (!this.isSelected) {
        this.$emit("clean", this.type);
        this.$message({
          message: "您没有选择一个面料编号？？？",
          type: "warning"
        });
      }
      this.loading = true;
      done();
    }
  }
};
</script>

<style>
#ProcessPartPicker .el-dialog__title {
  font-size: 14px;
}
#ProcessPartPicker .cell {
  font-size: 12px;
}
#ProcessPartPicker .el-table th {
  padding: 2px 0;
}
#ProcessPartPicker .el-table tr td {
  padding: 5px 0;
}
#ProcessPartPicker .el-table {
  margin-top: 15px;
}
#ProcessPartPicker .el-dialog__body {
  padding-top: 0;
  padding-bottom: 20px;
}
#ProcessPartPicker .el-form-item {
  margin-bottom: 0;
}
#ProcessPartPicker table tbody tr {
  cursor: pointer;
}
</style>
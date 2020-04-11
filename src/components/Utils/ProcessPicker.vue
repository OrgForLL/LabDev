<template>
  <div id="ProcessPicker">
    <el-form :inline="true">
      <el-form-item label="子版单号关键字">
        <el-input v-model="query" size="mini" placeholder="请输入子版单号关键字" @keydown.enter.native="getData"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="Processs.slice((currentPage-1) * pagesize, currentPage * pagesize)"
      @row-click="checkProcess"
      max-height="310px"
      v-loading="loading"
    >
      <el-table-column property="versionNum" label="子版单号"></el-table-column>
      <el-table-column property="name" label="类型"></el-table-column>
      <el-table-column property="supplier" label="供应商"></el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :current-page.sync="currentPage"
      :page-size="pagesize"
      :total="Processs.length"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "ProcessPicker",
  data: function() {
    return {
      // index: "",
      loading: false,
      query: "",
      Processs: [],
      total: 0,
      pagesize: 15,
      currentPage: 1
    };
  },
  methods: {
    // init: function(index) {
    //   // 
    //   this.index = index;
    //   // this.getData();
    // },
    clearProcesss: function(){
      this.Processs = [];
    },
    getData: function() {
      let _this = this;
      // if (!_this.query) {
      //   _this.$message({
      //     message: "请先输入模糊筛选条件",
      //     type: "warning"
      //   });
      //   return;
      // }
      this.loading = true;
      _this.$axios
        .get(APIUTL, {
          params: {
            action: "getProcessList",
            query: _this.query
          }
        })
        .then(function(response) {
          _this.loading = false;
          if (response.data.errcode == 5010) {
            _this.$message({
              showClose: true,
              message: response.data.errmsg,
              type: "error"
            });
            return;
          }
          _this.Processs = response.data.data[0];
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkProcess: function(row) {
      this.$emit("selectedProcess", row);
    }
  }
};
</script>

<style>
#ProcessPicker .el-dialog__title {
  font-size: 14px;
}
#ProcessPicker .cell {
  font-size: 12px;
}
#ProcessPicker .el-table th {
  padding: 2px 0;
}
#ProcessPicker .el-table tr td {
  padding: 5px 0;
}
#ProcessPicker .el-table {
  margin-top: 15px;
}
#ProcessPicker .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 20px;
}
#ProcessPicker table tbody tr {
  cursor: pointer;
}
</style>
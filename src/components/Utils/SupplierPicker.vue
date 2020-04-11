<template>
  <div id="SupplierPicker">
    <el-dialog
      title="供应商列表"
      :visible.sync="isShowSupplierDialog"
      :before-close="handleClose"
      top="20px"
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
        :data="suppliers.slice((currentPage-1) * pagesize, currentPage * pagesize)"
        @row-click="checkSupplier"
        max-height="538px"
      >
        <el-table-column property="khdm" label="供应商代码" width="90px"></el-table-column>
        <el-table-column property="khmc" label="供应商名称" width="270px"></el-table-column>
        <el-table-column property="lxr" label="联系人" width="90px"></el-table-column>
        <el-table-column property="lxdh" label="联系电话" width="150px"></el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pagesize"
        :total="suppliers.length"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SupplierPicker",
  data: function() {
    return {
      type: "",
      isShowSupplierDialog: false,
      query: "",
      supplierID: 0,
      supplierName: "",
      isSelected: false,
      suppliers: [],
      total: 0,
      pagesize: 15,
      currentPage: 1
    };
  },
  methods: {
    init: function(query) {
      if (!query) {
        this.$message({
          message: "请先输入模糊筛选条件",
          type: "warning"
        });
        return;
      }
      this.query = query;
      this.getData();
      this.isShowSupplierDialog = true;
      this.isSelected = false;
    },
    init: function(type, query) {
      if (!query) {
        this.$message({
          message: "请先输入模糊筛选条件",
          type: "warning"
        });
        return;
      }
      this.query = query;
      this.getData();
      this.type = type;
      this.isShowSupplierDialog = true;
      this.isSelected = false;
    },
    getData: function() {
      let _this = this;
      _this.$axios
        // .get(APIUTL + "/getSupplierList", {
        .get(APIUTL, {
          params: {
            action:"getSupplierList",
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
          _this.suppliers = response.data.data[0];
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    checkSupplier: function(row) {
      this.isSelected = true;
      if (this.type) {
        this.$emit("selected", row.khid, row.khmc, this.type);
      } else {
        this.$emit("selected", row.khid, row.khmc);
      }
      this.isShowSupplierDialog = false;
    },
    handleClose(done) {
      if (!this.isSelected) {
        this.$message({
          message: "您没有选择一个供应商？？？",
          type: "warning"
        });
        if (this.type) {
          this.$emit("selected", "", "", this.type);
        } else {
          this.$emit("selected", "", "");
        }
      }
      done();
    }
  }
};
</script>

<style>
#SupplierPicker .el-dialog__title {
  font-size: 14px;
}
#SupplierPicker .cell {
  font-size: 12px;
}
#SupplierPicker .el-table th {
  padding: 2px 0;
}
#SupplierPicker .el-table tr td {
  padding: 5px 0;
}
#SupplierPicker .el-table {
  margin-top: 15px;
}
#SupplierPicker .el-dialog__body {
  padding-top: 10px;
  padding-bottom: 20px;
}
#SupplierPicker table tbody tr {
  cursor: pointer;
}
</style>
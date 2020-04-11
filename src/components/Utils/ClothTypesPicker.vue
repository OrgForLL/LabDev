<template>
  <el-cascader
    v-model="clothTypes"
    :options="options"
    filterable
    clearable
    size="mini"
    :show-all-levels="false"
  ></el-cascader>
</template>

<script>
export default {
  name: "ClothTypesPicker",
  props: {
    clothTypesTemp: Array
  },
  data: function() {
    return {
      clothTypes: [],
      options: []
    };
  },
  created: function() {
    this.clothTypes = this.clothTypesTemp;
    let _this = this;
    _this.$axios
      // .get(APIUTL + "/getClothTypes", {
      .get(APIUTL, {
        params: {
          action: "getClothTypes"
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
        _this.options = response.data.data;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  watch: {
    clothTypes(newValue, oldvalue) {
      this.$emit("update:clothTypesTemp", this.clothTypes);
    },
    clothTypesTemp(newValue) {
      this.clothTypes = newValue;
    }
  }
};
</script>
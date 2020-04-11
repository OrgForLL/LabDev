<template>
  <el-select v-model="devNum" class="cursor-default" :disabled="disabled" placeholder="请选择">
    <el-option v-for="item in options" :key="item.dm" :label="item.mc" :value="item.dm"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "DevNumPicker",
  props: {
    devNumTemp: String,
    disabled: Boolean
  },
  data: function() {
    return {
      devNum: this.devNumTemp,
      options: []
    };
  },
  created: function() {
    let _this = this;
    _this.$axios
//       .get(APIUTL + "/getDevNumList")
      .get(APIUTL, {
        params: {
          action:"getDevNumList"
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
    devNum(newValue, oldvalue) {
      this.$emit("update:devNumTemp", this.devNum);
    },
    devNumTemp(newValue) {
      this.devNum = newValue;
    }
  }
};
</script>

<style>
.cursor-default input {
  cursor: default !important;
}
</style>
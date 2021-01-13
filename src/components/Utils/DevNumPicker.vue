<template>
  <el-select v-model="devNumTemp" class="cursor-default" :disabled="devDisabled" placeholder="请选择">
    <el-option v-for="item in options" :key="item.dm" :label="item.mc" :value="item.dm"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "DevNumPicker",
  props: {
    devNum: String,
    devDisabled: Boolean
  },
  data: function() {
    return {
      devNumTemp: this.devNum,
      options: []
    };
  },
  created: function() {    
    this.$axios      
      .get(APIUTL, {
        params: {
          action:"getDevNumList"
        }
      })
      .then(response=> {
        if (response.data.errcode == 5010) {
          this.$message({
            showClose: true,
            message: response.data.errmsg,
            type: "error"
          });
          return;
        }
        this.options = response.data.data;
      })
      .catch(error=>{
        console.log(error);
      });
  },
  watch: {
    devNumTemp(newValue, oldvalue) {
      //  console.log(3)
      this.$emit("update:devNum", this.devNumTemp);
    },
    devNum(newValue) {
      // console.log(2)
      this.devNumTemp = newValue;
    }
  }
};
</script>

<style scoped>
.cursor-default input {
  cursor: default !important;
}
</style>
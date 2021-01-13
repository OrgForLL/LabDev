<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">返回</el-menu-item>
  </el-menu>  
</template>

<script>

export default {
  name: "NgvCollecBtn", 
     data() {
      return {
        activeIndex: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        if(key==1){
          this.$emit("goback");
        }
      }
    },
  watch: {
 
  },
  mounted: function() {
   
  }
};
</script>

<style scoped>
.menu-title {
  height: 35px;
  line-height: 35px;
  margin: 0px;
  color: rgb(255, 255, 255);
}
.el-menu-demo {
  padding-left: 02px;
  padding-right: 0px;
  padding-top:5px;
}
.menu-item {
  height: 35px;
  margin-top: -5px;
  background-color: #545c64;
  color: rgb(255, 255, 255);
  float: right;
  border: 0px;
}
.menu-item-flow {
  display: none;
}
.menu-item:hover {
  background-color: rgb(67, 74, 80);
}
</style>

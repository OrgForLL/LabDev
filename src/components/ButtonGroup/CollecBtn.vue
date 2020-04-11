<template>
  <div id="CollecBtn">
    <el-menu
      default-active
      class="el-menu-demo"
      background-color="#545c64"
      mode="horizontal"
      text-color="#fff"
      active-text-color="#ffd04b"
    > 
    <img src="../../assets/logo_MyBB.gif">
      <el-button class="menu-item"  @click="CollecBtnClose()" >关闭</el-button>
      <el-button class="menu-item" @click="CollecBtnMySave()" >保存</el-button>
      <el-button class="menu-item" @click="CollecBtnMyDel()">删除</el-button>     
    </el-menu>
  </div>
</template>

<script>

export default {
  name: "CollecBtn", 
  data: function() {
    return {

    };
  },
  methods: {
    init: function() { 
    },
    CollecBtnMySave: function() {
      this.$emit("collecBtnMySave");
    },
    CollecBtnMyDel:function(){ this.$emit("collecBtnMyDel");},
    CollecBtnClose:function(){ this.$emit("collecBtnClose");},
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

<template>
  <div id="CreateCode">    
    <van-button type="primary">保存</van-button>
    <van-cell title="开始日期" :value="begindate" @click="beginshow = true" />
    <van-cell title="结束日期" :value="enddate" @click="endshow = true" />
    <van-calendar v-model="beginshow" @confirm="onBeginConfirm" />
    <van-calendar v-model="endshow" @confirm="onEndConfirm" />
  </div>
</template>

<script>
import Vue from "vue";
import { Button } from "vant";
import { Calendar } from 'vant';
import { Cell, CellGroup } from 'vant';
import "vant/lib/index.css";
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Button);
Vue.use(Calendar);
export default {
  name: "CreateCode",
  components: {},
  data: function() {
    return {
      begindate: "",
      beginshow: false,
      enddate: "",
      endshow: false
    };
  },
  methods: {
    init() {},
   formatDate(date) {
     
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onBeginConfirm(date) {
      this.beginshow = false;
      this.begindate = this.formatDate(date);
    },
    onEndConfirm(date) {
      this.endshow = false;
      this.enddate = this.formatDate(date);
    },    
  },
  mounted() {}
};
</script>

<style>
</style>

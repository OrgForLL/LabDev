<template>
  <div id="Test">
    <input type="text" placehold="请输入id进行查询" v-model="input_value" @keyup="throttle" ref="input" />

    <ul v-show="state">
      <li v-for="(item,index) in list" :key="index">
        <span>{{item.id}}</span>
        <span>{{item.name}}</span>
        <span>{{item.time}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Test",
  components: {},
  data: function() {
    return {
      input_value: "",
      state: false,
      statu: true,
      dataList: [
        { id: "1001", name: "哈哈", time: "20170207" },
        { id: "1002", name: "呵呵", time: "20170213" },
        { id: "1103", name: "晓丽", time: "20170304" },
        { id: "1104", name: "小兰", time: "20170112" },
        { id: "1205", name: "财务", time: "20170203" },
        { id: "1206", name: "嘻嘻", time: "20170208" },
        { id: "1307", name: "测试", time: "20170201" }
      ],
      list: []
    };
  },
  methods: {
    //触发keyup事件之后触发的方法
    search() {
      //这个变量主要是用来测试节流后和不节流的区别
      var i = 0;
      console.log(i++);

      //定义的新数组存放筛选之后的数据
      this.list = [];
      //拿到当前input输入框输入的值
      this.input_value = this.$refs.input.value;
      //判断展示ul列表，如果输入了就展示没输入就不展示
      if (this.input_value.length > 3) {
        this.state = true;
      } else {
        this.state = false;
      }

      //循环模拟数据的数组
      this.dataList.map(msg => {
        //拿当前json的id、name、time去分别跟输入的值进行比较
        //indexOf 如果在检索的字符串中没有出现要找的值是会返回-1的，所以我们这里不等于-1就是假设输入框的值在当前json里面找到的情况
        if (
          msg.id.indexOf(this.input_value) != -1 ||
          msg.name.indexOf(this.input_value) != -1 ||
          msg.time.indexOf(this.input_value) != -1
        ) {
          //然后把当前json添加到list数组中
          this.list.push(msg);
        }
      });
    },
    throttle() {
      //保持this的指向始终指向vue实例
      var that = this;
      if (!that.statu) {
        return;
      }
      that.statu = false;
      setTimeout(function() {
        console.log(new Date());
        that.search();
        that.statu = true;
      }, 1000);
    },
    debounce(func, wait, immediate) {
      var timeout;
      return function() {
          var context = this,
          args = arguments; //context => window
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
      };
    }
  },
  computed: {},
  created: function() {}
};
</script>

<style>
</style>

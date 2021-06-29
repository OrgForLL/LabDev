<template>
  <div>
    <van-field
      readonly
      clickable
      :label="
        inExtObj && inExtObj.labelHidden != undefined && inExtObj.labelHidden
          ? ''
          : title
      "
      :value="dm2mc"
      :placeholder="placeholder"
      @click="
        show =
          inExtObj && inExtObj.disabled != undefined ? !inExtObj.disabled : true
      "
    />
    <van-popup v-model="show" v-if="show" round position="bottom">
      <PickerSingle
        :model.sync="show"
        :title="title"
        :type="type"
        :inValue="inValue"
        :inExtObj="inExtObj"
        :dataSource="dataSource || options"
        @goback="pickerSingleBack"
        @initback="pickerSingleInitBack"
        :mark="mark"
      />
    </van-popup>
  </div>
</template>

<script>
import { Picker as VanPicker } from "vant";
import { Field as VanField } from "vant";
import { Popup as VanPopup } from "vant";
import * as api from '@/util/apis.js';
export default {
  name: "FieldPickerSingle",
  components: {
    PickerSingle: () => import("@/components/Utils/PickerSingle"),
    VanPicker,
    VanField,
    VanPopup,
  },
  props: {
    placeholder: String,
    mark: [String, Number], //外部调用的标识,回调是统一的,所以需要一个标识是哪个父对象调用的
    title: String, //标题
    inValue: [String, Number], //初始值,有可能是数字或者是字串
    // inText: String, //初始名称,用来显示的
    type: String, //指定内容

    inExtObj: Object, //附加属性,是一个对象,在发送请求的时候会带上这部份参数,
    //disabled表示是否禁用,默认不禁,
    //labelHidden隐藏title,默认不隐藏
    dataSource: Array, //数据源
  },
  computed: {
    dm2mc() {//取默认名称
      if (this.dataSource) {//名称优先外部数据源查出来
        let arr = this.dataSource.filter((item) => {
          return item.dm == this.inValue;
        });

        return (arr[0] || {}).mc || "";
      }

      if (this.options) {
        let arr = this.options.filter((item) => {
          return item.dm == this.inValue;
        });

        return (arr[0] || {}).mc || "";
      }
    },
  },
  data: function () {
    return {
      show: false,  
      options: [],//如果外部没给,这个组件创建出来,不放在子组件里面,是因为这个组件默认值没办法计算
    };
  },
  methods: {
    pickerSingleBack(type, mark, obj, options) {
      this.options=options;
      //options 如果数据源不是外面给的,是里面查询出来的,返回出来,并且给当前组件查找名称
      this.show = false;
      this.$emit("update:inValue", obj.dm); //更新值     
      this.$emit("goback", type, mark, obj); //回调父函数
    },
      //初始化后回调,在有默认值的情况下,且外部需要数据源的其它这了段调用
    pickerSingleInitBack(type,options){
      this.$emit("initback", type, options); //回调父函数
    },
  },
  created: function () {
    //只加载一次
    if (!this.dataSource) {    
      this.loading = true;
      api.fieldPickerSingle(this.type,this.inExtObj,(response)=>{
  
        if (response.errcode != 0) {
          this.$message({
            showClose: true,
            message: response.errmsg,
            type: "error",
          }); 
          this.loading = false;
          return;
        }
        this.options=response.data;
        this.pickerSingleInitBack(this.type,this.options)        
        this.loading = false;
      })
      
    }
  },
  watch: {
 
  },
};
</script>

 
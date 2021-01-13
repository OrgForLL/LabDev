<template>
  <van-picker
    :title="titleTemp"
    show-toolbar
    :columns="columns"
    :default-index="defaultIndex"
    :loading="loading"    
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onChange"
  />
</template>

<script>
import { Picker  as VanPicker  } from 'vant'
export default {
  name: "PickerSingle",
  components: {          
    VanPicker
  },  
  props: {
    mark: [String, Number],
    title:String,//标题
    type:String,    //指定内容
    inValue: [String, Number],//初始值    
    inText: String,//初始值 
    inExtObj:Object,
  },
  data: function() {
    return {
      titleTemp:this.title ||"",
      typeTemp:this.type || "",//取什么数据
      defaultIndex:0,
      options: [],//内容对应的值
      columns:[],//显示的内容
      loading: true,
     
    };
  },
  methods: {
    onConfirm(value, index) {     
      this.$emit("update:model", false);
      this.$emit("update:inValue", this.options[index].dm);
      this.$emit("update:inText", this.options[index].mc);          
      this.$emit("goback",this.typeTemp,this.mark,this.options[index]);
    },
    onChange(picker, value, index) {
   
    },
    onCancel() {
      this.$emit("update:model", false);      
    },
  },  
  created: function() {    
    var params={};
    //成衣风格
    if(this.typeTemp=="spfg") params.action="getDesignStyleList";
    //调样中的颜色情况
    if(this.typeTemp=="materialApplyTypes") params.action="getMaterialApplyTypes";

    //调样中的颜色情况
    if(this.typeTemp=="materialApplyBm") params.action="getMaterialApplyBm";


//项目经理
    if(this.typeTemp=="materialApplyXmjl") params.action="getMaterialApplyXmjl";

    

    //开发编号
    if(this.typeTemp=="devNumList") params.action="getDevNumList";
    
//调样中的采购类别
    if(this.typeTemp=="materialApplyDjlb") params.action="getMaterialApplyDjlb";    
    //商品类别
    if(this.typeTemp=="splb"){      
      params.action="getClothTypes";
      if(this.inExtObj && this.inExtObj.query && this.inExtObj.query=="yfdy"){
        params.query="yfdy";
      }
    }
    if(params.action==""){
      console.log("type is empty");
      return false;
    }
    this.loading=true;
    this.$axios      
      .get(APIUTL, {
        params: params
      })
      .then(response=> {
        if (response.data.errcode != 0) {
          this.$message({
            showClose: true,
            message: response.data.errmsg,
            type: "error"
          });
          return;
        }
        var data=[];
        if(this.typeTemp=="spfg" || this.typeTemp=="materialApplyTypes" || this.typeTemp=="materialApplyDjlb" || this.typeTemp=="materialApplyBm" )        
          data=response.data.data[0];
        else if (this.typeTemp=="devNumList")
          data=response.data.data;
        else if (this.typeTemp=="materialApplyXmjl")
          {//项目经理
            for(var i=0;i<response.data.data[0].length;i++){
              data.push({"dm":response.data.data[0][i].ryid,"mc":response.data.data[0][i].xm,"fgid":response.data.data[0][i].fgid});
            }
          }
        else if (this.typeTemp=="splb") {
          for(var i=0;i<response.data.data.length;i++){            
            if(response.data.data[i].value==1201){
              //利郎运动系列 不要
            }else{
              for(var j=0;j<response.data.data[i].children.length;j++){
                //jb2
                var jb3=response.data.data[i].children[j].children;
                
                for(var z=0;z<jb3.length;z++){//加空格转成字符串
                  data.push({"dm":jb3[z].value,"mc":jb3[z].label});
                }
              }
            }
          }
        }


        //查找默认值 数据默认格式dm ,mc        
        for(var i=0;i<data.length;i++)     {
            this.columns.push(data[i].mc);
            this.options.push(data[i]);
            if(data[i].dm==this.inValue){
              this.defaultIndex=i;
            }
        }   
      
        this.loading=false;
      })
      .catch(error=>{
        console.log(error);
        this.loading=false;
      });
  },
  watch: {
    inValue(newValue) {
      //如果父组件有直接修改值,那么默认值不会变,要手动更改
       for(var i=0;i<this.options.length;i++){            
            if(this.options[i].dm==this.inValue){
              this.defaultIndex=i;
            }
        } 
     
    }
  }
};
</script>

 
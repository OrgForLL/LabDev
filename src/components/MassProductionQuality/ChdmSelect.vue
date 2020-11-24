<template>
  <el-select
    ref="select"
    @hook:mounted="cancalReadOnly"
    @visible-change="cancalReadOnly"
    v-model="chdmTemp"
    filterable
    remote
    reserve-keyword
    placeholder="输入至少6位"
    :disabled="disabled"
    :remote-method="remoteMethod"
    :loading="loading"    
  >
    <el-option
      v-for="item in options"
      :key="item.chdmvalue"
      :label="item.label"
      :value="item.chdmvalue"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: "MassProductionQualityChdmSelect",
  props: {
    chdm: String, 
    chmc: String, 
    djid: Number,
    disabled: Boolean,
    devNum: String, 
  },
  data() {
    return {
      options: [],
      chdmTemp: this.chdm,
      list: [],
      loading: false
    };
  },
  mounted() {
    // 开发编号 下拉框 只读
    //EL-SELECT 在IOS上面有BUG，不能输入
    // Array.from(document.getElementsByClassName("el-select")).forEach(item => {
    //   console.log(item)
    //   item.children[0].children[0].removeAttribute("readOnly");
    //   item.children[0].children[0].onblur = function() {       
    //     setTimeout(() => {
    //       this.removeAttribute("readOnly");
    //     }, 200);
    //   };
    // });
  },
  methods: {
    cancalReadOnly(onOff) {//EL-SELECT 在IOS上面有BUG，不能输入
      this.$nextTick(() => {
          if (!onOff) {
              const {select} = this.$refs;
              const input = select.$el.querySelector('.el-input__inner');
              input.removeAttribute('readonly');
          }
      });  
    },
    remoteMethod(query) {
      if (query !== "" && this.devNum != "" &&  query.length>=6) {
        this.loading = true;
        setTimeout(() => {
          this.loadAll(this.devNum, query, chdmList=> {
            this.loading = false;
            this.options = [];
            for (let item of chdmList) {
              //e.bsbz,e.rsbz,e.zzbz,e.rsgybz,e.hzbz,e.cpbz
              this.options.push({
                chdmvalue: item.chdm,
                chmcvalue:item.chmc,
                label: item.chdm,
                djid: item.id,
                desc: {
                  bsbz: item.bsbz,
                  rsbz: item.rsbz,
                  zzbz: item.zzbz,
                  rsgybz: item.rsgybz,
                  hzbz: item.hzbz,
                  cpbz: item.cpbz
                }
              });
            }
          });
        }, 3000);
      } else {
        this.options = [];
      }
    },
    loadAll(kfbh, chdm, cb) {
      this.$axios
        .get(APIUTL, {
          params: {
            action: "getSGChdm",
            kfbh: kfbh,
            chdm: chdm
          }
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
          cb(response.data.data);

          // _this.mdata.chdmList = [];
          // var groupArr = new Array();
          // for (let item of chdmList) {
          //   _this.mdata.chdmList.push({
          //     value: item.chdm,
          //     chmc: item.chmc
          //   });
          // }
          // cb(_this.mdata.chdmList);
        })
        .catch(error=> {
          console.log(error);
        });
    }
  },
  watch: {
    chdmTemp(newValue, oldvalue) {   
      //props中的基本类型的数据不能直接由子组件去更新，所以要使用   $emit更新父组件
      //父组件中可能直接清空子组件的数据，所以要判断一下
      if(newValue){
        var mbObj = this.options.find(item => item.chdmvalue === newValue);     
        this.$emit("update:chdm", newValue);
        // console.log("watch chdmTemp");
        this.$emit("update:djid", mbObj.djid);
        this.$emit("update:desc", mbObj.desc);
        this.$emit("update:chmc", mbObj.chmcvalue);
        //this.chdm=newValue
      }
    },
    chdm(newValue) {
      //因为没有使用props中的变量，所以如果props中的chdm变更，那么chdmTemp不会更新
      this.chdmTemp = newValue;
      if(newValue=="") this.options=[];
    }
  }
};
</script>

 
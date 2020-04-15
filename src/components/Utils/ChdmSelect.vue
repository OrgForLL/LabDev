<template>
  <el-select
    v-model="chdmTemp"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
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
  name: "ChdmSelect",
  props: {
    chdm: String,
    disabled: Boolean,
    devNum: String
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
    Array.from(document.getElementsByClassName("el-select")).forEach(item => {
      item.children[0].children[0].removeAttribute("readOnly");
      item.children[0].children[0].onblur = function() {
        let _this = this;
        setTimeout(() => {
          _this.removeAttribute("readOnly");
        }, 200);
      };
    });
  },
  methods: {
    remoteMethod(query) {
      let _this = this;
      if (query !== "" && _this.devNum != "") {
        _this.loading = true;
        setTimeout(() => {
          _this.loadAll(_this.devNum, query, function(chdmList) {
            _this.loading = false;
            _this.options = [];
            for (let item of chdmList) {
              //e.bsbz,e.rsbz,e.zzbz,e.rsgybz,e.hzbz,e.cpbz
              _this.options.push({
                chdmvalue: item.chdm,
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
        _this.options = [];
      }
    },
    loadAll(kfbh, chdm, cb) {
      let _this = this;
      _this.$axios
        .get(APIUTL, {
          params: {
            action: "getSGChdm",
            kfbh: kfbh,
            chdm: chdm
          }
        })
        .then(function(response) {
          if (response.data.errcode != 0) {
            _this.$message({
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
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  watch: {
    chdmTemp(newValue, oldvalue) {
      this.$emit("update:chdm", newValue);
      var mbObj = this.options.find(item => item.chdmvalue === newValue);
      // console.log(tempArr);
      this.$emit("update:djid", mbObj.djid);
      this.$emit("update:desc", mbObj.desc);
      //this.chdm=newValue
    },
    chdm(newValue) {
      this.chdmTemp = newValue;
    }
  }
};
</script>

 
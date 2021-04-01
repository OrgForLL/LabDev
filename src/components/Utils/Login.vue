<template>
  <div style="margin: 10px" v-loading="loading" v-show="show">
    <h2 style="text-align: center">Login In</h2>
    <el-form>
      <el-form-item>
        <el-col :span="4">用户名：</el-col>
        <el-col :span="20"
          ><el-input v-model="mdata.username"></el-input
        ></el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="4">密 码:</el-col>
        <el-col :span="20"
          ><el-input type="password" v-model="mdata.userpass"></el-input
        ></el-col>
      </el-form-item>
    </el-form>
    <div class="errtips">{{ this.mdata.errmsg }}</div>
    <div style="text-align: right">
      <el-button type="primary" @click="login">login</el-button>
    </div>
  </div>
</template>

<script>
import { getUrlKey } from "@/assets/js/utils";
import myStore from "@/components/Utils/Store";
export default {
  name: "Login",
  components: {},
  data: function () {
    return {
      mdata: {
        username: "",
        userpass: "",
        errmsg: "",
      },
      show: false, //这个用来自动登陆的,所以界面不用展示
      loading: true, //这个用来自动登陆的,所以界面不用展示
    };
  },
  methods: {
    init() {
      this.imLogin();
    },
    doLogin() {},
    login() {
      let param = new Object();
      param.password = this.mdata.userpass;
      param.name = this.mdata.username;
      let url =
        APIUTL +
        "?serviceName=svr-coreldrawaddon&action=login&name=" +
        this.mdata.username +
        "&password=" +
        this.mdata.userpass +
        "";
      this.$axios.get(url).then((response) => {
        console.log(response);
        if (response.data.errcode == 0) {
          let obj = {};
          obj.userid = response.data.data.id;
          obj.cname = response.data.data.cname;
          myStore.userInfo = obj;
          this.show = false;
          let url = getUrlKey("path", window.location.href);
          this.$router.push({
            path: url.replace(
              "apptoken=" + getUrlKey("apptoken", window.location.href),
              ""
            ),
          });
        } else {
          console.log(response.data.message);
          this.mdata.errmsg = response.data.message;
          this.loading = false;
          this.show = true;
        }
      });
    },
    imLogin() {
      //取IM中身份
      let param = new Object();
      param.action = "getUserinfo";
      param.token = getUrlKey("apptoken", window.location.href);
      param.dept = "";
      param.Parameter = [1];
      param.orgid = 0;
      this.$axiosPost.post(APIUTLOuth, param).then((response) => {
        if (response.data.code == 200) {
          let obj = {};
          obj.userid = response.data.data.userid;
          obj.cname = response.data.data.cname;
          myStore.userInfo = obj;
          myStore.userInfo.apptoken = param.token;
          // console.log(myStore.userInfo);
          this.show = false;
          this.$router.push({ path: getUrlKey("path", window.location.href) });
        } else {
          console.log(response.data.message);
          this.mdata.errmsg = response.data.message;
          this.loading = false;
          this.show = true;
        }
      });
      //取IM中身份 end
    },
  },
  mounted() {},
  watch: {},
  computed: {},
  created() {
    this.init();
  },
};
</script>

<style>
.login_dialog {
  width: 100%;
  height: 100%;
  margin-top: 0px !important;
}
</style>

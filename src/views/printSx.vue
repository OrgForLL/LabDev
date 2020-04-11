<template>
    <div v-loading.fullscreen="loading">
        <table cellpadding="0" cellspacing="0" class="mytable" style="margin:auto">
		<thead>
			<tr><td colspan="32"><h2>{{cloth.documentNum}}纱线自主开发单</h2></td></tr>
		</thead>
		<tbody>
			<tr>
				<td colspan="4">季度</td><td colspan="6">{{form.jd | formatjd(quarter)}}</td>
				<td colspan="4">纱线供应商</td><td colspan="8">{{form.sxsupplierName}}</td>
				<td colspan="4">制单人</td><td colspan="6">{{form.zdr}}</td>
			</tr>
			<tr>
				<td colspan="4">纺纱方式</td><td colspan="6">{{form.fsfs | formatfsfs(fsfs)}}</td>
				<td colspan="4">纱线编号</td><td colspan="8">{{form.sxbh}}</td>
				<td colspan="4">纱支规格</td><td colspan="6">{{form.szgg}}</td>
			</tr>
			<tr>
				<td colspan="4">织造类型</td><td colspan="6">{{form.zzlx | formatfsfs(zzlx)}}</td>
				<td colspan="4">纱线成分</td><td colspan="8">{{form.sxcf}}</td>
				<td colspan="4">需求数量(kg)</td><td colspan="6">{{form.xqsl}}</td>
			</tr>
			<tr>
				<td colspan="4">织造用途</td><td colspan="6">{{form.zzyt | formatfsfs(zzyt)}}</td>
				<td colspan="4">纱线单号</td><td colspan="8">{{form.sxdh}}</td>
				<td colspan="4">价格范围</td><td colspan="6">{{form.jgfw}}</td>
			</tr>
			<tr><td colspan="32"></td></tr>
			<tr>
				<td colspan="3">原料成分(天然纤维)</td>
				<td colspan="3">品级</td>
				<td colspan="3">长度(mm)</td>
				<td colspan="9">备注</td>
				<td colspan="14">指标要求</td>
			</tr>
			<tr>
				<td colspan="3">{{form.trxw[0]?form.trxw[0].ylcf:''}}</td>
				<td colspan="3">{{form.trxw[0]?form.trxw[0].pj:''}}</td>
				<td colspan="3">{{form.trxw[0]?form.trxw[0].cd:''}}</td>
				<td colspan="9">{{form.trxw[0]?form.trxw[0].bz:''}}</td>
				<td colspan="4">百米重量偏差(%)</td>
				<td colspan="3">{{form.zbyq.zlpc}}</td>
				<td colspan="4">条干不匀率CV(%)</td>
				<td colspan="3">{{form.zbyq.byl}}</td>
			</tr>
			<tr>
				<td colspan="3">{{form.trxw[1]?form.trxw[1].ylcf:''}}</td>
				<td colspan="3">{{form.trxw[1]?form.trxw[1].pj:''}}</td>
				<td colspan="3">{{form.trxw[1]?form.trxw[1].cd:''}}</td>
				<td colspan="9">{{form.trxw[1]?form.trxw[1].bz:''}}</td>
				<td colspan="4">百米重量不匀率变异系数(%)</td>
				<td colspan="3">{{form.zbyq.byxs}}</td>
				<td colspan="4">细节(-50%) (个/千米)</td>
				<td colspan="3">{{form.zbyq.xj}}</td>
			</tr>
			<tr>
				<td colspan="3">{{form.trxw[2]?form.trxw[2].ylcf:''}}</td>
				<td colspan="3">{{form.trxw[2]?form.trxw[2].pj:''}}</td>
				<td colspan="3">{{form.trxw[2]?form.trxw[2].cd:''}}</td>
				<td colspan="9">{{form.trxw[2]?form.trxw[2].bz:''}}</td>
				<td colspan="4">单纱断裂强力(CN)</td>
				<td colspan="3">{{form.zbyq.dlql}}</td>
				<td colspan="4">粗节(+50%) (个/千米)</td>
				<td colspan="3">{{form.zbyq.cj}}</td>
			</tr>
			<tr>
				<td colspan="3">原料成分(化学纤维)</td>
				<td colspan="3">纤维细度</td>
				<td colspan="3">长度(mm)</td>
				<td colspan="9">备注</td>
				<td colspan="4">最小强力(CN)</td>
				<td colspan="3">{{form.zbyq.zxql}}</td>
				<td colspan="4">棉结(+200%) (个/千米)</td>
				<td colspan="3">{{form.zbyq.mj}}</td>
			</tr>
			<tr>
				<td colspan="3">{{form.hxxw[0]?form.hxxw[0].ylcf:''}}</td>
				<td colspan="3">{{form.hxxw[0]?form.hxxw[0].xwxd:''}}</td>
				<td colspan="3">{{form.hxxw[0]?form.hxxw[0].cd:''}}</td>
				<td colspan="9">{{form.hxxw[0]?form.hxxw[0].bz:''}}</td>
				<td colspan="4">强力CV% (%)</td>
				<td colspan="3">{{form.zbyq.qlcv}}</td>
				<td colspan="4">毛羽(3MM)</td>
				<td colspan="3">{{form.zbyq.my}}</td>
			</tr>
			<tr>
				<td colspan="3">{{form.hxxw[1]?form.hxxw[1].ylcf:''}}</td>
				<td colspan="3">{{form.hxxw[1]?form.hxxw[1].xwxd:''}}</td>
				<td colspan="3">{{form.hxxw[1]?form.hxxw[1].cd:''}}</td>
				<td colspan="9">{{form.hxxw[1]?form.hxxw[1].bz:''}}</td>
				<td colspan="4">单纱断裂强度(CN/TEX)</td>
				<td colspan="3">{{form.zbyq.dlqd}}</td>
				<td colspan="4">捻系数</td>
				<td colspan="3">{{form.zbyq.nxs}}</td>
			</tr>
			<tr>
				<td colspan="3">{{form.hxxw[2]?form.hxxw[2].ylcf:''}}</td>
				<td colspan="3">{{form.hxxw[2]?form.hxxw[2].xwxd:''}}</td>
				<td colspan="3">{{form.hxxw[2]?form.hxxw[2].cd:''}}</td>
				<td colspan="9">{{form.hxxw[2]?form.hxxw[2].bz:''}}</td>
				<td colspan="4">单纱断裂伸长率(%)</td>
				<td colspan="3">{{form.zbyq.dlscl}}</td>
				<td colspan="4"></td>
				<td colspan="3"></td>
			</tr>
			<tr>
				<td colspan="3">纱线要求：</td>
				<td colspan="29">{{form.sxyq}}</td>
			</tr>
			<tr>
				<td colspan="3">备注信息：</td>
				<td colspan="29">{{form.bzxx}}</td>
			</tr>
			<tr>
                <td colspan="4">供应商确认</td>
                <td colspan="8"></td>
                <td colspan="4">计划完成时间</td>
                <td colspan="6">{{form.jhwcsj}}</td>
                <td colspan="4">实际完成时间</td>
                <td colspan="6"></td>
            </tr>
            <tr>
                <td colspan="4">纱线工程师</td>
                <td colspan="4"></td>
                <td colspan="4">面料工程师</td>
                <td colspan="4"></td>
                <td colspan="4">业务统筹</td>
                <td colspan="4"></td>
                <td colspan="4">研究所副总监</td>
                <td colspan="4"></td>
            </tr>
		</tbody>
	</table>
    </div>
</template>

<script>
export default {
    name:'printSx',
    data(){
        return{
            loading:true,
            form: {
                    id: 0,
                    isSingle: 0,
                    djh: "",
                    jd: 0,
                    //this.devNumTemp,
                    sxsupplierId: "",
                    sxsupplierName: "",
                    fsfs: "",
                    zdr: "",
                    //this.mainData.creator,
                    sxbh: "",
                    szgg: "",
                    zdrq: "",
                    //this.getDate(),
                    sxcf: "",
                    zzlx: "",
                    xqsl: "",
                    sxdh: "保存后自动生成",
                    zzyt: "",
                    jgfw: "",
                    sxyq: "",
                    bzxx: "",
                    jhwcsj: "",
                    trxw: [
                    { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
                    { flag: 0, ylcf: "", pj: "", cd: "", bz: "" },
                    { flag: 0, ylcf: "", pj: "", cd: "", bz: "" }
                    ],
                    trxwid: [
                    { ylcf: 0, pj: 0, cd: 0, bz: 0 },
                    { ylcf: 0, pj: 0, cd: 0, bz: 0 },
                    { ylcf: 0, pj: 0, cd: 0, bz: 0 }
                    ],
                    hxxw: [
                    { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
                    { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" },
                    { flag: 0, ylcf: "", xwxd: "", cd: "", bz: "" }
                    ],
                    hxxwid: [
                    { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
                    { ylcf: 0, xwxd: 0, cd: 0, bz: 0 },
                    { ylcf: 0, xwxd: 0, cd: 0, bz: 0 }
                    ],
                    zbyq: {
                    zlpc: "",
                    byl: "",
                    byxs: "",
                    xj: "",
                    dlql: "",
                    cj: "",
                    zxql: "",
                    mj: "",
                    qlcv: "",
                    myType: "my",
                    my: "",
                    dlqd: "",
                    nxs: "",
                    dlscl: "",
                    swmsc: ""
                    },
                    zbyqid: {
                    zlpc: 0,
                    byl: 0,
                    byxs: 0,
                    xj: 0,
                    dlql: 0,
                    cj: 0,
                    zxql: 0,
                    mj: 0,
                    qlcv: 0,
                    myType: 0,
                    my: 0,
                    dlqd: 0,
                    nxs: 0,
                    dlscl: 0,
                    swmsc: 0
                    }
                },
                cloth: {
                        versionNum: "",
                        devNum: "",
                        designerStyle: "",
                        documentNum: "保存后自动生成",
                        use: "",
                        sourceVersionNum: "",
                        creator: "",
                        createDate: new Date(),
                        cpid: 0,
                        cpgxid: 0,
                        cpVersionNum: "",
                        cpsupplierId: 0,
                        cpsupplierName: "",
                        sxyq: "",
                        zzyq: "",
                        rsyq: "",
                        hzyq: "",
                        changeToPart: true,
                        gxlx: 0
                       },
                fsfs: [],
                zzlx: [],
                zzyt: [],
                quarter:[]
        }
    },
    methods:{
        init: function(){
            let _this=this;
            Promise.all([
                //获取子版单号纱线的数据
                _this.$axios.get(APIUTL,{
                        params:{
                             action: "getSxInfo",
                            id: _this.$route.query.id,
                            parentId: _this.$route.query.parentID,
                            gxid: _this.$route.query.gxid
                        }
                    }),
                //获取主版单号的数据
                _this.$axios.get(APIUTL,{
                    params:{
                        action: "getInitInfo",
                        id: _this.$route.query.parentID,
                        userssid: _this.$route.query.userssid,
                    }
                }),
                //获取 纺纱方式  + 织造类型 + 织造用途
                _this.$axios.get(APIUTL,{
                        params:{
                            action:"getSxInitData"
                        }
                    }),
                //获取所有季度
                    _this.$axios.get(APIUTL, {
                        params: {
                        action:"getDevNumList"
                        }
                    })
            ])
            .then((response)=>{
                _this.form = response[0].data.data;

                _this.cloth = response[1].data.data[4][0];  //为了获取源版单号

                _this.fsfs = response[2].data.data[0];
                _this.zzlx = response[2].data.data[1];
                _this.zzyt = response[2].data.data[2];

                _this.quarter = response[3].data.data;

                _this.loading=false;
            })
            // //获取子版单号纱线的数据
            //         _this.$axios.get(APIUTL,{
            //             params:{
            //                  action: "getSxInfo",
            //                 id: _this.$route.query.id,
            //                 parentId: _this.$route.query.parentID,
            //                 gxid: _this.$route.query.gxid
            //             }
            //         })
            //         .then((response)=>{
            //             _this.form = response.data.data;
            //             console.log(response)
            //             _this.showit = true;
            //         })
            //         .catch((error)=>{
            //             console.log('请求失败!')
            //         })

            //         // //获取主版单号的数据
            //         // _this.$axios.get(APIUTL,{
            //         //     params:{
            //         //         action: "getInitInfo",
            //         // 		id: _this.$route.query.parentID,
            //         //         userssid: _this.$route.query.userssid,
            //         //     }
            //         // })
            //         // .then((response)=>{
            //         //   _this.alldesigners = response.data.data[1]; //
            //         //   _this.cloth = response.data.data[4];  //为了获取源版单号
            //         //   _this.colors = response.data.data[5];
            //         //  _this.designers = response.data.data[6];
            //         //   _this.info = response.data.data[7];
            //         // })

            //         //获取 纺纱方式  + 织造类型 + 织造用途
            //         _this.$axios.get(APIUTL,{
            //             params:{
            //                 action:"getSxInitData"
            //             }
            //         })
            //         .then((response)=>{
            //             _this.fsfs = response.data.data[0];
            //             _this.zzlx = response.data.data[1];
            //             _this.zzyt = response.data.data[2];
            //         })

            //         //获取所有季度
            //         _this.$axios.get(APIUTL, {
            //             params: {
            //             action:"getDevNumList"
            //             }
            //         })
            //         .then(function(response) {
            //             _this.quarter = response.data.data;
            //         })
        }
    },
    filters:{
        //处理季度
                formatjd: function(value,all){
                    var a=all.filter(el=>{
                        return el.dm==value
                    })
                    return a.length ? a[0].mc:'';
                },
                //过滤纺纱方式 + 织造类型 + 织造用途
                formatfsfs: function(value,all){
                    var a = all.filter(el=>{
                       return value==el.dm
                    })
                    return a[0]?a[0].mc:'';
                },
    },
    computed:{

    },
    mounted(){
        this.init();
    }
}
</script>

<style scoped>
* {
        padding: 2px;
    }

    .mytable {
        padding: 0px;
        table-layout: fixed;
        word-break: break-all;
        word-wrap: break-word;
        width: 1120px;
        height: 720px;
        margin-left: 100px;
        font-size: 12px;
    }

    div {
        padding: 20px;
        text-align: center;
        width: 1120px;
        height:720px;
        margin: 0 auto;
        /* border: 1px solid #e6e6e6;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.16); */
    }

    table {
        border: 1px solid black;
        border-left: none;
        border-top: none;
/*        width: 800px;
        height: 1120px;*/
        width: 1120px;
        height: 720px;
    }

    td {
        border: 1px solid black;
        border-bottom: none;
        border-right: none;
        text-align: center;
        height: 34px;
    }
</style>
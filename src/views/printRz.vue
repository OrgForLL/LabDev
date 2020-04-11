<template>
    <div id="printRz"  v-loading.fullscreen="loading">
        <table cellpadding="0" cellspacing="0" class="mytable" style="margin:auto">
            <thead>
                <tr><td colspan="32"><h2>{{cloth.documentNum}}染整工艺开发单</h2></td></tr>
            </thead>
            <tbody >
                <tr>
                    <td colspan="3">季度</td><td colspan="5">{{form.jd | formatjd(quarter)}}</td>
                    <td colspan="3">染整供应商</td><td colspan="5">{{form.rzsupplierName}}</td>
                    <td colspan="3">成品针数WPI/经密</td><td colspan="5">{{form.cpjm}}</td>
                    <td colspan="3">制单人</td><td colspan="5">{{form.zdr}}</td>
                </tr>
                <tr>
                    <td colspan="3">成衣品类</td><td colspan="5">{{form.cypl=="[]"?'':form.cypl | handlecypl(clothtype)}}</td>
                    <td colspan="3">染损(%)</td><td colspan="5">{{form.rs}}</td>
                    <td colspan="3">成品针数CPI/纬密</td><td colspan="5">{{form.cpwm}}</td>
                    <td colspan="3">制单日期</td><td colspan="5">{{form.zdrq}}</td>
                </tr>
                <tr>
                    <td colspan="3">成分</td><td colspan="5">{{form.cf}}</td>
                    <td colspan="3">染整单号</td><td colspan="5">{{form.rzdh}}</td>
                    <td colspan="3">成品幅宽</td><td colspan="5">{{form.cpfk}}</td>
                    <td colspan="3">成品克重(g/m)</td><td colspan="5">{{form.cpkz}}</td>
                </tr>
                <tr>
                    <td colspan="3">纱支规格</td><td colspan="5">{{form.szgg}}</td>
                    <td colspan="3">源版单号</td><td colspan="5">{{cloth.sourceVersionNum}}</td>
                    <td colspan="16"></td>
                </tr>
                <tr><td colspan="32">开发面料工艺</td></tr>
                <tr>
                    <td colspan="2" rowspan="3">工艺流程</td>
                    <td colspan="2" rowspan="2">常规工艺</td>
                    <td colspan="9" rowspan="2">{{form.gy.cggy | handledata(cggy)}}</td>
                    <td colspan="2" rowspan="2">色号</td>
                    <td colspan="7" rowspan="2">贴颜色样</td>
                    <td colspan="6">设计师确认数量</td>
                    <td colspan="2" rowspan="2">成品数量</td>
                    <td colspan="2" rowspan="2">投坯数量</td>
                </tr>
                <tr>
                    <td colspan="1">{{designers[0].xmsx_1 == -1?'':designers[0].xmsx_1 | handldesigner(alldesigners)}}</td>
                    <td colspan="1">{{designers[0].xmsx_2 == -1?'':designers[0].xmsx_2 | handldesigner(alldesigners)}}</td>
                    <td colspan="1">{{designers[0].xmsx_3 == -1?'':designers[0].xmsx_3 | handldesigner(alldesigners)}}</td>
                    <td colspan="1">{{designers[0].xmsx_4 == -1?'':designers[0].xmsx_4 | handldesigner(alldesigners)}}</td>
                    <td colspan="1">{{designers[0].xmsx_5 == -1?'':designers[0].xmsx_5 | handldesigner(alldesigners)}}</td>
                    <td colspan="1">{{designers[0].xmsx_6 == -1?'':designers[0].xmsx_6 | handldesigner(alldesigners)}}</td>
                </tr>
                <tr>
                    <td colspan="2">特殊工艺/染助剂</td>
                    <td colspan="9">{{form.gy.rzj}}</td>
                    <td colspan="2">{{colors[0]?colors[0].color: ''}}</td>
                    <td colspan="7">{{colors[0]?colors[0].sticker: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len1: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len2: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len3: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len4: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len5: ''}}</td>
                    <td colspan="1">{{colors[0]?colors[0].len6: ''}}</td>
                    <td colspan="2">{{colors[0]?colors[0].total:''}}</td>
                    <td colspan="2">{{colors[0]?getDamagedLength(colors[0]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2" rowspan="2">前处理</td>
                    <td colspan="2">工艺条件</td>
                    <td colspan="9">{{form.gy.qclgytj}}</td>
                    <td colspan="2">{{colors[1]?colors[1].color: ''}}</td>
                    <td colspan="7">{{colors[1]?colors[1].sticker: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len1: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len2: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len3: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len4: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len5: ''}}</td>
                    <td colspan="1">{{colors[1]?colors[1].len6: ''}}</td>
                    <td colspan="2">{{colors[1]?colors[1].total:''}}</td>
                    <td colspan="2">{{colors[1]?getDamagedLength(colors[1]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2">品质要求</td>
                    <td colspan="9">{{form.gy.qclpzyq}}</td>
                    <td colspan="2">{{colors[2]?colors[2].color:''}}</td>
                    <td colspan="7">{{colors[2]?colors[2].sticker: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len1: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len2: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len3: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len4: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len5: ''}}</td>
                    <td colspan="1">{{colors[2]?colors[2].len6: ''}}</td>
                    <td colspan="2">{{colors[2]?colors[2].total:''}}</td>
                    <td colspan="2">{{colors[2]?getDamagedLength(colors[2]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2" rowspan="3">印染</td>
                    <td colspan="2">染色方式</td>
                    <td colspan="4">{{form.gy.rsfs | handledata(rsfs)}}</td>
                    <td colspan="2">印花方式</td>
                    <td colspan="3">{{form.gy.yhfs | handledata(yhfs)}}</td>
                    <td colspan="2">{{colors[3]?colors[3].color: ''}}</td>
                    <td colspan="7">{{colors[3]?colors[3].sticker: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len1: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len2: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len3: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len4: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len5: ''}}</td>
                    <td colspan="1">{{colors[3]?colors[3].len6: ''}}</td>
                    <td colspan="2">{{colors[3]?colors[3].total:''}}</td>
                    <td colspan="2">{{colors[3]?getDamagedLength(colors[3]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2">工艺条件</td>
                    <td colspan="9">{{form.gy.yrgytj}}</td>
                    <td colspan="2">{{colors[4]?colors[4].color: ''}}</td>
                    <td colspan="7">{{colors[4]?colors[4].sticker: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len1: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len2: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len3: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len4: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len5: ''}}</td>
                    <td colspan="1">{{colors[4]?colors[4].len6: ''}}</td>
                    <td colspan="2">{{colors[4]?colors[4].total:''}}</td>
                    <td colspan="2">{{colors[4]?getDamagedLength(colors[4]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2">品质要求</td>
                    <td colspan="9">{{form.gy.yrpzyq}}</td>
                    <td colspan="2">{{colors[5]?colors[5].color: ''}}</td>
                    <td colspan="7">{{colors[5]?colors[5].sticker: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len1: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len2: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len3: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len4: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len5: ''}}</td>
                    <td colspan="1">{{colors[5]?colors[5].len6: ''}}</td>
                    <td colspan="2">{{colors[5]?colors[5].total:''}}</td>
                    <td colspan="2">{{colors[5]?getDamagedLength(colors[5]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2" rowspan="2">后整</td>
                    <td colspan="2">工艺条件</td>
                    <td colspan="9">{{form.gy.hzgytj}}</td>
                    <td colspan="2">{{colors[6]?colors[6].color: ''}}</td>
                    <td colspan="7">{{colors[6]?colors[6].sticker: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len1: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len2: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len3: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len4: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len5: ''}}</td>
                    <td colspan="1">{{colors[6]?colors[6].len6: ''}}</td>
                    <td colspan="2">{{colors[6]?colors[6].total:''}}</td>
                    <td colspan="2">{{colors[6]?getDamagedLength(colors[6]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2">品质要求</td>
                    <td colspan="9">{{form.gy.hzpzyq}}</td>
                    <td colspan="2">{{colors[7]?colors[7].color: ''}}</td>
                    <td colspan="7">{{colors[7]?colors[7].sticker: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len1: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len2: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len3: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len4: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len5: ''}}</td>
                    <td colspan="1">{{colors[7]?colors[7].len6: ''}}</td>
                    <td colspan="2">{{colors[7]?colors[7].total:''}}</td>
                    <td colspan="2">{{colors[7]?getDamagedLength(colors[7]):''}}</td>
                </tr>
                <tr>
                    <td colspan="4" rowspan="2">特别注意事项</td>
                    <td colspan="9" rowspan="2">{{form.tbzysx}}</td>
                    <td colspan="2">{{colors[8]?colors[8].color: ''}}</td>
                    <td colspan="7">{{colors[8]?colors[8].sticker: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len1: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len2: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len3: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len4: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len5: ''}}</td>
                    <td colspan="1">{{colors[8]?colors[8].len6: ''}}</td>
                    <td colspan="2">{{colors[8]?colors[8].total:''}}</td>
                    <td colspan="2">{{colors[8]?getDamagedLength(colors[8]):''}}</td>
                </tr>
                <tr>
                    <td colspan="2">合计</td>
                    <td colspan="7"></td>
                    <td colspan="1">{{count[0]}}</td>
                    <td colspan="1">{{count[1]}}</td>
                    <td colspan="1">{{count[2]}}</td>
                    <td colspan="1">{{count[3]}}</td>
                    <td colspan="1">{{count[4]}}</td>
                    <td colspan="1">{{count[5]}}</td>
                    <td colspan="2"></td>
                    <td colspan="2"></td>
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
                    <td colspan="4">染整工程师</td>
                    <td colspan="7"></td>
                    <td colspan="4">业务统筹</td>
                    <td colspan="7"></td>
                    <td colspan="4">研究所总监</td>
                    <td colspan="6"></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name:"printRz",
    data() {
        return {
            loading: true,
                colors: [
                            {
                              mxid: 0,
                              color: "",
                              sticker: "",
                              sourceColorId: 0,
                              sourceColor: "",
                              len1: "",
                              len2: "",
                              len3: "",
                              len4: "",
                              len5: "",
                              len6: "",
                              number: 0,
                              total: 0,
                              loss: 0,
                              damagedLength: "",
                              isDel: 0
                            }
                        ],
                        info: [
                            // 去掉默认
                             {
                              id: 0,
                              versionNum: "",
                              ProcessType: 20,
                              ProcessTypeName: "纱线",
                              parentID: 0,
                              // Number(this.$route.query.MyDJid),
                              creator: "",
                              createDate: "",
                              // this.myGetDate(),
                              supplier: "",
                              yt: "",
                              loss: 0,
                              gxid: 0,
                              isDel: 0
                            } 
                          ],
                designers: [
                            { xmsx_1: "", disable: true },
                            { xmsx_2: "", disable: true },
                            { xmsx_3: "", disable: true },
                            { xmsx_4: "", disable: true },
                            { xmsx_5: "", disable: true },
                            { xmsx_6: "", disable: true }
                          ],
                form: {
                        id: 0,
                        isSingle: 0,
                        cf: "保存后自动关联",
                        cpjm: "保存后自动关联",
                        zdr: "",
                        rzdh: "",
                        cpfk: "保存后自动关联",
                        cpwm: "保存后自动关联",
                        zdrq: "",
                        cypl: [],
                        cpkz: "保存后自动关联",
                        szgg: "保存后自动关联",
                        jd: "",
                        rzsupplierId: "",
                        rzsupplierName: "",
                        rs: 0,
                        gy: {
                          cggy: [],
                          rzj: "",
                          qclgytj: "",
                          qclpzyq: "",
                          rsfs: [],
                          yhfs: [],
                          yrgytj: "",
                          yrpzyq: "",
                          hzgytj: "",
                          hzpzyq: ""
                        },
                        gyid: {
                          cggy: 0,
                          rzj: 0,
                          qclgytj: 0,
                          qclpzyq: 0,
                          rsfs: 0,
                          yhfs: 0,
                          yrgytj: 0,
                          yrpzyq: 0,
                          hzgytj: 0,
                          hzpzyq: 0
                        },
                        tbzysx: "",
                        jhwcsj: ""
                      },
                      // MainInfo
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
                  cggy: [],
                  rsfs: [],
                  yhfs: [],
                  alldesigners: [],
                  clothtype: [],
                  quarter:[]
        }
    },
    methods:{
        init: function () {
                    let _this = this;
                    Promise.all([
                        //获取子版单号的数据
                        _this.$axios.get(APIUTL,{
                            params:{
                                action: "getRzInfo",
                                id: _this.$route.query.id,
                                parentID: _this.$route.query.parentID
                            }
                        }),
                        
                        //获取源版单号的颜色和设计师信息
                    _this.$axios.get(APIUTL,{
                        params:{
                            action: "getInitInfo",
                            id: this.$route.query.parentID,
                            userssid: this.$route.query.userssid
                        }
                    }),
                    
                    //获取常规工艺 + 染色方式 + 印花方式

                    _this.$axios.get(APIUTL,{
                        params:{
                            action:"getRzInitData"
                        }
                    }),

                    //获取所有的衣服品类
                    _this.$axios.get(APIUTL,{
                        params:{
                            action:"getClothTypes"
                        }
                    }),

                    //获取所有季度
                    _this.$axios.get(APIUTL, {
                        params: {
                        action:"getDevNumList"
                        }
                    })

                    ]).then(function(response){
                        console.log(response);
                        //子版单号数据
                         _this.form = response[0].data.data;

                         //获取源版单号的颜色和设计师信息
                         _this.alldesigners = response[1].data.data[1];
                         _this.cloth = response[1].data.data[4][0];  //为了获取源版单号
                         console.log(_this.cloth)
                         console.log(_this.cloth.documentNum)
                         _this.colors = response[1].data.data[5];
                         _this.designers = response[1].data.data[6];
                         _this.info = response[1].data.data[7];

                         //获取常规工艺 + 染色方式 + 印花方式
                         _this.cggy = response[2].data.data[0]; //所有的常规工艺
                         _this.rsfs = response[2].data.data[1]; //所有的染色方式
                         _this.yhfs = response[2].data.data[2]; //所有的印花方式

                         //获取所有衣服品类
                         _this.clothtype = response[3].data.data;

                         //获取所有季度
                         _this.quarter = response[4].data.data;

                         _this.loading = false;
                    })
                    
                    // //获取子版单号的数据
                    // _this.$axios.get(APIUTL,{
                    //     params:{
                    //         action: "getRzInfo",
                    //         id: _this.$route.query.id,
                    //         parentID: _this.$route.query.parentID
                    //     }
                    // })
                    // .then((response)=>{
                    //     _this.form = response.data.data;
                    //     this.showit = true;
                    // })
                    
                    // //获取源版单号的颜色和设计师信息
                    // _this.$axios.get(APIUTL,{
                    //     params:{
                    //         action: "getInitInfo",
                    //         id: this.$route.query.parentID,
                    //         userssid: this.$route.query.userssid
                    //     }
                    // })
                    // .then((response)=>{
                    //     _this.alldesigners = response.data.data[1];
                    //   _this.cloth = response.data.data[4];  //为了获取源版单号
                    //   _this.colors = response.data.data[5];
                    //   _this.designers = response.data.data[6];
                    //   _this.info = response.data.data[7];
                    // })

                    // //获取常规工艺 + 染色方式 + 印花方式

                    // _this.$axios.get(APIUTL,{
                    //     params:{
                    //         action:"getRzInitData"
                    //     }
                    // })
                    // .then((response)=>{
                    //     _this.cggy = response.data.data[0]; //所有的常规工艺
                    //     _this.rsfs = response.data.data[1]; //所有的染色方式
                    //     _this.yhfs = response.data.data[2]; //所有的印花方式
                    // })

                    // //获取所有的衣服品类
                    // _this.$axios.get(APIUTL,{
                    //     params:{
                    //         action:"getClothTypes"
                    //     }
                    // })
                    // .then((response)=>{
                    //     _this.clothtype = response.data.data;
                    // })

                    // //获取所有季度
                    // _this.$axios.get(APIUTL, {
                    //     params: {
                    //     action:"getDevNumList"
                    //     }
                    // })
                    // .then(function(response) {
                    //     _this.quarter = response.data.data;
                    // })
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
                //处理常规工艺/染色方式/印花方式
                handledata: function(value,all){
                     // object.keys(all).filter(el=>value.find(el2=> el2 == el));
    
                     var a = all.filter(el =>{
                        return value.find(el2 => el2 == el.dm)
                     })
                     var str = '';
                     for(let el of a){
                        str += el.mc +", ";
                     }
                        return str;
                },
                //处理设计师dm显示为mc
                handldesigner: function(value,all){
                    var a = all.filter(el => {
                        return value == el.dm
                    })
                        return a.length ? a[0].mc : '';
                },
                //处理成衣品类
                handlecypl:function(value,all){
                    if(!value.length || !all.length) return;
                    let a = null;
                    function findObj(data,target){
                        // debugger
                        if(Array.isArray(data) && data.length){
                            for(var el of data){
                                if(el.children){
                                    findObj(el.children,target)
                                }
                                if(el.value == target){
                                 a = el;
                                }
                            }
                        }else{
                            if(data.children){
                                 findObj(data.children,target)
                            }
                            if(data.value == target){
                                a = data;
                            }
                        }
                    }
                    var result = findObj(all,value[2]);
                    return a ? a.label : '';

                    // 优化
                    // function findObj(data,target){
                    //     if(Array.isArray(data) && data.length){
                    //         for(var el of data){
                    //             return findObj(el,target);
                    //         }
                    //     }else {
                    //         if(data.value == target){
                    //             return data;
                    //         }else {
                    //             return findObj(data.children,target);
                    //         }
                    //     }
                    // }

                    // var result = findObj(all,value[2]);
                    // return result.label;
                    
                }
    },
    computed:{
                //计算设计师确认数量的总和
                count: function() {
                    let arr = [0,0,0,0,0];
                    var num=0;
                    for(var i=0;i<this.designers.length;i++){
                        for(var j=0;j<this.colors.length;j++){
                             num  += parseInt(arr[j])+parseInt(this.colors[j]["len"+(i+1)]);
                        }
                        arr[i]=num;
                    }
                    return arr;
                },
                // 返回总损耗
                getLossratio: function() {
                  return function() {
                    let sum = 0;
                    for (let i = 0; i < this.info.length; i++) {
                       sum += Number(this.info[i].loss);
                    }
                    for (let i = 0; i < this.colors.length; i++) {
                      this.colors[i].loss = sum;
                    }
                    return sum;
                  };
                },
                // 返回(投坯数量)损耗数量
                getDamagedLength: function() {
                  return function(row) {
                    row.damagedLength = (
                      (row.total / (100 - this.getLossratio()))*100).toFixed(2);
                    return row.damagedLength;
                  };
                }

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
        /* border: 1px solid #e6e6e6; */
        /* box-shadow: 0 0 40px rgba(0, 0, 0, 0.16); */
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
        height: 32px;
    }
</style>
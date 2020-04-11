<template>
    <div id="printZp" v-loading.fullscreen="loading">
        <table cellpadding="0" cellspacing="0" class="mytable" style="margin:auto">
            <thead>
                <tr><td colspan="32"><h2>{{cloth.documentNum}}针织坯布自主开发单</h2></td></tr>
            </thead>
            <tbody >
            	<tr>
                    <td colspan="3">季度</td><td colspan="5">{{form.jd | formatjd(quarter)}}</td>
                    <td colspan="3">坯布供应商</td><td colspan="5">{{form.pbsupplierName}}</td>
                    <td colspan="3">成品针数(WPI)</td><td colspan="5">{{form.wpi}}</td>
                    <td colspan="3">制单人</td><td colspan="5">{{form.zdr}}</td>
                </tr>
                <tr>
                    <td colspan="3">源版单号</td><td colspan="5"></td>
                    <td colspan="3">坯布编号</td><td colspan="5">{{form.pbbh}}</td>
                    <td colspan="3">成品针数(CPI)</td><td colspan="5">{{form.cpi}}</td>
                    <td colspan="3">制单日期</td><td colspan="5">{{form.zdrq}}</td>
                </tr>
                <tr>
                    <td colspan="3">成衣品类</td><td colspan="5">{{form.cypl=="[]"?'':form.cypl | handlecypl(clothtype)}}</td>
                    <td colspan="3">坯布成分</td><td colspan="5">{{form.pbcf}}</td>
                    <td colspan="3">成品幅宽(cm)</td><td colspan="5">{{form.fk}}</td>
                    <td colspan="3">价格范围</td><td colspan="5">{{form.jgfw}}</td>
                </tr>
                <tr>
                    <td colspan="3">组织结构</td><td colspan="5">{{form.zzjg}}</td>
                    <td colspan="3">坯布版单号</td><td colspan="5">{{form.pbbdh}}</td>
                    <td colspan="3">成品克重(g/m)</td><td colspan="5">{{form.kz}}</td>
                    <td colspan="3">合作类型</td><td colspan="5">{{form.hzlx}}</td>
                </tr>

                <tr><td colspan="32">一、布类信息</td></tr>

                <tr>
                	<td colspan="3" rowspan="4">织造要求</td>
                	<td colspan="3">织造损耗(%)</td><td colspan="4">{{form.zzsh}}</td>
                	<td colspan="4">纱比</td>
                	<td colspan="6">纱线要求</td>
                	<td colspan="6">织造要求</td>
                	<td colspan="6">特别注意事项</td>
                </tr>
                <tr>
                	<td colspan="3">单线圈长度(cm/100G)</td><td colspan="4">{{form.yq.dxqcd}}</td>
                	<td colspan="4" rowspan="3">{{form.sb | formatsb}}</td>
                	<td colspan="6" rowspan="3">{{form.sxyq}}</td>
                	<td colspan="6" rowspan="3">{{form.zzyq}}</td>
                	<td colspan="6" rowspan="3">{{form.tbzysx}}</td>
                </tr>
                <tr>
                	<td colspan="3">针数/机号(G/英寸)</td><td colspan="4">{{form.yq.zsjh}}</td>
                </tr>
                 <tr>
                	<td colspan="3">寸数/筒径(英寸)</td><td colspan="4">{{form.yq.cstj}}</td>
                </tr>

                <tr><td colspan="32">二、开发面料信息</td></tr>

                <tr>
                	<td colspan="10" rowspan="10"><span>贴样处</span></td>
                	<td colspan="2" rowspan="2">色号</td>
                	<td colspan="4" rowspan="2">颜色样</td>
                	<td colspan="6">设计师确认数量</td>
                	<td colspan="3" rowspan="2">检测样(米)</td>
                	<td colspan="3" rowspan="2">成品合计(米)</td>
                	<td colspan="2" rowspan="2">损耗(%)</td>
                	<td colspan="2" rowspan="2">投坯数量(米)</td>
                </tr>
                <tr>
                	<td colspan="2">{{designers[0].xmsx_1 == -1 ?'':designers[0].xmsx_1 | handldesigner(alldesigners)}}</td>
                	<td colspan="2">{{designers[0].xmsx_2 == -1 ?'':designers[0].xmsx_2 | handldesigner(alldesigners)}}</td>
                	<td colspan="2">{{designers[0].xmsx_3 == -1 ?'':designers[0].xmsx_3 | handldesigner(alldesigners)}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[0]?colors[0].color:''}}</td>
                	<td colspan="4">{{colors[0]?colors[0].sticker: ''}}</td>
                	<td colspan="2">{{colors[0]?colors[0].len1: ''}}</td>
                	<td colspan="2">{{colors[0]?colors[0].len2: ''}}</td>
                	<td colspan="2">{{colors[0]?colors[0].len3: ''}}</td>
                	<td colspan="3">{{colors[0]?colors[0].number: ''}}</td>
                	<td colspan="3">{{colors[0]?colors[0].total: ''}}</td>
                	<td colspan="2">{{getLossratio()}}</td>
                	<td colspan="2">{{colors[0]?getDamagedLength(colors[0]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[1]?colors[1].color:''}}</td>
                	<td colspan="4">{{colors[1]?colors[1].sticker: ''}}</td>
                	<td colspan="2">{{colors[1]?colors[1].len1: ''}}</td>
                	<td colspan="2">{{colors[1]?colors[1].len2: ''}}</td>
                	<td colspan="2">{{colors[1]?colors[1].len3: ''}}</td>
                	<td colspan="3">{{colors[1]?colors[1].number: ''}}</td>
                	<td colspan="3">{{colors[1]?colors[1].total: ''}}</td>
                	<td colspan="2">{{colors[1]?colors[1].loss: ''}}</td>
                	<td colspan="2">{{colors[1]?getDamagedLength(colors[1]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[2]?colors[2].color:''}}</td>
                	<td colspan="4">{{colors[2]?colors[2].sticker: ''}}</td>
                	<td colspan="2">{{colors[2]?colors[2].len1: ''}}</td>
                	<td colspan="2">{{colors[2]?colors[2].len2: ''}}</td>
                	<td colspan="2">{{colors[2]?colors[2].len3: ''}}</td>
                	<td colspan="3">{{colors[2]?colors[2].number: ''}}</td>
                	<td colspan="3">{{colors[2]?colors[2].total: ''}}</td>
                	<td colspan="2">{{colors[2]?colors[2].loss: ''}}</td>
                	<td colspan="2">{{colors[2]?getDamagedLength(colors[2]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[3]?colors[3].color:''}}</td>
                	<td colspan="4">{{colors[3]?colors[3].sticker: ''}}</td>
                	<td colspan="2">{{colors[3]?colors[3].len1: ''}}</td>
                	<td colspan="2">{{colors[3]?colors[3].len2: ''}}</td>
                	<td colspan="2">{{colors[3]?colors[3].len3: ''}}</td>
                	<td colspan="3">{{colors[3]?colors[3].number: ''}}</td>
                	<td colspan="3">{{colors[3]?colors[3].total: ''}}</td>
                	<td colspan="2">{{colors[3]?colors[3].loss: ''}}</td>
                	<td colspan="2">{{colors[3]?getDamagedLength(colors[3]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[4]?colors[4].color:''}}</td>
                	<td colspan="4">{{colors[4]?colors[4].sticker: ''}}</td>
                	<td colspan="2">{{colors[4]?colors[4].len1: ''}}</td>
                	<td colspan="2">{{colors[4]?colors[4].len2: ''}}</td>
                	<td colspan="2">{{colors[4]?colors[4].len3: ''}}</td>
                	<td colspan="3">{{colors[4]?colors[4].number: ''}}</td>
                	<td colspan="3">{{colors[4]?colors[4].total: ''}}</td>
                	<td colspan="2">{{colors[4]?colors[4].loss: ''}}</td>
                	<td colspan="2">{{colors[4]?getDamagedLength(colors[4]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[5]?colors[5].color:''}}</td>
                	<td colspan="4">{{colors[5]?colors[5].sticker: ''}}</td>
                	<td colspan="2">{{colors[5]?colors[5].len1: ''}}</td>
                	<td colspan="2">{{colors[5]?colors[5].len2: ''}}</td>
                	<td colspan="2">{{colors[5]?colors[5].len3: ''}}</td>
                	<td colspan="3">{{colors[5]?colors[5].number: ''}}</td>
                	<td colspan="3">{{colors[5]?colors[5].total: ''}}</td>
                	<td colspan="2">{{colors[5]?colors[5].loss: ''}}</td>
                	<td colspan="2">{{colors[5]?getDamagedLength(colors[5]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[6]?colors[6].color:''}}</td>
                	<td colspan="4">{{colors[6]?colors[6].sticker: ''}}</td>
                	<td colspan="2">{{colors[6]?colors[6].len1: ''}}</td>
                	<td colspan="2">{{colors[6]?colors[6].len2: ''}}</td>
                	<td colspan="2">{{colors[6]?colors[6].len3: ''}}</td>
                	<td colspan="3">{{colors[6]?colors[6].number: ''}}</td>
                	<td colspan="3">{{colors[6]?colors[6].total: ''}}</td>
                	<td colspan="2">{{colors[6]?colors[6].loss: ''}}</td>
                	<td colspan="2">{{colors[6]?getDamagedLength(colors[6]):''}}</td>
                </tr>
                <tr>
                	<td colspan="2">{{colors[7]?colors[7].color:''}}</td>
                	<td colspan="4">{{colors[7]?colors[7].sticker: ''}}</td>
                	<td colspan="2">{{colors[7]?colors[7].len1: ''}}</td>
                	<td colspan="2">{{colors[7]?colors[7].len2: ''}}</td>
                	<td colspan="2">{{colors[7]?colors[7].len3: ''}}</td>
                	<td colspan="3">{{colors[7]?colors[7].number: ''}}</td>
                	<td colspan="3">{{colors[7]?colors[7].total: ''}}</td>
                	<td colspan="2">{{colors[7]?colors[7].loss: ''}}</td>
                	<td colspan="2">{{colors[7]?getDamagedLength(colors[7]):''}}</td>
                </tr>
                <tr>
                    <td colspan="4">二、供应商确认：</td>
                    <td colspan="7"></td>
                    <td colspan="4">技术完成时间</td>
                    <td colspan="7">{{form.jhwcsj}}</td>
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
//import func from '../../vue-temp/vue-editor-bridge';
export default {
    name:"printZp",
    data() {
        return {
            loading :true,
            	//针坯基本数据
            	form: {
                        id: 0,
				        isSingle: 0,
				        djh: "",
				        jd: 0, 
				        //this.devNumTemp,
				        cypl: [],
				        wpi: "",
				        zdr: "", 
				        //this.mainData.creator,
				        pbsupplierId: "",
				        pbsupplierName: "",
				        cpi: "",
				        zdrq: "",
				        //this.getDate(),
				        pbcf: "",
				        fk: "",
				        zzjg: "",
				        pbbdh: "保存后自动生成",
				        pbbh: "",
				        kz: "",
				        jgfw: "",
				        zzsh: "",
				        yq: {
				          dxqcd: "",
				          zsjh: "",
				          cstj: ""
				        },
				        yqid: {
				          dxqcdid: 0,
				          zsjhid: 0,
				          cstjid: 0
				        },
				        sb: [],
				        sxyq: "",
				        zzyq: "",
				        tbzysx: "",
				        jhwcsj: "",
				        hzlx: ""
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
		      designers: [
                        { xmsx_1: "", disable: true },
                        { xmsx_2: "", disable: true },
                        { xmsx_3: "", disable: true },
                        { xmsx_4: "", disable: true },
                        { xmsx_5: "", disable: true },
                        { xmsx_6: "", disable: true }
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
              alldesigners: [],
              clothtype: [],
              quarter: []
        }
    },
    methods:{
        init: function(){
            let _this=this;
            Promise.all([
                //获取子版单号针坯的数据
                    _this.$axios.get(APIUTL,{
                        params:{
                             action: "getZpInfo",
                            id: _this.$route.query.id,
                            parentID: _this.$route.query.parentID
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
                //获取所有的衣服品类(成衣品类筛选)
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
            ])
            .then((response)=>{
                _this.form = response[0].data.data;

                _this.alldesigners = response[1].data.data[1]; //
                _this.cloth = response[1].data.data[4][0];  //为了获取源版单号
                _this.colors = response[1].data.data[5];
                _this.designers = response[1].data.data[6];
                _this.info = response[1].data.data[7];

                _this.clothtype = response[2].data.data;

                _this.quarter = response[3].data.data;

                _this.loading=false;
            })
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
                //处理纱比
                formatsb:function(value){
                	var data="";
                	for(let el of value){
                		data += el.bdh + "-" + el.yt +",";
                	}
                	return data;
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
                    if(!value.length) return ;
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
//                     function findObj(data,target){
//                         if(Array.isArray(data) && data.length){
//                             for(var el of data){
//                                 return findObj(el,target);
//                             }
//                         }else {
//                             if(data.value == target){
//                                 return data;
//                             }else {
//                                 return findObj(data.children,target);
//                             }
//                         }
//                     }
//                     var result = findObj(all,1485);  递归出问题
//                     return result.label;
                    
                }
    },
    computed:{
        // 返回总损耗
                getLossratio: function() {
                  return function() {
                    let sum = 0;
			        for (let i = 0; i < this.info.length; i++) {
			          if (this.info[i].ProcessType != 20) sum += Number(this.info[i].loss);
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
        height: 26px;
    }
</style>
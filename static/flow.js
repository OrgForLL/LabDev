/*
*日期:20150720
*相关人:张茂洪
*内容:创建 XMLHttpRequest 对象,兼容ipad
 * 
*日期:20160229
*相关人:许跃华
*内容: 弃审 增加flowCancelCheck函数
 *
*日期:20180725
*相关人:薛灵敏
*内容: 将ppdm的判断由限定判断改为非空判断
*--------------------------
*审批工作流通用脚本-单据
*说明:
*1.该脚本为嵌入通用报表的流程脚本
*2.通用报表要配置：主表名，主键，流程ID 并把按钮置于外层
*3.需在发起审批前执行另外检查操作的，统一写在flowSaveCheck函数中，若需个性化定义提示信息，直接返回提示内容字符串。
*/
/*20171211 增加知会办理 flowflag=4*/

// getInitData();
// let MyForm = getMyForm();//.getElementsByTagName('input');
// console.log(MyForm)
// console.log(new flowSession())

//创建流程[流程开始-申报]
function flow_createFlow() {
    if (typeof (flowSession) != 'function') { alert("未定义flowSession的js函数！"); return; }
    var session = new flowSession();
    var flowdxlx = "";
    if (MyForm.flowdxlx != null) flowdxlx = MyForm.flowdxlx.value;
    var flow_dxid = MyForm.flowdxid.value;
    var flow_pldxid = "";
    if (flow_dxid.indexOf(",") > -1) {
        flow_pldxid = flow_dxid; //批量对象id
        flow_dxid = flow_dxid.split(",")[0].toString();
    }
    var resultDocID = 0;
    var mybbkhid = '';
	if (top.window.frames["bbShow"].MyForm["MyBB_khid"]) {
		mybbkhid=top.window.frames["bbShow"].MyForm["MyBB_khid"].value;
	}
    //判断是否强制从总部数据库发起
    if (!top.window.frames["bbShow"].MyForm["_IsStartFromMain"]) {
        MySQL = "EXEC flow_up_start " + session.tzid + "," + session.dxtzid + "," + flow_dxid + " ,'" + flowdxlx + "' ," +
			MyForm.flowid.value + " ," + session.userid + " ,'" + session.username + "','" + flow_pldxid + "';";
        //MySQL += "EXEC flow_up_getLastNode " + MyForm.flowdocid.value;	
        MySQL = "SET XACT_ABORT ON ;" + MySQL + ";SET XACT_ABORT OFF ;";
        resultDocID = bbShow.openAjax(MySQL, 'bbupdateID', MyForm.MyBBbid.value, '',mybbkhid);		
    }
    else {
        var xmlhttp;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        var myurl = "../flow/flowStart.ashx?tzid=" + session.tzid + "&dxtzid=" + session.dxtzid + "&flowdxid=" +
			MyForm.flowdxid.value + "&flowdxlx=" + flowdxlx + " &flowid=" + MyForm.flowid.value + " &userid=" + session.userid +
			" &username=" + session.username + "&pldxid=" + flow_pldxid + "&_rand=" + Math.random();
        xmlhttp.open('GET', myurl, false);
        xmlhttp.send();
        resultDocID = xmlhttp.responseText;
    }
    return resultDocID;
}

//办理
function flow_send() {
    if (!flow_checkCtrl()) return false;
    var flow_docID = MyForm.flowdocid.value;
    var flow_dxid = MyForm.flowdxid.value;
    //判断是否发起流程
    if ((flow_docID == "" || flow_docID == "0") && flow_dxid != "" && flow_dxid != "0") {
        var flow_docID = flow_createFlow();
        if (flow_docID == "-1" || flow_docID == "-2") {
            if (flow_docID == "-1") { alert("未配置正确的流程的开始节点！"); } else { alert("未能正确发起流程！"); }
            return;
        } else {
            MyForm.flowdocid.value = flow_docID;
        }
    }

    if (flow_docID == "" && flow_docID == "0") { alert("未能创建正确审批流程！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }

    try {
        if (typeof (bbShow.flowSaveCheck) == 'function') {
            var fsc = bbShow.flowSaveCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var url = "../flow/flow_dialog_nodeok.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    //知会办理
    if (MyForm.flowflag.value == 4) {
        url = "../flow/flow_dialog_notify.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    }
    //By: xlm 20180725 将ppdm限定改为非空判定，以便兼容wechat，以下总共8文件全部替换
    //if (bbShow.MyForm.ppdm != undefined && (bbShow.MyForm.ppdm.value == "jtcw" || bbShow.MyForm.ppdm.value == "zpp" || bbShow.MyForm.ppdm.value.split('|')[0] == "kh")) {
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }
    var rtnVal = showMal(url, "sendDialog", 650, 700);
    //    var rtnVal=window.open( url,'' ,'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=no,width=650,height=700,top=0,left=0' );    
    //    var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 700px; dialogWidth: 650px; help: No; status: No;");
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isCloseWindow != undefined && bbShow.MyForm.flow_isCloseWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
    // top.parent.window.close();
}

//转办
function flow_cghsend() {
    if (!flow_checkCtrl()) return false;
    var flow_docID = MyForm.flowdocid.value;
    var flow_dxid = MyForm.flowdxid.value;
    //判断是否发起流程
    if ((flow_docID == "" || flow_docID == "0") && flow_dxid != "" && flow_dxid != "0") {
        if (flow_docID == "-1" || flow_docID == "-2") {
            if (flow_docID == "-1") { alert("未配置正确的流程的开始节点！"); } else { alert("未能正确发起流程！"); }
            return;
        } else {
            MyForm.flowdocid.value = flow_docID;
        }
    }

    if (flow_docID == "" && flow_docID == "0") { alert("未能创建正确审批流程！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }

    try {
        if (typeof (bbShow.flowSaveCheck) == 'function') {
            var fsc = bbShow.flowSaveCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var url = "../flow/flow_dialog_nodeCghok.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 700px; dialogWidth: 650px; help: No; status: No;");
    var rtnVal = showMal(url, "sendDialog", 650, 700);
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isCloseWindow != undefined && bbShow.MyForm.flow_isCloseWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
    //top.parent.window.close();
}
//退办
function flow_return() {
    if (!flow_checkCtrl()) return false;

    try {
        if (typeof (bbShow.flowReturnCheck) == 'function') {
            var fsc = bbShow.flowReturnCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var flow_docID = MyForm.flowdocid.value;
    if (flow_docID == "" || flow_docID == "0") { alert("未能正确获取流程文档！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }
    var url = "../flow/flow_dialog_nodereturn.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }
    var rtnVal = showMal(url, "sendDialog", 650, 700);
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 600px; dialogWidth: 650px; help: No; status: No;");
    /*if (rtnVal != null) {
        if (top.bbShow.MyForm.flow_isCloseWindow != undefined && top.bbShow.MyForm.flow_isCloseWindow != null) {
            window.returnValue = "OK";
            parent.window.close();
            return;
        }
        top.parent.window.close();
        top.mytopwait.style.visiblity = "visible";
        top.MyForm.submit();
    }*/
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isCloseWindow != undefined && bbShow.MyForm.flow_isCloseWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
}

//撤办
function flow_drawn() {
    if (!flow_checkCtrl()) return false;

    try {
        if (typeof (bbShow.flowDrawnCheck) == 'function') {
            var fsc = bbShow.flowDrawnCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var flow_docID = MyForm.flowdocid.value;
    if (flow_docID == "" || flow_docID == "0") { alert("未能正确获取流程文档！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }
    var url = "../flow/flow_dialog_nodedrawn.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }

    var rtnVal = showMal(url, "sendDialog", 650, 700);
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 600px; dialogWidth: 650px; help: No; status: No;");
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isCloseWindow != undefined && bbShow.MyForm.flow_isCloseWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
}

//终审(归档)[流程结束]
function flow_end() {
    if (!flow_checkCtrl()) return false;
    var flow_docID = MyForm.flowdocid.value;
    if (flow_docID == "" || flow_docID == "0") { alert("未能正确获取流程文档！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }

    try {
        if (typeof (bbShow.flowEndCheck) == 'function') {
            var fsc = bbShow.flowEndCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var url = "../flow/flow_dialog_archive.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }
    if (bbShow.MyForm.MyBB_khid != undefined && bbShow.MyForm.MyBB_khid.value != "") {
        url += "&MyBB_khid=" + bbShow.MyForm.MyBB_khid.value; 
    }
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 500px; dialogWidth: 650px; help: No; status: No;");
    var rtnVal = showMal(url, "sendDialog", 650, 700);
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isCloseWindow != undefined && bbShow.MyForm.flow_isCloseWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
}

//弃审(取消归档)
function flow_cancel() { // alert(1);
    if (!flow_checkCtrl()) return false;
    //alert(2);
    var flow_docID = MyForm.flowdocid.value;
    if (flow_docID == "" || flow_docID == "0") { alert("未能正确获取流程文档！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }

    try {
        if (typeof (bbShow.flowCancelCheck) == 'function') {
            var fsc = bbShow.flowCancelCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }
    var url = "../flow/flow_dialog_cancel.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid.value + "&MySession=" + MyForm.MySession.value;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm.value != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm.value; //兼容各品牌间跨套账的审核
    }
    if (bbShow.MyForm.MyBB_khid != undefined && bbShow.MyForm.MyBB_khid.value != "") {
        url += "&MyBB_khid=" + bbShow.MyForm.MyBB_khid.value; 
    }
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 500px; dialogWidth: 650px; help: No; status: No;");
    var rtnVal = showMal(url, "sendDialog", 650, 500);
    if (rtnVal != null) {
        top.parent.window.close();
        top.mytopwait.style.visiblity = "visible";
        top.MyForm.submit();
    }
}

//取消申报(清除流程数据)
function flow_clear(MyForm) {
    if (!flow_checkCtrl()) return false;

    try {
        if (typeof (bbShow.flowClearCheck) == 'function') {
            var fsc = bbShow.flowClearCheck();
            if (typeof (fsc) == 'boolean' && fsc == false) {
                alert("办理条件不满足!!");
                return false;
            } else if (typeof (fsc) == 'string') {
                alert(fsc);
                return false;
            }
        }
    } catch (e) {
        alert(e);
        return false;
    }

    var flow_docID = MyForm.flowdocid;
    if (flow_docID == "" || flow_docID == "0") { alert("未能正确获取流程文档！"); return; }
    var flow_pldocid = "";
    if (flow_docID.indexOf(",") > -1) {
        flow_pldocid = flow_docID;
        flow_docID = flow_docID.split(",")[0].toString();
    }
    var url = "../flow/flow_dialog_clear.aspx?docid=" + flow_docID + "&pldocid=" + flow_pldocid + "&menuid=" + MyForm.TLsoft_menuid + "&MySession=" + MyForm.MySession;
    if (bbShow.MyForm.ppdm != undefined && bbShow.MyForm.ppdm != "") {
        url += "&ppdm=" + bbShow.MyForm.ppdm; //兼容各品牌间跨套账的审核
    }
    //var rtnVal = window.showModalDialog(url, "sendDialog", "dialogHeight: 450px; dialogWidth: 600px; help: No; status: No;");
    var rtnVal = showMal(url, "sendDialog", 600, 450);
    if (rtnVal != null) {
        if (bbShow.MyForm.flow_isRefreshWindow != undefined && bbShow.MyForm.flow_isRefreshWindow != null) {
            parent.window.MyForm.submit();
        } else {
            window.returnValue = "OK";
            parent.window.close();
        }
    }
    //top.parent.window.close();
}

//检查流程控件
function flow_checkCtrl(MyForm, flowSession) {
    if (MyForm.flowdocid == undefined) { alert("未定义flowdocid控件"); return false; }
    if (MyForm.flowdxid == undefined) { alert("未定义flowdxid控件"); return false; }
    if (MyForm.flowuserid == undefined) { alert("未定义flowuserid控件"); return false; }
    // if (typeof (flowSession) != 'function') { alert("未定义flowSession的js函数！"); return false; }
    if (flowSession) { alert("未定义flowSession数据！"); return false; }
    return true;
}

function flow_setButton(ctrlName, styleDisp) {
    if (document.getElementById("mytd_button_" + ctrlName) != null) {
        document.getElementById("mytd_button_" + ctrlName).style.display = styleDisp;
    }
}

//按钮控制 2011-04-13 增加取消申报功能
function flow_ButtonQx(MyForm, flow_Session) {
    var flowDxid = MyForm.flowdxid.toString().replace(/ /g, "");
    var flowDocid = MyForm.flowDocid.toString().replace(/ /g, "");
    flow_setButton("办理", "block"); flow_setButton("转办", "block"); flow_setButton("退办", "block"); flow_setButton("撤办", "block"); flow_setButton("终审", "block"); flow_setButton("弃审", "block"); flow_setButton("取消申报", "block");
    if (flowDxid.replace(/0/g,'') == '') {//单据未保存 flowDxid == "" || flowDxid == "0"
        flow_setButton("办理", "none"); flow_setButton("转办", "none"); flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
    } else if (MyForm.flowflag == "4") {//知会
        flow_setButton("保存", "none"); flow_setButton("删除", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("退办", "none"); flow_setButton("取消申报", "none");
    } else {

        if (flowDocid == "" || flowDocid == "0") {//流程未发起
            flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
			contrlZdr(flow_Session);//contrlCreateFlow();//控制非制单人办理按钮隐藏(zhb 2019-03-21)
        } else {//流程已发起
            //判断权限
            if (typeof (flowSession) != "function") {
                flow_setButton("办理完毕", "none"); flow_setButton("转办", "none"); flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
                alert("程序未定义flowSession的方法,未能获取正确的参数！"); return;
            }
            // var flow_Session = new flowSession();

            switch (MyForm.flowflag) {
                case "0": //流程第一步
                    flow_setButton("退办", "none"); flow_setButton("删除", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "block"); flow_setButton("撤办", "none");
                    break;
                case "1": //已归档
                    flow_setButton("保存", "none"); flow_setButton("删除", "none"); flow_setButton("办理", "none"); flow_setButton("转办", "none"); flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
                    break;
                case "2": //流程最后一步
                    flow_setButton("保存", "none"); flow_setButton("删除", "none"); flow_setButton("办理", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); //flow_setButton("转办", "none");
                    break;
                case "3": //流转中
                    flow_setButton("保存", "none"); flow_setButton("删除", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none");
                    break;
            };
            var flow_currentUser = MyForm.flowuserid;
            if (flow_currentUser.indexOf(",") > -1) {
                if (("," + flow_currentUser + ",").indexOf("," + flow_Session.userid + ",") <= -1) {
                    flow_setButton("办理", "none"); flow_setButton("转办", "none"); flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
                }
            } else {
                if (flow_currentUser != flow_Session.userid) {
                    if (flow_Session.userid == "15071") {
                        alert("a");
                    }
                    flow_setButton("办理", "none"); flow_setButton("转办", "none"); flow_setButton("退办", "none"); flow_setButton("终审", "none"); flow_setButton("弃审", "none"); flow_setButton("取消申报", "none"); flow_setButton("撤办", "none");
                }
                /*增加判断当前用户是否是上一流程的办理人，用于撤办按钮的控制  20140730 ke 取消这段会报错*/
                var xmlhttp;
                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                }
                else {// code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }

                //var xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                var myurl = "../flow/getlastnode.ashx?flowdocid=" + flowDocid + "&_rand=" + Math.random();
                xmlhttp.open('GET', myurl, false);
                xmlhttp.send();
                resultDocID = xmlhttp.responseText;
                if (resultDocID == flow_Session.userid) {
                    flow_setButton("撤办", "block");
                    //alert(1)
                }
            }
        }
    }
}

function showMal(url, wname, width, height) {
    var rtnVal;
    if (IsPC() == false) {
        rtnVal = window.open(url, wname, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,fullscreen=no,width=' + width + ',height=' + height + ',top=0,left=0');
        //该方法目前先把单据界面关闭，避免流程有问题！
    } else {
        rtnVal = window.showModalDialog(url, wname, 'dialogHeight: ' + height + 'px; dialogWidth: ' + width + 'px; help: No; status: No;');
    }
    return rtnVal;
}

function userAgentHav(cs) {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(cs) >= 0) {
        return true;
    }
    return false;
}

function IsPC() {
    var Agents = ["android", "iphone", "symbianos", "windows phone", "ipad", "ipod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentHav(Agents[v])) {
            flag = false;
            break;
        }
    }
    return flag;
}

// function  contrlCreateFlow(iframe){//控制流程发起人必须是制单人
//     try{
// 		// var iframe = document.getElementById("bbShow");    
// 		if (iframe.attachEvent) {    //IE下--iframe加载完成后你需要进行的操作
// 			iframe.attachEvent("onload", function() {contrlZdr();});    
// 		} else {//非IE
// 			iframe.onload = function() {contrlZdr();};    
// 		}
//     }catch(e){}		
// }

function  contrlZdr(flow_Session){//控制非制单人办理按钮隐藏
	try{
		// var flow_Session = new flowSession();
        var zdr = flow_Session.username;
		if(document.getElementById('zdr') !=null){
			zdr = document.getElementById('zdr').value
		}else if(document.getElementById('mytext_0_zdr') != null){
			zdr = document.getElementById('mytext_0_zdr').value;
        }
		if(zdr != flow_Session.username)  flow_setButton("办理", "none");
    }catch(e){}
}

// flow_ButtonQx();

export{
    flow_createFlow,
    flow_send,
    flow_cghsend,
    flow_return,
    flow_drawn,
    flow_end,
    flow_cancel,
    flow_clear,
    flow_checkCtrl,
    flow_setButton,
    flow_ButtonQx,
    showMal,
    userAgentHav,
    IsPC,
    // contrlCreateFlow,
    contrlZdr
}
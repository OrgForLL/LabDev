import axios from 'axios';
const http = axios.create({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  
  const httpPost = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
  http.interceptors.request.use(config => {
    if (config.method === 'get') {
      //  给data赋值以绕过if判断
      config.data = true 
    }
  
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    return config
  })
  
  httpPost.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json'
    return config
  })
export function fieldPickerSingle(type, inExtObj, next) {
    var params = {}
    params.action = type
    if (inExtObj) {
        for (var i in inExtObj) {
            params[i] = inExtObj[i]
        }
    }

    if (params.action == "") {
        console.log("type is empty")
        next({ 'errcode': 20210628, 'data': error, 'errmsg': 'type is empty' })
        return false
    }
    http.get(APIUTL, { params: params, }).then((response) => {
        if (response.data.errcode != 0) {
            console.log("errcode>0")
            next(response.data.errcode);
            return false;
        }
        var data = [];
        if (
            type == "getDesignStyleList" ||
            type == "getMaterialApplyTypes" ||
            type == "getMaterialApplyDjlb" ||
            type == "getMaterialApplyBm"
        )
            data = response.data.data[0];
        else if (type == "getDevNumList") data = response.data.data;
        else if (type == "getMaterialApplyXmjl") {
            //项目经理
            for (var i = 0; i < response.data.data[0].length; i++) {
                data.push({
                    dm: response.data.data[0][i].ryid,
                    mc: response.data.data[0][i].xm,
                    fgid: response.data.data[0][i].fgid,
                });
            }
        } else if (type == "getClothTypes") {
            for (var i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].value == 1201) {
                    //利郎运动系列 不要
                } else {
                    for (var j = 0; j < response.data.data[i].children.length; j++) {
                        //jb2
                        var jb3 = response.data.data[i].children[j].children;
                        for (var z = 0; z < jb3.length; z++) {
                            //加空格转成字符串
                            data.push({ dm: jb3[z].value, mc: jb3[z].label });
                        }
                    }
                }
            }
        }
        let options=[]
        //数据默认格式dm ,mc
        for (var i = 0; i < data.length; i++) {
            options.push(data[i]);
        }
        next({ 'errcode': 0, 'data': options, 'errmsg': '' })
    }).catch((error) => {        
        next({ 'errcode': 20210628, 'data': error, 'errmsg': '发送请求失败' })
    });
}

export function goflow(id,tableName,next){
    let params={};
    params.serviceName='svr-external'
    params.action='getFlowConfig'
    params.id=id
    params.tableName=tableName
    http.get(APIUTL, { params: params, }).then((response) => {
        if (response.data.errcode != 0) {
            console.log("errcode>0")
            next(response.data.errcode);
            return false;
        }        
        next({ 'errcode': 0, 'data': response.data.data, 'errmsg': '' })
    }).catch((error) => {        
        next({ 'errcode': 20210628, 'data': error, 'errmsg': '发送请求失败' })
    });
}
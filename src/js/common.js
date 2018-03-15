/**
 * taskQueue : 任务队列
 * throttle  : 节流函数
 * deepClone : 深度复制
 * addPrimaryAndCk : 添加临时主键以及Ck属性
 * cookie : 操作cookie,包含get，set，remove
 * equalsObject : 比较2对象相等
 * */
var CommonUtil = {
    /**
     * js中的任务队列
     * @params: data:Array
     * @params: process:function
     * @params: completedCallback : function 执行完毕的回调
     * @params: context(可选): 执行环境,如果没有，则为window
     * return undefined
     * demo:
     * var data = [{name:1},{name:2},{name:3},{name:4},{name:5},{name:6},{name:7}];
     * function print(item){console.log(item.name);}
     * taskQueue(data,print,2000);
     * **/
    taskQueue:function(array,process,completedCallback,context){
        setTimeout(function(){
            if(completedCallback && typeof completedCallback == "function"){
                if(array.length == 0){
                    completedCallback({data:"all tasks completed!"});
                    return;
                }
            }
            var item = array.shift();
            process.call(context,item);
            if(array.length >0){
                setTimeout(arguments.callee,100);
            }
        },100)
    },
    /**
     * 节流函数:
     * 如果在段时间内一直操作DOM,可能会导致浏览器内存问题，甚至崩溃，所以在一段时间内，我们让该持续性的操作间隔的执行
     * @params: method：function 需要执行的函数
     * @params: context(可选)：执行环境，如果没有，则为window
     * return undefined
     * demo:
     * function resizeDiv(){
         *      var div = document.querySelector("#div1");
         *      div.style.height = div.offsetWidth + "px";
         * }
     * throttle(resizeDiv);
     * **/
    throttle:function(method,context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function () {
            method.call(context);
        }, 80)
    },
    /**
     * 深度复制,不支持数据源json对象中含有function
     * @params: source:Object
     * return: new Object
     * */
    deepClone:function(source){
        if(source){
            return JSON.parse(JSON.stringify(source));
        }
        return null;
    },
    /**
     * 为数据源添加ck属性以及临时主键__tmpId
     * @params: data:Array
     * @params: ck:bool,可选
     * return: Array
     * */
    addPrimaryAndCk:function(data){
        data.map(function(item){
            item.ck = false;
            item.__tmpId = Math.ceil(Math.random()*10000000000000000);
        });
        return data;
    },
    /**
     * 操作cookie
     * @get: name:key, return String
     * @set: name,value,expires (到期时间)
     * @remove 移除
     */
    cookie:{
        get:function(name){
            var cookie = document.cookie;
            var cookieName = encodeURIComponent(name) + "=",
                cookieStart = cookie.indexOf(cookieName),
                cookieValue = null;
            if(cookieStart > -1){
                var cookieEnd = cookie.indexOf(';',cookieStart);
                if(cookieEnd == -1){
                    cookieEnd = cookie.length;
                }
                cookieValue = decodeURIComponent(cookie.substring(cookieStart + cookieName.length,cookieEnd));
            }
            return cookieValue;
        },
        set:function(name,value,expires){
            var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
            if(expires instanceof Date){
                cookieText += "; expires=" + expires.toGMTString();
            }
            document.cookie = cookieText+";path=/;domain="+document.domain;
        },
        remove:function(name){
            this.set(name,"",new Date(0));
        }
    },
    /**
     * 比较2个对象是否相等
     * @params: source:Object
     * @params: target:Object
     * return: bool
     * **/
    equalsObject:function(source,target){
        var p;
        for (p in source) {
            if (typeof (target[p]) == 'undefined') {
                return false;
            }
        }
        for (p in source) {
            if (source[p]) {
                switch (typeof (source[p])) {
                    case 'object':
                        if (!equals(source[p], target[p])) {
                            return false;
                        }
                        break;
                    case 'function':
                        if (typeof (target[p]) == 'undefined' ||
                            (p != 'equals' && source[p].toString() != target[p].toString()))
                            return false;
                        break;
                    default:
                        if (source[p] != target[p]) {
                            return false;
                        }
                }
            } else {
                if (target[p])
                    return false;
            }
        }
        for (p in target) {
            if (typeof (source[p]) == 'undefined') {
                return false;
            }
        }
        return true;
    },
    /**
     * 公用抛出异常错误方法
     * @params：str
     * 错误日志统一入口
     * */
    throwError:function(str){
        console.log(str);
        //throw new Error(str);
    },
    /**
     * 获取数据源中得指定字段
     * @params：data, 数据源
     * @params: field, json对象中的字段
     * @params: filterCk, 是否需要判断ck属性为true
     * return Array, array:所选中得items，field所选中得field集合
     * */
    getSelectedItemsByField:function(data,field,filterCk){
        var res = {array:[],field:[]};
        if(data instanceof Array == false){
            return res;
        }
        if(filterCk){
            data.map(function(item){
                if(item["ck"] && item[field]){
                    res.field.push(item[field]);
                    res.array.push(item);
                }
            })
        }else{
            data.map(function(item){
                if(item[field]){
                    res.field.push(item[field]);
                    res.array.push(item);
                }
            })
        }
        return res;
    },
    ///**
    // * 延迟处理某个方法
    // * @params：fn function
    // * @time: 可选, 默认值为300
    // * */
    //delayTodo:function(fn,time){
    //    if(!time || time <= 1000){
    //        time = 1000;
    //    }
    //    $timeout(function(){ fn(); },time);
    //}
    getQueryString:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return "";
    },
    cutString:function (str, num) {
        if (!str) {
            return "";
        }
        if(str.length <= num){
            return str;
        }
        return str.substring(0, num) + "...";
    }
}

//上拉加载更多
var DropCtl = function () {
    this.page = 1;
    this.size = 10;
    this.MUINeedLoad = false;

    this.url = "";
    this.render = null;
    this.analysis = null;

    this.init = function (option) {
        this.containerId = option.containerId
        this.url = option.url;
        this.render = option.render;
        this.analysis = option.analysis;
        var that = this;
        mui.init({
            pullRefresh: {
                container: '#'+option.containerId,
                up: {
                    // contentrefresh: '',
                    height:50,
                    callback: function () {
                        that.page++;
                        mui('#'+option.containerId).pullRefresh().endPullupToRefresh(that.MUINeedLoad); //参数为true代表没有更多数据了。
                        that.getData(that.url);
                    }
                }
            }
        });

        this.getData(this.url);
    }

    this.getData = function (url) {
        //重写url
        this.url = url;
        var that = this;
        var suffix = url.indexOf('?')== -1?"?":"&";
        var urlList = url + suffix + "curPage="+this.page+"&pageSize="+this.size;
        doFetch.get(urlList).then(function (data) {
            var html = "";
            var data = that.analysis(data);
            if(data.length == 0){
                that.MUINeedLoad = true;
            }
            that.render(data);
        })
    }

    this.destroy = function () {
        this.page = 1;
        this.MUINeedLoad = false;
        $("#"+this.containerId+" .mui-table-view").html("");
        if(_otherServer.isIOS){
            mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 100);//滚动到顶部
        }else if(_otherServer.isAndroid){
            window.scrollTo(0, 100);
        }
    }
}

//调用IOS和安卓服务
var OtherServer = function () {

    this.isCallLogin = false;

    this.ua = navigator.userAgent.toLowerCase();
    this.isIOS = /iphone|ipad|ipod/.test(this.ua);
    this.isAndroid = /android/.test(this.ua);

    //上传图片, params.fnName 为回调名称
    this.uploadImage = function (params) {
        if(this.isIOS){
            this.uploadImageIOS(params);
        }else if(this.isAndroid){
            this.uploadOrDownloadAndroid(1,"",JSON.stringify(params));
        }
    }
    //上传文件
    this.uploadFile = function (params) {
        if(this.isIOS){
            _alertShow.showOK("提示","IOS设备不支持上传文件");
        }else if(this.isAndroid){
            this.uploadOrDownloadAndroid(2,"",JSON.stringify(params));
        }
    }
    //下载文件或者图片
    this.downloadFile = function (filePath) {
        if(this.isIOS){
            _alertShow.showOK("提示","IOS设备不支持下载文件");
        }else if(this.isAndroid){
            this.uploadOrDownloadAndroid(3,filePath,"");
        }
    }

    //分享朋友圈
    this.shareAll = function (data) {
        if(this.isIOS){
            this.shareAllIOS(data);
        }else if(this.isAndroid){
            this.shareAndroid(2,data);
        }
    }

    //分享给好友
    this.shareSingle = function (data) {
        if(this.isIOS){
            this.shareSingleIOS(data);
        }else if(this.isAndroid){
            this.shareAndroid(1,data);
        }
    }
    //扫描
    this.scan = function (data) {
        if(this.isIOS){
            this.scanIOS(data);
        }else if(this.isAndroid){
            this.scanAndroid(data);
        }
    }

    //val1表示类型，1 上传图片 2 上传文件  3 下载图片
    //var2 当var1为 3 时才有用，是我要下载文件的url地址 为 1 和 2 时传入当前图片地址
    this.uploadOrDownloadAndroid = function (val1,val2,fn) {
        window.jsinterface.uploadOrDownload(val1, val2, fn);
    }

    this.shareAndroid = function (val1,data) {
        window.jsinterface.share(val1,JSON.stringify(data));
    }
    this.scanAndroid = function (data) {
        window.jsinterface.scanAndroid(JSON.stringify(data));
    }

    this.uploadImageIOS = function (data) {
        window.webkit.messageHandlers.uploadImageIOS.postMessage(JSON.stringify(data));
    }
    this.shareAllIOS = function (data) {
        window.webkit.messageHandlers.shareAllIOS.postMessage(JSON.stringify(data));
    }
    this.shareSingleIOS = function (data) {
        window.webkit.messageHandlers.shareSingleIOS.postMessage(JSON.stringify(data));
    }
    this.scanIOS = function (data) {
        window.webkit.messageHandlers.scanIOS.postMessage(JSON.stringify(data));
    }

    this.callPhone = function (data) {
        if(this.isIOS){
            window.webkit.messageHandlers.callPhone.postMessage(data);
        }else if(this.isAndroid){
            window.jsinterface.callPhone(data);
        }
    }

    this.userLogin = function () {
        var url = window.location.href;
        if(!this.isCallLogin){
            if(this.isIOS){
                window.webkit.messageHandlers.userLogin.postMessage(JSON.stringify({url:url}));
            }else if(this.isAndroid){
                window.jsinterface.userLogin(url);
            }
        }
        this.isCallLogin = true;
    }
}

//下拉框公用
var LevelCtl = {
    //安全巡检的事故类别
    eventCateData:[
        {name:"大型集体活动突发事件",code:"1"},
        {name:"地震事故",code:"2"},
        {name:"火灾事故",code:"3"},
        {name:"交通事故",code:"4"},
        {name:"食物中毒",code:"5"},
        {name:"突发传染病",code:"6"},
        {name:"突发新闻事件",code:"7"},
        {name:"意外伤害",code:"8"},
        {name:"拥挤踩踏",code:"9"},
    ],
    //安全巡检的风险级别
    levelData:[
        {name:"高级",code:"1"},
        {name:"中级",code:"2"},
        {name:"低级",code:"3"}
    ],
    schoolData:[
        {name:"校内",code:"1"},
        {name:"校外",code:"2"},
    ],
    //公告发布单位
    securityRule:[
        {name:"应急办公室",code:"100"}
    ],
    //通知人群
    callPerson:[
        {name:"校长",code:"1"},
        {name:"安全副校长",code:"2"},
        {name:"保卫处长",code:"3"},
        {name:"安全巡检员",code:"4"},
        {name:"宿舍管理员",code:"5"},
        {name:"校车管理员",code:"6"},
        {name:"班主任",code:"7"},
        {name:"任课老师",code:"8"},
    ],
    //发布前审批
    noticeTarget:[
        {name:"不需要审核",code:"0"},
        {name:"校长",code:"1"},
        {name:"安全副校长",code:"2"},
        {name:"保卫处长",code:"3"},
        {name:"安全巡检员",code:"4"},
        {name:"宿舍管理员",code:"5"},
        {name:"校车管理员",code:"6"},
        {name:"班主任",code:"7"},
        {name:"任课老师",code:"8"},
    ],
    approveTarget:[
        {name:"校长",code:"100"},
        {name:"不需要",code:"200"},
    ],
    //安全巡检分数项
    score:[
        {name:"5",code:"5"},
        {name:"3",code:"3"},
        {name:"1",code:"1"}
    ],
    //安全巡检提醒时间
    noticeTime:[
        {code:"600",name:"10分钟"},
        {code:"1200",name:"20分钟"},
        {code:"1800",name:"30分钟"}
    ],
    //安全巡检的重复周期
    cycle:[
        {name:"从不",code:"1"},
        {name:"每天",code:"2"},
        {name:"每周",code:"3"},
        {name:"每月",code:"4"},
        {name:"每年",code:"5"},
    ],
    getDataByCode:function (data,code) {
        var res = "";
        data.map(function (item) {
            if(item.code == code){
                res = item.name;
            }
        })
        return res;
    },
    appendSelect:function (data,container) {
        var html = "";
        data.map(function (item) {
            html += "<option value='"+item.code+"'>"+item.name+"</option>";
        })
        $(container).append($(html));
    }
}

var ReportCtl = function () {
    this.setBarOptions = function (title,x,val) {
        return {
            title : {
                text: title,
                x:'center'
            },
            color: ['#3398DB'],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : x,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:val
                }
            ]
        };
    }

    this.setPieOptions = function (title,x,val) {
        return {
            title : {
                text: title,
                x:'center'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: x
            },
            series : [
                {
                    name: '来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:val,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }
}

//滚动广播
var BroadCast = function(container,time){
    this.container = container;
    this.time = !time?2000:time;
    this.timeoutVal = -1;
    var that = this;

    this.tick = function(){
        var args = arguments;
        if (that.container.children().length <= 1) {
            return;
        }
        that.timeoutVal = setTimeout(function(){
            var tmpContainer = $(that.container)
            var field = tmpContainer.find('li:first');
            var h = field.height();
            field.animate({
                marginTop: -h + 'px'
            }, 800, function () {
                field.css('marginTop', 0).appendTo(tmpContainer);
            });
            args.callee();
        },that.time);
    }

    this.stop = function () {
        if(this.timeoutVal != -1){
            window.clearTimeout(this.timeoutVal);
        }
    }
}

var AlertDialog = function () {
    this.isShow = false;
    this.showOK = function (title,msg,status) {
        if(this.isShow){
            return;
        }
        var html = "<div class='alertStyle'><div class='mask'>";
        html += "<div class='content'>";
        html += "<div class='title'>";
        html += "<h1 style='padding-top: 18px;'>"+title+"</h1>";
        html += "<div style='cursor:pointer' class='close cc' tag='close'>×</div>";
        html += "</div>";
        html += "<div class='tip_info'>";
        html += "<h2>"+msg+"</h2>";
        html += "</div>";
        html += "<div style='cursor:pointer' class='btn okBtn cc' tag='close'>OK</div>";
        html += "</div>";
        html += "</div></div>";

        $("body").append($(html));

        this.isShow = true;
        if(status == "500"){

        }else{
            this.tick();
        }
    }

    this.cb = null;
    this.showConfirm = function (title,msg,cb) {
        if(this.isShow){
            return;
        }
        this.cb = cb;
        var html = "<div class='alertStyle'><div class='mask'>";
        html += "<div class='content'>";
        html += "<div class='title'>";
        html += "<h1 style='padding-top: 18px;'>"+title+"</h1>";
        html += "<div style='cursor:pointer' class='close cc' tag='close'>×</div>";
        html += "</div>";
        html += "<div class='tip_info'>";
        html += "<h2>"+msg+"</h2>";
        html += "</div>";
        html += "<div class='btn-group'>";
        html += "<div style='cursor:pointer' class='btn okBtn cc' tag='ok'>确定</div>";
        html += "<div style='cursor:pointer' class='btn cc' tag='close'>取消</div>";
        html += "</div></div>";
        html += "</div></div>";
        $("body").append($(html));
        this.isShow = true;
    }

    this.closeDialog = function () {
        $(".alertStyle").remove();
        this.isShow = false;
    }

    this.bindEvent = function () {
        var that = this;

        $("body").off("click").on("click","div.alertStyle div.cc",function (e) {
            if($(this).attr("tag") == "ok"){
                if(that.cb){
                    that.cb();
                }
            }
            that.closeDialog();
        })
    }

    this.sid = -1;
    this.tick = function () {
        var that = this;
        if(this.isShow){
            window.clearTimeout(that.sid);
            that.sid = window.setTimeout(function () {
                that.closeDialog();
            },2000)
        }
    }

    this.bindEvent();
}

/*
 * 验证表单类
 * property:strategys {json object}, 验证规则，为function
 * property:rules<Array> , 保存规则，
 * [{strategy: 'isNotEmpty',errorMsg:'用户名不能为空'},{strategy: 'minLength:6',errorMsg:'用户名长度不能小于6位'}]
 *
 * add, 添加规则
 * start:Array  返回结果，为数组
 * */

/*
* demo:
* 在提交前声明：
* validatorFun: function (name,pwd) {
        var _validator = new Validator();
        _validator.add(name,[{strategy: 'isNotEmpty',errorMsg:'name is required'}]);
        _validator.add(pwd,[{strategy: 'isNotEmpty',errorMsg:'pwd is required!'}]);

        return _validator.start();
    }
    调用：
    var res = this.validatorFun(name,pwd)
        if(res.length != 0){

            return;
        }
*
* */
var Validator = function(){
    this.rules = [];
    /*
     * rules: [{strategy: 'isNotEmpty',errorMsg:'用户名不能为空'},
     {strategy: 'minLength:6',errorMsg:'用户名长度不能小于6位'}]
     *value :dom element.value
     *
     * 返回删除的第一个
     *  */
    this.add = function(value,rules){
        var that = this;
        rules.map(function(rule){
            (function(rule){
                //获取strategy key数组，可能有附加条件用:隔开
                var strategyAry = rule.strategy.split(":");
                var errorMsg = rule.errorMsg;
                var fun = function(){
                    //获取获取strategy key具体值
                    var strategy = strategyAry.shift();
                    strategyAry.unshift(value);
                    strategyAry.push(errorMsg);
                    return that.strategys[strategy].apply(value,strategyAry);
                }
                that.rules.push(fun);
            })(rule);
        })
        return this;
    }
    this.start = function(){
        var res = [];
        this.rules.map(function(validatorFunc){
            var msg = validatorFunc();
            if(msg){
                res.push(msg);
            }
        })
        return res;
    }

    this.initConfig = function (arr) {
        var that = this;
        arr.map(function (item) {
            that.add(item.value,item.config);
        })
        return this.start();
    }
}

Validator.prototype.strategys = {
    isNotEmpty:function(value,errorMsg){
        if(value === "") {
            return errorMsg;
        }
    },
    minLength:function(value,length,errorMsg){
        if(value.length < length) {
            return errorMsg;
        }
    },
    maxLength:function(value,length,errorMsg){
        if(value.length > length) {
            return errorMsg;
        }
    },
    mobileFormat: function(value,errorMsg) {
        if(!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    },
    emailFormat:function(value,errorMsg){
        if(!/\w@\w*\.\w/.test(value)){
            return errorMsg;
        }
    },
    urlFormat:function(value,errorMsg){
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        if (!re.test(value)){
            return errorMsg;
        }
    },
    numFormat:function(value,errorMsg){
        var regu = /^[1-9]\d*$/;
        if(!regu.test(value)){
            return errorMsg;
        }
    }
}

//实例化对象
var _dropCtl = new DropCtl();
var _otherServer = new OtherServer();
var _reportCtl = new ReportCtl();


//表单验证的时候调用
function initValidator(arr) {
    var _validator = new Validator();
    arr.map(function (item) {
        _validator.add(item.value,item.config);
    })
    var res = _validator.start();
    if(res.length != 0){
        _alertShow.showOK("提示",res.join(','),500);
        return false;
    }
    return true;
}

//权限控制
function checkAuthExist(data,code) {
    var index = -1;
    data.map(function (item,idx) {
        if(item == code){
            index = idx;
        }
    })
    return index;
}
function checkPageAuth(code) {
    $.ajax({
        url:"/getauthbutton?code="+code,
        datatype:"json",
        success:function (d) {
            var data = eval("("+d+")");
            if(data.status == "200"){
                $("._authCls").each(function () {
                    if(checkAuthExist(data.data,$(this).attr("acode")) == -1){
                        $(this).hide();
                    }
                })
            }else if(data.status == "701"){
                _otherServer.userLogin();
            }else{
                _alertShow.showOK("提示","获取权限数据失败")
            }
        }
    })
}
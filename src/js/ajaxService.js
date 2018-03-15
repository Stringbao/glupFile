
    var AjaxService = function(){
        this.get = function (url) {
            var defer = Q.defer();
            $.ajax({
                type:"get",
                dataType:"json",
                url:"/baseapi/"+ url,
                success:function (d) {
                    if(d.status == "200"){
                        defer.resolve({data:d.data,params:d.params});
                    }else if(d.status == "701"){
                        defer.reject({data: d.msg});
                        _otherServer.userLogin();
                    }else{
                        _alertShow.showOK("错误","获取数据失败,请重试!");
                        defer.reject({data: d.msg});
                    }
                },
                error:function (a, b, c) {
                    _alertShow.showOK("错误","请稍后再试!");
                    defer.reject({data: a.status});
                }
            })
            return defer.promise;
        }

        this.post = function(url,data){
            var defer = Q.defer();
                $.ajax({
                    type:"post",
                    data:data?data:null,
                    dataType:"json",
                    url:"/baseapi/"+ url,
                    success:function (d) {
                        if(d.status == "200"){
                            defer.resolve({data:d.data,params:d.params});
                        }else if(d.status == "701"){
                            defer.reject({data: d.msg});
                            _otherServer.userLogin();
                        }else{
                            _alertShow.showOK("错误","获取数据失败,请重试!",500);
                            defer.reject({data: d.msg});
                        }
                    },
                    error:function (a, b, c) {
                        _alertShow.showOK("错误","请稍后再试!",500);
                        defer.reject({data: a.status});
                    }
                })
            return defer.promise;
        }
    }

    var doFetch = new AjaxService();

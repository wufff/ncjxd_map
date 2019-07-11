define(["jquery","lay","path"], function($,layer,path) {
	return {
		ajaxJSONP:function(url, data, callback) {
			$.ajax({
				type: "get",
				// async: false,
				url: url,
				data: data,
				dataType: "jsonp",
				jsonp: "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
				success: function(json) {
					callback(json);
				},
				error: function(e) {
					alert("ajaxJSONP error");
				}
			});
		},


		ajaxPost:function(requestUrl,requestData,SuccessCallback,successPar){
			if(path.is_local) {
				requestData.jump = 1;
			}
			$.ajax({
				type: "POST",
				url: requestUrl,
				data: requestData,
				contentType: "application/x-www-form-urlencoded",
				dataType: "text",
				sync: false,
				success: function(data) {
					var obj = null;
					try {
						obj = eval('(' + data + ')');
					} catch (ex) {
						obj = data;
					}
					
					if(data.type == "login"){
						 layer.msg("请先登录！",{anim:-1});
						 setTimeout(function(){
						 	window.location.href ="/";
						 },300)
						 return;
						}else if( successPar && successPar != 0){
						SuccessCallback(obj, successPar);
					}else {
						SuccessCallback(obj);
					}
					
				},
				error: function(err) {
					alert(err);
				},
				complete: function(XHR, TS) {
					XHR = null
				}
			});
		},
       ajaxGet:function(url,data,SuccessCallback,successPar){
       	    $.ajax({
            type: "get",
            url: url,
            data: data,
            cache: false,
            // async: false,
            dataType: "json",
            success: function (res)
            {
                if (res.type == "login"){
						 layer.msg("请先登录！",{anim:-1});
						 // $("#layui-layer1").css("width","130px");
						 // $("#layui-layer1").css("margin-left","100px");
						 setTimeout(function(){
						 	window.location.href ="/";
						 },300)
						 return;
                }else if( res.type == "access" ){ 
                      layer.msg("无权限！",{anim:-1});
       //                $("#layui-layer1").css("width","130px");
					  // $("#layui-layer1").css("margin-left","100px");
                }else if(successPar){
                    	SuccessCallback(res,successPar);
                    }else{
                    	SuccessCallback(res);
                 }
                
            },
            error: function (res) {
            	var obj = { 
                    type:"ajax返回错误",
                    data:res
            	 }
                //console.log(obj);
                layer.msg("网络错误，请联系管理员",{time:800});
            }
        });
       }

	}
})

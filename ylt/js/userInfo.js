//btn点击变色效果
fnSkip("#logout",'opacity','0.5','1');

$("#logout").on('click', function(event) {
    event.preventDefault();
    //退出登录，清除cookie
    clearCookie();
    window.location.href = "userMine.html";
});

//获取登录key
var accessKey = fnGetCookie("accessKey");
var dynamicKey = fnGetCookie("dynamicKey");

$.ajax({
    url: _url + _getUserInfo,
    data:{
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    },
    type:"post",
    async: false,
    success: function(data){
        var obj_data = $.parseJSON(data);
        var _data = obj_data.data[0];

        if (obj_data.revertCode != 0) {

            $(".out .info").html(obj_data.statusHint);
            //动态显示，1.5s后消失
            $(".content .out").css('opacity', '1');
            setTimeout(function () {
                $(".content .out").css('opacity', '0');
            }, 1500);

            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (obj_data.statusCode == 0) {//结果码

            if (obj_data.data) {
                var _data = obj_data.data[0];
                var _message = "";
                _message += '\
	        					<ul class="detail">\
	        		 			 	<li><em>昵称</em><span>' + ((_data.userName)?_data.userName:"") + '</span></li>\
	        					    <li class="detail_li"><em>手机号</em><span>' + ((_data.mobile)?_data.mobile:"") + '</span></li>\
	        					</ul>';

                $("#logout").before(_message);

                if (obj_data.isMember) {
                    $(".detail").append(' <li class="detail_li bill"><em>志愿者账号</em><span>点击查看</span></li>')
                }
            }
        }else {
            $(".out .info").html(obj_data.statusHint);
            fnInfo();
        }
    }
});

//"我的单号"跳转
fnSkip(".bill","backgroundColor","#C4C4C4","#fff","userNumberList.html");
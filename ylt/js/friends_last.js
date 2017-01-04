//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");
var memNum = fnGetCookie("_memberNum");

//请求方式，默认为“直推”
var requestWay = "introducer";

//点击切换请求方式
$(".option span").click(function(event) {
    $(this).addClass('selected');
    $(this).siblings().removeClass('selected');

    //获取请求方式
    requestWay = ($(this).html() == "直推")?"introducer":"manament";

    //置空，重新获取查询结果
    $(".list").html("");
    fnQueryLowerMem(requestWay);
});

function fnQueryLowerMem(requestWay){
    //请求数据
    $.ajax({
        url: _url + _getLastLowerMembers,
        data:{
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "style":requestWay,
            "mark":"wpage"
        },
        type:"post",
        async: false,
        success: function(data){
            var obj_data = $.parseJSON(data);

            if (obj_data.revertCode != 0) {
                $(".out .info").html(obj_data.statusHint);
                //动态显示，1.5s后消失
                fnInfo();

                return;//不继续往下执行了，结果码那个不再执行。
            }

            if (obj_data.statusCode == 0) {//结果码

                var _data = obj_data.data;

                for (var i = 0; i < _data.length; i++) {

                    var _detail = "";

                    _detail += '\
		        		<div class="item">\
		        			<span class="col-xs-3">'+ _data[i].memberName +'</span>\
		        			<span class="col-xs-3">'+ _data[i].memberNum +'</span>\
		        			<span class="col-xs-3">'+ _data[i].createDate +'</span>\
		        			<span class="col-xs-3">'+ _data[i].storey +'</span>\
		        		</div>';

                    $(".list").append(_detail);
                }

            }else {
                $(".info").html(obj_data.statusHint);
                //动态显示，1.5s后消失
                fnInfo();
            }
        }
    });
}

fnQueryLowerMem(requestWay);
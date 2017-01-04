
//获取到cookie
var accessKey=fnGetCookie("accessKey_m");
var dynamicKey=fnGetCookie("dynamicKey_m");

var oldNum = "0";//作用是防止再次点击查询出相同的内容
$("#search").click(function(){
    //获取到输入框的值
    var volTeer=$("#volTeer").val();
    
    if(volTeer == ""){//如果输入框是空
        $(".content").html("");
        var info = "";
        info += '\
					<div class="out">\
						<div class="info"></div>\
					</div>';
        $(".content").append(info);
        $(".out .info").html("志愿者账号输入有误！");
        //动态显示，1.5s后消失
        fnInfo();
        return;
    }
    if(volTeer.length != 8){
        $(".content").html("");
        var info = "";
        info += '\
					<div class="out">\
						<div class="info"></div>\
					</div>';
        $(".content").append(info);
        $(".out .info").html("志愿者账号输入有误！");
        //动态显示，1.5s后消失
        fnInfo();
        return;
    }

    $.ajax({
        url: _url + _getMemberByNumber,
        type: 'post',
        dataType: 'json',
        async: false,
        data: {
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "number": volTeer,
            "mark": "wpage"
        }
    })
        .done(function(result) {
            if (result.revertCode != 0) {
                $(".out .info").html("找不到该账号所对应的信息！");
                //动态显示，1.5s后消失
                fnInfo();

                return;//不继续往下执行了，结果码那个不再执行。
            }
            if (result.statusCode == 0) {//结果码
                //如果data不等于null
                if(result.data != null){
                    $(".content").empty();//清除上一次显示在页面上的内容
                    var data = result.data[0];
                    var volunteer="";
                    volunteer +='\
							<div class="volunteer">\
								<div class="volunteer_box">\
									<em>志愿者账号</em><span>' + data.memberNum + '</span>\
								</div>\
								<div class="volunteer_box volunteer_num">\
									<em>志愿者姓名</em><span>' + data.memberName + '</span>\
								</div>\
								<div class="volunteer_box">\
									<em>推荐人账号</em><span>' + data.introducerNum + '</span>\
								</div>\
								<div class="volunteer_box volunteer_num">\
									<em>推荐人姓名</em><span>' + data.introducerName + '</span>\
								</div>\
								<div class="volunteer_box">\
									<em>辅导人账号</em><span>' + data.manamentNum + '</span>\
								</div>\
								<div class="volunteer_box volunteer_num">\
									<em>辅导人姓名</em><span>' + data.manamentName + '</span>\
								</div>\
								<div class="volunteer_box">\
									<em>备注</em><span>' + ((data.note)?data.note:"无") + '</span>\
								</div>\
							</div>';
                    $(".content").append(volunteer);
                }else{//否则提示用户
                    $(".content").html("");
                    var info = "";
                    info += '\
							<div class="out">\
								<div class="info"></div>\
							</div>';
                    $(".content").append(info);
                    $(".out .info").html("找不到该账号所对应的信息！");
                    //动态显示，1.5s后消失
                    fnInfo();
                }
            }else {
                $(".info").html(result.statusHint);
                //动态显示，1.5s后消失
                fnInfo();
            }
        });
});
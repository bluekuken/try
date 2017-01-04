
//根据key来获取cookie的value值
var start=fnGetCookie("_dataStart");
var end=fnGetCookie("_dataEnd");
var memberNum=fnGetCookie("_memberNum");

//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$.ajax({
    url: _url + _getFinancialDetails,
    type: 'post',
    dataType: 'json',
    async : false,
    data: {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "memberNumber":memberNum,
        "startDate":start,
        "endDate":end,
        "mark":"wpage"
    }
})
    .done(function(result) {
        if (result.revertCode != 0) {
            $(".out .info").html(result.statusHint);
            //动态显示，1.5s后消失
            fnInfo();

            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (result.statusCode == 0) {//结果码
            //显示数据日期段
            $(".startDate").html(start);
            $(".endDate").html(end);

            //有数据才显示
            if (result.data) {
                var target=result.data;
                for(var i=0;i<target.length;i++){
                    var lis_target=target[i];
                    var _uls = "";
                    
                    _uls += '\
						<div class="query_title clear">\
							<div style="width: 21%">\
								<div>' + parseInt(lis_target.rewardDate)+ '</div>\
								<div>已累计</div>\
							</div>\
							<div>\
								<div>' + parseInt(lis_target.withdrawalsIntroduce) + '</div>\
								<div>' + parseInt(lis_target.wholeIntroduce) + '</div>\
							</div>\
							<div>\
								<div>' + parseInt(lis_target.withdrawalsManagement) + '</div>\
								<div>' + parseInt(lis_target.wholeManagement) + '</div>\
							</div>\
							<div>\
								<div>' + parseInt(lis_target.withdrawalsGolbal) + '</div>\
								<div>' + parseInt(lis_target.wholeGolbal) + '</div>\
							</div>\
							<div>\
								<div>' + parseInt(lis_target.chonXiao) + '</div>\
								<div>' + parseInt(lis_target.wholeChonXiao) + '</div>\
							</div>\
							<div class="data_special">\
								<div>' + parseInt(lis_target.withdrawalsAccumulate) + '</div>\
								<div>' + parseInt(lis_target.wholeAccumulate) + '</div>\
							</div>\
						</div>';

                    $(".content .data_tail").append(_uls);
                }
            }else{
                $(".start_end").after('<h4 style="text-align: center;color: #bbb;">无法找到相关明细！！</h4>');
                $(".content .query_title").css("display","none");
                $(".content .data_tail").css("display","none");
            }
        }else {
            $(".info").html(obj_data.statusHint);
            //动态显示，1.5s后消失
            fnInfo();
        }
    });
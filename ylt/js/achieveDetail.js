//根据key来获取cookie的value值
var start=fnGetCookie("_dataStart");
//console.log(start)
var end=fnGetCookie("_dataEnd");
//console.log(end)
var memberNum=fnGetCookie("_memberNum");

//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$.ajax({
    url: _url + _getAchievement,
    type: 'post',
    dataType: 'json',
    async : false,
    data: {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "number":memberNum,
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
            var target=result.data[0];
            var _uls="";

            //显示数据日期段
            $(".memNum").html(target.memberNum);
            $(".memName").html(target.memberName);
            $(".tuijian").html(target.wholeCountIntroducer);
            $(".fudao").html(target.wholeCountManament);

            _uls += '\
						<li><em>开&nbsp;&nbsp;始&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;期&nbsp;&nbsp;：</em><span class="startDate">' + start + '</span></li>\
						<li><em>结&nbsp;&nbsp;束&nbsp;&nbsp;&nbsp;日&nbsp;&nbsp;&nbsp;期&nbsp;&nbsp;：</em><span class="endDate">' + end + '</span></li>\
						<li><em>时间段推荐单数：</em><span>' + target.todayCountManament + '</span></li>\
						<li><em>时间段辅导单数：</em><span>' + target.todayCountManament + '</span></li>';
            $(".content .time_cumula").append(_uls);
            if(target.todayCountManament && target.todayCountManament){
                var lis_data=result.data[0].listData;
               
                var _datauls="";
                _datauls +='\
						<div class="clear detail_content">\
							<span class="col-xs-4">日期</span>\
							<span class="col-xs-4">推荐单数</span>\
							<span class="col-xs-4">辅导单数</span>\
						</div>';
                $(".content .lis_title").append(_datauls);
                for(var i=0;i<lis_data.length;i++){
                    var lis_target=lis_data[i];
                    var _lis="";
                    
                    _lis +='\
							<div class="clear detail_content">\
								<span class="col-xs-4">' + lis_target.createDate + '</span>\
								<span class="col-xs-4">' + lis_target.introducerCount + '</span>\
								<span class="col-xs-4">' + lis_target.manamentCount + '</span>\
							</div>';
                    $(".content .lisData").append(_lis);
                }
            }
        }else {
            $(".info").html(result.statusHint);
            //动态显示，1.5s后消失
            fnInfo();
        }
    });

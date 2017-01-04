//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$.ajax({
    url: _url + _getBranchAchievement,
    type: 'post',
    dataType: 'json',
    async : false,
    data: {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
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
            for(var i=0;i<result.data.length;i++){
                var target=result.data[i];
                var _ul="";

                _ul += '\
					<ul class="detail">\
						<li><em>志愿者姓名：</em><span>' + target.memberName + '</span></li>\
						<li><em>志愿者账号：</em><span>' + target.memberNum + '</span></li>\
						<li><em>推荐总单数：</em><span>' + target.introducerCount + '</span></li>\
						<li><em>辅导总单数：</em><span>' + target.manamentCount + '</span></li>\
					</ul>';

                $(".content").append(_ul);
            }
        }else {
            $(".info").html(result.statusHint);
            //动态显示，1.5s后消失
            fnInfo();
        }
    });
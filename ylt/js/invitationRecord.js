
//获取登录key
var accessKey = fnGetCookie("accessKey");
var dynamicKey = fnGetCookie("dynamicKey");

$.ajax({
    url: _url + _getRecommendLog,
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
            var target=result.data;
            //声明信息的总数的下标n
            if (target) {
                var n = target.length - 1;

                if(n > 10){//如果n大于10
                    var m = n - 10;//那么声明m作为条件和n做比较，减10意思是只取最新的10条数据
                }else{
                    //否则不足十条信息的话让，m=-1,这样才能获取到下标为零的那条信息
                    var m = -1;
                }
                for( n; n > m; n-- ){
                    var _target=target[n];
                    var _uls="";

                    _uls += '\
							<ul class="time_cumula">\
								<li><em>推 荐 时 间：</em><span>' + _target.createDate + '</span></li>\
								<li><em>发&nbsp;&nbsp;&nbsp;起 &nbsp;&nbsp;人：</em><span>' + _target.invitationName + '</span></li>\
								<li><em>推&nbsp;&nbsp;荐 &nbsp;&nbsp;&nbsp;人：</em><span>' + _target.introducerName + '</span></li>\
							</ul>';

                    $(".content .out").before(_uls);
                }
            }else {
                $(".info").html("暂无邀请记录！");
                //动态显示，1.5s后消失
                fnInfo();
            }
        }else {
            $(".info").html(result.statusHint);
            //动态显示，1.5s后消失
            fnInfo();
        }
    });

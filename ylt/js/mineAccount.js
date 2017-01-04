//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$.ajax({
    url: _url + _getAccountInfo,
    data:{
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    },
    type:"post",
    async: false,
    success: function(data){
        var obj_data = $.parseJSON(data);

        console.log(obj_data);

        if (obj_data.revertCode != 0) {
            $(".out .info").html(obj_data.statusHint);
            //动态显示，1.5s后消失
            fnInfo();

            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (obj_data.statusCode == 0) {//结果码

            if (obj_data.data) {
                var _data = obj_data.data[0];
                // console.log(_data)
                var _detail = "";
                _detail += '\
		        			<ul class="detail">\
				  			 	<li><em>可提现总金额：</em><span>'+ _data.withdrawals +'</span></li>\
				 			    <li><em>重销金额：</em><span>'+ _data.chonXiao +'</span></li>\
				 			</ul>';

                $(".out").before(_detail);
            }
        }else {
            $(".out .info").html(obj_data.statusHint);
            fnInfo();
        }
    }
});
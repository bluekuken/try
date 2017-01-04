//用户充值点击效果
fnSkip("#login","opacity","0.5","1");

/*未登录就取消“推荐志愿者”的跳转*/
//判断是否已经用户登录，决定“志愿者充值”、“推荐志愿者”是否可用
if (!fnGetCookie("accessKey")) {
    $("#recharge").css('backgroundColor', 'rgba(0,0,0,0.2)');
    $("#remote").css('backgroundColor', 'rgba(0,0,0,0.2)');
}
else{
    //用户充值点击效果
    // $("#recharge").css('backgroundColor', 'value');
    fnSkip("#recharge","opacity","0.5","1");
    //推荐用户点击效果
    fnSkip("#remote","opacity","0.6","1","recommend.html");
};

//检查是否存在 userMemberList.html 页面写入的 _volunteerAccount,有则填写
if ( fnGetCookie("_volunteerAccount") ) {
    $("#mobile").val(fnGetCookie("_volunteerAccount"));
}

// 获取公钥、模请求
var modulus = "", exponent = "", sessionId= "";
$.ajax({
    url: _url + _getPublicKeyToRegister,
    type: 'post',
    dataType: 'json',
    async : false,
    data: {
        "mark":"wpage"
    }
})
    .done(function(result) {

        // //获取公钥、模
        modulus = result.modulus;
        exponent = result.publicExponent;
        sessionId = result.sessionId;

        // //点击登录
        $("#login").click(function(event) {

            var mobile = $("#mobile").val();
            var pwd = $("#pwd").val();

            if (mobile && pwd ) {

                var password = $.md5(hex_sha512($.md5(pwd)));

                //普通用户
                var map = {
                    "number": mobile,
                    "password": password,
                    "mobileCheckCode": "1234",
                    "mark":"wpage"
                };

                var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);

                $.ajax({
                    url: _url + _loginMember,
                    data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                    type:"post",
                    async: false,
                    success: function(data){

                        var obj_data = $.parseJSON(data);

                        //获取用户key，使用cookie存储
                        fnSetCookie("accessKey_m",obj_data.accessKey);
                        fnSetCookie("dynamicKey_m",obj_data.dynamicKey);

                        if (obj_data.revertCode != 0) {
                            alert(obj_data.statusHint);
                            return;//不继续往下执行了，结果码那个不再执行。
                        }

                        if (obj_data.statusCode == 0) {//结果码
                            //登录成功，设置cookie
                            var date = new Date();
                            fnSetCookie('starttime_m',date.getTime());

                            window.location.href = "memberMine.html";
                        }else {
                            alert(obj_data.statusHint);
                        }
                    }
                });
            }else {
                $(".out .info").html("账号跟密码不能为空，请校验后再登录！");
                //动态显示，1.5s后消失
                fnInfo();
            }
        });
    });
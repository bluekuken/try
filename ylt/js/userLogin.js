

//获取url中的code参数
function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) {
        return unescape(r[2]);
    }

    return null; 
}
//获取用户授权code
var code = getQueryString("code");

//如果是第一次打开，则左上角的返回不显示
if (!document.referrer) {
    $(".return i").css('display', 'none');
};

//登录、注册按钮点击变色
fnSkip('#login','opacity',"0.4",'1');
fnSkip('#signUp','backgroundColor',"rgba(200,200,202,0.5)",'#fff',"register.html");

//登录用户类型判断:true--member,false--user
var _userType = true;

$(".userType input").on('change', function(event) {

    if( $(this).prop("checked") ){
        _userType = !_userType;
    }

});

var modulus = "", exponent = "", sessionId= "";
// 获取公钥、模请求
$("#login").click(function(event) {

    var mobile = $("#mobile").val();
    var pwd = $("#pwd").val();

    //检验输入框信息的完整性
    if (mobile && pwd ) {

        //用户忘记选择登录用户类型时提示
        var flag = mobile.length>8?false:true;//用户的账户类型：true--志愿者，false--用户

        if (_userType && !flag) {
           $(".message .info").html('请选择"用户"登录！');
           //动态显示，1.5s后消失
           fnInfo(); 

           return;
        }else if (!_userType && flag) {
            $(".message .info").html('请选择"志愿者"登录！');
            //动态显示，1.5s后消失
            fnInfo();

            return;
        };

        //密码加密，登录使用
        var password = $.md5(hex_sha512($.md5(pwd)));

        //请求公钥、模
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
            })

        if (_userType) {//志愿者登录请求

            //志愿者
            var map = {
                "number": mobile,
                "password": password,
                "mobileCheckCode": "1234",
                "code": code,
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
        }else{//基本用户

            //普通用户
            var map = {
                "mobile": mobile,
                "password": password,
                "mobileCheckCode": "1234",
                "customerKey":"1234",
                "code": code,
                "mark":"wpage"
            };

            var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);

            $.ajax({
                url: _url + _loginUser,
                data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                type:"post",
                async: false,
                success: function(data){

                    var obj_data = $.parseJSON(data);

                    //获取用户key，使用cookie存储
                    fnSetCookie("accessKey",obj_data.accessKey);
                    fnSetCookie("dynamicKey",obj_data.dynamicKey);

                    if (obj_data.revertCode != 0) {
                        alert(obj_data.statusHint);
                        
                        return;//不继续往下执行了，结果码那个不再执行。
                    }

                    if (obj_data.statusCode == 0) {//结果码
                        //登录成功，设置cookie
                        var date = new Date();
                        fnSetCookie('starttime',date.getTime());

                        window.location.href = "userMine.html";
                    }else {
                        alert(obj_data.statusHint);
                    }
                }
            });
        };
    }else {
        $(".message .info").html("账号跟密码不能为空，请校验后再登录！");
        //动态显示，1.5s后消失
        fnInfo();
    }
});

/*
函数名：fnInfo
功能：显示提示信息
使用范围：全部页面
*/
function fnInfo(url) {
    var url = url || "";
    $(".wrap .message").css('opacity', '1');

    setTimeout(function () {
        $(".wrap .message").css('opacity', '0');
        if (url) {
            window.location.href = url;         
        };
    }, 1500);
}
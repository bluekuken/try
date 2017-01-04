
    //注册信息不完整时“保存”按钮不可用
$("#save").attr('disabled', 'false');

//未输入正确的手机号码之前，“获取验证码”按钮不可用
$("#get_code").attr('disabled', 'false');

//监听“手机号”的输入，如果位数11则“获取验证码”按钮可用，否则不可用
$("#mobile").on('input',function(){
    if($(this).val().length == 11){
        $("#get_code").css('backgroundColor', '#EE8F00');
        $("#get_code").removeAttr("disabled");
    }else{
        $("#get_code").css('backgroundColor', '#ccc');
        $("#get_code").attr('disabled', 'true');
    }
});


//点击“获取验证码”按钮立即调用 fnProvePhoneNum 验证手机号码的合法性，合法则发送，否则提示“输入正确号码”
$("#get_code").click(function(event) {
    var phone = $("#mobile").val();

    if ( fnProvePhoneNum(phone) ) {

        //倒计时设置值
        var count_time = 30;
        fnCountTime($(this),count_time);

        //请求验证码
        $.ajax({
            url: _url + _sendRegisterCode,
            type: 'post',
            dataType: 'json',
            async : false,
            data: {
                "mobile": phone,
                "sign": "reg",
                "mark" : "wpage"
            }
        })
            .done(function(result) {
                //不成功，提示
                $(".out .info").html(result.statusHint);
                //动态显示，1.5s后消失
                $(".out").css('opacity', '1');

                fnInfo();
            })
         
    }else {
        alert("请输入正确的手机号码！");
    }
});

//获取验证码-倒计时函数 fnCountTime
function fnCountTime(obj,time) {

    if (time == 0) {
        $("#get_code").css('backgroundColor', '#EE8F00');
        $("#get_code").text("获取验证码");
        time = 30;
        $("#get_code").removeAttr("disabled");
    }else {
        $("#get_code").css('backgroundColor', '#ccc');
        $("#get_code").attr('disabled', 'true');
        time--;
        $("#get_code").text("重新发送("+time+")");

        setTimeout(function() {
                fnCountTime(obj,time)
        },1000);
    }
}

//验证手机号码函数 fnProvePhoneNum，验证是否为合法手机号码
function fnProvePhoneNum(num){
    re= /^[0-9]{11}$/;

    if (re.test(num)) {
        return true;
    }else {
        return false;
    }
}

//注册信息的完整性校验
$("input").on('input',function(event) {

    var phone = $("#mobile").val();
    var examCode = $("#examCode").val();
    var pwd = $("#password").val();
    var surePwd = $("#surepwd").val();

    if (phone && examCode && pwd && surePwd) {
        $("#save").removeAttr('disabled');
        $("#save").css('background', '#EE8F00');
        fnSkip("#save","opacity","0.4",'1');
    }else {
        $("#save").attr('disabled','disabled');
        $("#save").css('background', '#ccc');
    }

});

//点击“保存”按钮则请求注册
$("#save").on('click', function(event) {
    event.preventDefault();

    //获取公钥、模
    var modulus = "", exponent = "", sessionId= "";
    $.ajax({
        url: _url + _getPublicKeyToRegister,
        type: 'post',
        dataType: 'json',
        async : false,
        data: {
            "mark" : "wpage"
        }
    })
        .done(function(result) {
            //获取公钥、模
            modulus = result.modulus;
            exponent = result.publicExponent;
            sessionId = result.sessionId;

            // 用户输入的密码
            /*注册页面的数据提交*/
            var mobile = $("#mobile").val();
            var examCode = $("#examCode").val();
            var pwd = $("#password").val();
            var sure_pwd = $("#surepwd").val();

            //检验两次密码是否一致
            if (pwd == sure_pwd) {
                // console.log('x')
                var password = $.md5(hex_sha512($.md5(pwd)));

                var map = {
                    "mobile": mobile,
                    "password": password,
                    "mobileCheckCode": examCode,
                    "mark" : "wpage"
                };
                var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);

                $.ajax({
                    url: _url + _registerUser,
                    data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                    type:"post",
                    async: false,
                    success: function(data){

                        var obj_data = $.parseJSON(data);

                        if (obj_data.revertCode != 0) {
                            alert(obj_data.statusHint);
                            return;//不继续往下执行了，结果码那个不再执行。
                        }

                        if (obj_data.statusCode == 0) {//结果码
                            //如果成功就提示，1.5秒后跳转登录页
                            $(".out .info").html(obj_data.statusHint);
                            //动态显示，1.5s后消失
                            $(".out").css('opacity', '1');

                            fnInfo("userMine.html");

                        }else {
                            //不成功，提示
                            $(".out .info").html(obj_data.statusHint);
                            //动态显示，1.5s后消失
                            $(".out").css('opacity', '1');

                            fnInfo();
                        }
                    }
                });
            }else {
                $(".out .info").html("两次输入的密码不一致！");
                //动态显示，1.5s后消失
                $(".out").css('opacity', '1');

                fnInfo();
            }
        });
});

/*提示信息框*/
function fnInfo(url) {
    var url = url || "";
    $(".out").css('opacity', '1');
    setTimeout(function () {
        $(".out").css('opacity', '0');
        if (url) {
            window.location.href = url;         
        };
    }, 1500);
}


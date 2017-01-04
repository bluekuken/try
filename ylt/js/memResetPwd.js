    //调用点击改变颜色函数
    fnSkip(".submit-btn",'opacity','0.5','1');

    //禁止密码框的复制粘贴功能
    $(".item input").not('#phoneNum').on('paste',function(event) {
        return false;
    });

    $(".item input").not('#phoneNum').on('copy',function(event) {
        return false;
    });

    //校验
    $(".submit-btn").on({
        touchstart: function(e){
            fnKuken = fnMyFun;//touch设置函数
        },
        touchmove: function(){
            fnKuken = "";//滑动取消函数
        },
        touchend: function(){
            fnKuken();//touch结束后执行函数

            //当滑动时，fnKuken 不是函数，则报错，则不会执行下面的内容。
            //刚好满足需求，但报错信息存在，不是很好。
            $(".info").html(strings);

            if (wholeMark) {//修改不成功则提示信息，但不跳转
                fnInfo();
            }else {//修改成功,提示信息后跳转
                fnInfo("userLogin.html");
            };
        }
    })

    var strings = "";//提示信息变量
    var wholeMark = false;//判断标志，如果有即将导致修改不成功或者修改不成功，则成立，置true

    function fnMyFun() {
        strings = "";//重置判断条件
        wholeMark = false;//重置判断条件

        var inputs = $(".item input");
 
        for(var i = 0; i < inputs.length; i++) {

            if ( $(inputs[i]).val().length == 0 ) {
                strings = "志愿者账号、密码均不能为空！";
                wholeMark = true;//不成立条件发生，置true,后面终止执行

                return;
            };
        }

        if ( $(inputs[1]).val() == $(inputs[2]).val() ) {
            strings = "旧密码不能与新密码相同！";
            wholeMark = true;//不成立条件发生，置true,后面终止执行

            return;
        }

        if ( $(inputs[2]).val() != $(inputs[3]).val() ) {
            strings = "新密码与确认密码不同！";
            wholeMark = true;//不成立条件发生，置true,后面终止执行

            return;
        }

        //修改密码请求
        var accessKey = fnGetCookie("accessKey_m");
        var dynamicKey = fnGetCookie("dynamicKey_m");
        var modulus = "", exponent = "", sessionId= ""; 

        $.ajax({
            url: _url + _getPublicKey,
            type: 'post',
            dataType: 'json',
            async : false,
            data: {
                accessKey: accessKey,
                "mark":"wpage"
            }
        })
            .done(function(result) {
                //获取公钥、模
                modulus = result.modulus;
                exponent = result.publicExponent;
                sessionId = result.sessionId;

                var oldPassword = $.md5(hex_sha512($.md5($(inputs[1]).val())));
                var newPassword = $.md5(hex_sha512($.md5($(inputs[2]).val())));

                var map = {
                    "accessKey":accessKey,
                    "dynamicKey":dynamicKey,
                    "number": $(inputs[0]).val(),
                    "oldPwd": oldPassword,
                    "newPwd": newPassword,
                    "mark":"wpage"
                };

                var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);

                $.ajax({
                    url: _url + _editMemberPwd,
                    data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                    type:"post",
                    async: false,
                    success: function(data){
                        var obj_data = $.parseJSON(data);

                        if (obj_data.revertCode != 0) {
                            strings = obj_data.statusHint;
                            wholeMark = true;//不成功条件成立，置true

                            return;//不继续往下执行了，结果码那个不再执行。
                        }

                        if (obj_data.statusCode == 0) {//结果码

                            strings = "密码修改成功，请重新登陆！";
                            
                        }else {
                            strings = obj_data.statusHint;
                            wholeMark = true;//不成功条件成立，置true
                        }
                    }
                });
            })
    }   
 
//获取页面信息，自动填写--针对用户返回“上一级”的情况
function fnSplit(){
     var str = document.referrer;
     arr = str.split("/");

     return (arr[arr.length-1])?arr[arr.length-1]:"";
}

var target = fnSplit();

if (target === "memRecharge.html") {
    /*从支付页面跳转，则自动补填之前的信息*/
    var _objInfo = JSON.parse(fnGetStorage("objInfo"));

    $("#remote").attr('checked', 'checked');
    $(".remoteNum").val(_objInfo.remoteNum);
    $(".remoteName").val(_objInfo.remoteName);

    $("#tutor").attr('checked', 'checked');
    $(".tutorNum").val(_objInfo.tutorNum);
    $(".tutorName").val(_objInfo.tutorName);

}


//btn-send点击变色效果
fnSkip("#send",'opacity','0.5','1');

//获取登录证明
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$(".remoteNum").on('input', function(event) {
    event.preventDefault();
    var value = $(this).val();
    var obj = $(".remoteName");

    if (value.length == 8) {

        fnQuery(value,obj);
    }
});

$(".tutorNum").on('input', function(event) {

    event.preventDefault();
    var value = $(this).val();
    var obj = $(".tutorName");

    if (value.length == 8) {

        fnQuery(value,obj);
    }
});


//请求会员信息
function fnQuery(num,obj){
    $.ajax({
        url: _url + _getMemberName,
        type: 'POST',
        dataType: 'json',
        data:  {
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "number":num,
            "mark":"wpage"
        }
    })
        .done(function(result) {

            //请求状态
            if (result.revertCode != 0) {
                $(".info").html(result.statusHint);
                fnInfo();
                return;//不继续往下执行了，结果码那个不再执行。
            }

            //请求结果
            if (result.statusCode == 0) {//结果码
                //数据不为空时执行
                if (result.data) {
                    var _data = result.data[0];

                    obj.val(_data.userName);
                }
            }else {
                $(".info").html(result.statusHint);
                fnInfo();
                return;
            }
        })
}

//请求会员信息
$.ajax({
    url: _url + _getMemberInfo,
    type: 'POST',
    dataType: 'json',
    data:  {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    }
})
    .done(function(result) {

        //请求状态
        if (result.revertCode != 0) {
            $(".info").html(result.statusHint);
            fnInfo();
            return;//不继续往下执行了，结果码那个不再执行。
        }

        //请求结果
        if (result.statusCode == 0) {//结果码
            //数据不为空时执行
            if (result.data) {
                var _data = result.data[0];
                var memberNum = _data.memberNumber;
                var userName = _data.userName;
            }

            //选中“本人”复选框自动填写推荐人-卡号、姓名；辅导人-卡号、姓名
            fnFill("#remote",".remoteNum",".remoteName",memberNum,userName);
            fnFill("#tutor",".tutorNum",".tutorName",memberNum,userName);

        }else {
            $(".info").html(result.statusHint);
            fnInfo();
            return;
        }
    });


//点击“发送”按钮，校验信息
$("#send").on('click', function(event) {
    //获取信息
    var remoteNum = $(".remoteNum").val();
    var remoteName = $(".remoteName").val();
    var tutorNum = $(".tutorNum").val();
    var tutorName = $(".tutorName").val();

    if (!remoteNum || !remoteNum || !remoteNum || !remoteNum) {
        $(".info").html("推荐人会员号、姓名，辅导人卡号、姓名以及受邀人号码均不能为空！");
        //动态显示，1.5s后消失
        fnInfo();
    }else {//求情判断推荐人、辅导人账号合法性
        //第一次请求，获取模、公钥
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
                modulus = result.modulus;
                exponent = result.publicExponent;
                sessionId = result.sessionId;

                //提交参数
                var map = {
                    "accessKey":accessKey,
                    "dynamicKey":dynamicKey,
                    "introducerMemberNumber":remoteNum,
                    "manamentMemberNumber":tutorNum,
                    "mark":"wpage"
                };
                var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);
                //第二次请求：判断推荐人、辅导人合法性
                $.ajax({
                    url: _url + _judgeAffiliation,
                    data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                    type:"post",
                    async: false,
                    success: function(result){
                        var obj_data = $.parseJSON(result);

                        if (obj_data.revertCode != 0) {
                            alert(obj_data.statusHint);
                            return;//不继续往下执行了，结果码那个不再执行。
                        }

                        if (obj_data.statusCode == 0) {//结果码
                            //推荐人、辅导人账号正确，唤出pwdModal模态框
                            $("#pwdModal").modal("toggle");

                            var _data = obj_data.data[0];
                            //保存数据：nodeId
                            fnSetStorage("nodeId",_data.nodeId);
                            
                        }else {
                            alert(obj_data.statusHint);
                        }
                    }
                });
            })
    }
});


//密码模态框“确认”按钮点击请求判断密码正确性
$("#btn_submit").on('click', function(event) {
    //将推荐人会员号与辅导人会员号写入storage,用于从支付页面跳转回来自动补填
    var _objInfo = {
        remoteNum: $(".remoteNum").val(),
        remoteName: $(".remoteName").val(),
        tutorNum: $(".tutorNum").val(),
        tutorName: $(".tutorName").val()
    }

    fnSetStorage("objInfo",JSON.stringify(_objInfo));

    //获取密码
    var pwd = $("#loginPwd").val();
    var password = $.md5(hex_sha512($.md5(pwd)));

    //第一次请求，获取模、公钥
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
            modulus = result.modulus;
            exponent = result.publicExponent;
            sessionId = result.sessionId;

            //提交参数
            var map = {
                "accessKey":accessKey,
                "dynamicKey":dynamicKey,
                "password":password,
                "mark":"wpage"
            };
            var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);
            //第二次请求：检验密码的正确性
            $.ajax({
                url: _url + _judgeMemberPwd,
                data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                type:"post",
                async: false,
                success: function(data){
                    var obj_data = $.parseJSON(data);
                    /*console.log(obj_data);*/

                    if (obj_data.revertCode != 0) {
                        alert(obj_data.statusHint);
                        return;//不继续往下执行了，结果码那个不再执行。
                    }

                    if (obj_data.statusCode == 0) {//结果码

                        //关闭pwdModal 密码模态框
                        $("#loginPwd").val("");
                        $("#pwdModal").modal("toggle");

                        //跳转支付页面--未完成
                        window.location.href = "memRecharge.html";
                    }else {
                        alert(obj_data.statusHint);
                    }
                }
            });
        })
});

    // //获取页面信息，自动填写--针对用户返回“上一级”的情况
function fnSplit(){
    var str = document.referrer;
    arr = str.split("/");

    return (arr[arr.length-1])?arr[arr.length-1]:"";
}

var target = fnSplit();

if (target === "userRecharge.html" || target ==="improveData.html") {

    var _objInfo = JSON.parse(fnGetStorage("objInfo"));

    $(".remoteNum").val(_objInfo.remoteNum);
    $(".remoteName").val(_objInfo.remoteName);
    $(".tutorNum").val(_objInfo.tutorNum);
    $(".tutorName").val(_objInfo.tutorName);
}

//btn-send点击变色效果
fnSkip("#send",'opacity','0.5','1');

//获取登录证明
var accessKey = fnGetCookie("accessKey");
var dynamicKey = fnGetCookie("dynamicKey");

//手动输入完会员号后自动填写姓名
//推荐人
$(".remoteNum").on('input', function(event) {
    if ($(this).val().length == 8) {
        var number = $(this).val();
        fnGetMemberName(accessKey,dynamicKey,".remoteName",number)
    };
});
//辅导人
$(".tutorNum").on('input', function(event) {
    if ($(this).val().length == 8) {
        var number = $(this).val();
        fnGetMemberName(accessKey,dynamicKey,".tutorName",number)
    }
});

//点击“发送”按钮，校验信息
$("#send").on('click', function(event) {

    /*清除 improveData 系列内容*/
    var store = window.localStorage;
    if (store) {
        store.removeItem("memberInfo");
    }

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
                "accessKey": accessKey,
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
                        var _data = obj_data.data[0];

                        if (obj_data.revertCode != 0) {
                            alert(obj_data.statusHint);
                            return;//不继续往下执行了，结果码那个不再执行。
                        }

                        if (obj_data.statusCode == 0) {//结果码
                            //推荐人、辅导人账号正确，唤出pwdModal模态框
                            $("#pwdModal").modal("toggle");

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
    //将推荐人会员号与辅导人会员号写入storage,
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
            //验证密码
            $.ajax({
                url: _url + _judgeUserPwd,
                data:{"mark":"wpage","ciphertext":ciphertext,"sessionId":sessionId},
                type:"post",
                async: false,
                success: function(data){
                    /*console.log(data);*/
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

                        //跳转 非会员--improveData.html,会员--userRecharge.html
                        var _isMember = fnGetCookie("isMember");
                        // console.log(_isMember)

                        if (_isMember == "1") {
                            window.location.href = "userRecharge.html";
                        }else{
                            window.location.href = "improveData.html";
                        }


                    }else {
                        alert(obj_data.statusHint);
                    }
                }
            });
        })
});
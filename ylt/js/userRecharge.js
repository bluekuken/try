
    //btn-send点击变色效果
fnSkip("#send",'opacity','0.5','1');

/*请求充值套餐*/
//获取登录证明
var accessKey = fnGetCookie("accessKey");
var dynamicKey = fnGetCookie("dynamicKey");
var oIP = returnCitySN["cip"];
var finalData;

$.ajax({
    url: _url + _getSetMealList,
    data: {
        "dynamicKey":dynamicKey,
        "accessKey": accessKey,
        "mark":"wpage"
    },
    type:"post",
    async: false,
    success: function(data){
        // console.log(data)
        var obj_data = $.parseJSON(data);

        if (obj_data.revertCode != 0) {
            alert(obj_data.statusHint);
            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (obj_data.statusCode == 0) {//结果码
            var _data = obj_data.data;
            var tempStr = "";

            tempStr += '\
	        				<div class="item">\
	        					<input id="payment" type="radio" checked="checked">\
	        					<label for="payment">'+ _data[0].rechargeMoney +'元</label>\
	        					<span>'+ _data[0].rechargeName +'</span>\
	        				</div>';

            $("#selection").append(tempStr);
        }else {
            alert(obj_data.statusHint);
        }
    }
});

/*填写推荐人信息*/
/*发起人*/
var nodeId = "";
var invitationName = "";
var introducerName = "";

//可以通过接口获取-发起人-邀请人。if-扫描进来的，则直接读取cookie获取tutorInfo(invitationName,introducerName),else-ajax请求
//获取上一页url，判断来源
function fnSplit(){
    var str = document.referrer;
    arr = str.split("/");

    return (arr[arr.length-1])?arr[arr.length-1]:"";
}

var target = fnSplit();

if (target == "rechargeWay.html") {
    //如果是扫描页进来的则从localStorage获取
    var tutorInfo = JSON.parse(fnGetStorage("tutorInfo"));

    invitationName = tutorInfo.invitationName;
    introducerName = tutorInfo.introducerName;
    nodeId = tutorInfo.nodeId;

}else {
    //如果不是扫描页进来的则重新请求
    nodeId = fnGetStorage("nodeId");
    //请求推荐人、发起人
    $.ajax({
        url: _url + _getMemberName,
        type: 'post',
        dataType: 'json',
        async : false,
        data: {
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "nodeId":nodeId,
            "mark":"wpage"
        }
    })
        .done(function(result) {
            var _data = result.data[0];

            invitationName = _data.invitationName;
            introducerName = _data.introducerName;
        })
};


if (invitationName) {
    var str = "";
    str += '\
				<div class="item">\
					<em>发起人:</em>\
					<span id="promoter">'+ invitationName +'</span>\
				</div>';

    $("#remote").before(str);
}

$("#referee").html(introducerName);

/*点击“确认支付”则判断“发起人姓名”是否空，如果是则弹出模态框填写，并写入页面，然后跳到支付功能*/
$("#send").on('click', function(event) {

    //如果没有发起人姓名，则弹出模态框填写
    if ( !invitationName) {
        //唤出模态框
        $("#myModal").modal("toggle");
    }else {
        fnMypay();
    }
});

//模态框“确定”按钮
$("#btn_submit").on('click', function(event) {
    var value = $("#name").val();

    if (value) {
        //写入用户名
        $.ajax({
            url: _url + _editUserInfo,
            type: 'post',
            dataType: 'json',
            async : false,
            data: {
                "accessKey": accessKey,
                "dynamicKey": dynamicKey,
                "userName":value,
                "mark":"wpage"
            }
        })
            .done(function(result) {

                if (result.revertCode != 0) {
                    alert(result.statusHint);
                    return;//不继续往下执行了，结果码那个不再执行。
                }

                if (result.statusCode == 0) {//结果码
                    $("#myModal").modal("toggle");
                    fnMypay();
                }
            })        
    }
});



function fnMypay() {
    /*发起请求，生成支付订单,唤起支付*/
    //获取登录证明
    var accessKey = fnGetCookie("accessKey");

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

            var dynamicKey = fnGetCookie("dynamicKey");

            /*请求支付订单*/
            //提交参数
            var map = {
                "accessKey":accessKey,
                "dynamicKey":dynamicKey,
                "nodeId":nodeId,
                "body":"single",
                "rechargeId":"1",
                "spbillCreateIp": oIP,
                "mark":"wpage"
            };
            var ciphertext = RSAUtils.createCiphertext(map,exponent,modulus);
            //请求订单
            $.ajax({
                url: _url + _wechatPayment,
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
                        finalData = obj_data.data[0];

                        wx.config({
                              debug: false,
                              appId: finalData.appId,
                              timestamp: finalData.timestamp,
                              nonceStr: finalData.noncestr,
                              signature: finalData.signature,
                              jsApiList: ['chooseWXPay']
                        });

                        wx.ready(function () {
                            wx.chooseWXPay({
                                timestamp: finalData.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                                nonceStr: finalData.noncestr, // 支付签名随机串，不长于 32 位
                                package: 'prepay_id='+finalData.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                                paySign: finalData.sign, // 支付签名
                                success: function (res) {
                                    // 支付成功后的回调函数
                                    window.location.replace("userMine.html");
                                    
                                    // /*支付成功，将会员信息提交数据库，并且清除“完善资料"所写的localStorage*/
                                    var memberInfo = JSON.parse(fnGetStorage("memberInfo"));

                                    if (memberInfo && memberInfo.mark) {
                                        //请求
                                        $.ajax({
                                            url: _url + _editMemberInfo,
                                            type: 'POST',
                                            dataType: 'JSON',
                                            data: {
                                                "accessKey": accessKey,
                                                "dynamicKey": dynamicKey,
                                                "userName": memberInfo.userName,//用户名
                                                "idCard": memberInfo.idCardNum,//身份证,
                                                "email": memberInfo.email,//邮箱
                                                "bankId": memberInfo.bankId,//银行类别-id
                                                "bankAccount": memberInfo.bankNum,//银行账号
                                                "accountName": memberInfo.owner,//账户名
                                                "provinceId": memberInfo.location_code[0],//省份
                                                "cityId": memberInfo.location_code[1],//城市
                                                "countyId": memberInfo.location_code[2],//县区
                                                "address": memberInfo.address,//地址
                                                "mark":"wpage"
                                            }
                                        })
                                            .done(function(result) {
                                                /*清除 improveData 系列内容*/
                                                var store = window.localStorage;
                                                if (store) {
                                                    store.removeItem("memberInfo");
                                                }
                                            });
                                    };
                                }
                            });
                        })

                    }else {
                        alert(obj_data.statusHint);
                    }
                }
            });
        })
}
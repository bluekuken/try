$("#logout").on('click', function(event) {
    event.preventDefault();
    //退出登录，清除cookie

    fnSetCookie('starttime_m',"",0);
    fnSetCookie('accessKey_m',"",0);
    fnSetCookie('dynamicKey_m',"",0);
    fnSetCookie('_memberNum',"",0);

    window.location.href = "userMine.html";
});


//获取登录key
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");

$.ajax({
    url: _url + _getMemberInfo,
    data:{
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    },
    type:"post",
    async: false,
    success: function(data){
        var obj_data = $.parseJSON(data);
        // console.log(obj_data);


        if (obj_data.revertCode != 0) {
            $(".out .info").html(obj_data.statusHint);
            //动态显示，1.5s后消失
            fnInfo();

            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (obj_data.statusCode == 0) {//结果码

            var _data = obj_data.data[0];
            var bankId = _data.bankId;

            if (bankId) {

                //请求银行列表
                var banks = "";
                $.ajax({
                    url: _url + _getBankList,
                    data:{
                        "accessKey": accessKey,
                        "dynamicKey": dynamicKey,
                        "mark":"wpage"
                    },
                    type:"post",
                    async: false,
                    success: function(data){
                        var bank_data = $.parseJSON(data);
                        banks = bank_data.data;
                    }
                });
                //请求银行列表——end

                var num = bankId - 1;
                var bankType = banks[num].bankName;
            }

            var _message = "";
            _message += '\
	        				<div class="detail_box">\
	        					<div class="detail_mail">\
	        						<em>志愿者名</em><span>'+ ((_data.userName)?_data.userName:"") +'</span>\
	        					</div>\
	        					<div class="detail_mail detail_num">\
	        						<em>志愿者号</em><span>'+ ((_data.memberNumber)?_data.memberNumber:"") +'</span>\
	        					</div>\
	        					<div class="detail_mail detail_num">\
	        						<em>级别</em><span>'+ ((_data.rank)?_data.rank:"") +'</span>\
	        					</div>\
	        				</div>\
	        				<div class="detail_box">\
	        					<div class="detail_mail idcard">\
	        						<em>身份证号</em><div><span>'+ ((_data.idCard)?_data.idCard:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        					<div class="detail_mail detail_num banktype">\
	        						<em>银行类别</em><div><span>'+ ((bankType)?bankType:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        					<div class="detail_mail detail_num bankline">\
	        						<em>分支行</em><div><span>'+ ((_data.branchBank)?_data.branchBank:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        					<div class="detail_mail detail_num bankcard">\
	        						<em>银行账户</em><div><span>'+ ((_data.bankAccount)?_data.bankAccount:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        					<div class="detail_mail detail_num accountName">\
	        						<em>开户名</em><div><span>'+ ((_data.accountName)?_data.accountName:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        					<div class="detail_mail detail_num note">\
	        						<em>备注</em><div><span>'+ ((_data.note)?_data.note:"") +'</span><img src="images/shuru_icon.png" alt=""></div>\
	        					</div>\
	        				</div>';

            //拿到请求结果后构造html，写入页面
            $("#logout").before(_message);

            fnSkip(".idcard","backgroundColor","#C4C4C4","#fff","resetIdcard_m.html");
            fnSkip(".banktype","backgroundColor","#C4C4C4","#fff","resetBank_m.html");
            fnSkip(".bankline","backgroundColor","#C4C4C4","#fff","resetBranchline_m.html");
            fnSkip(".bankcard","backgroundColor","#C4C4C4","#fff","resetBankaccount_m.html");
            fnSkip(".accountName","backgroundColor","#C4C4C4","#fff","resetAccountname_m.html");
            fnSkip(".note","backgroundColor","#C4C4C4","#fff","resetNote_m.html");
            fnSkip("#logout","opacity","0.5","1");

        }else {
            $(".out .info").html(obj_data.statusHint);
            //动态显示，1.5s后消失
            fnInfo();
        }
    }
});
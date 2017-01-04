function fnSetStorage(key,value){
    var store = window.localStorage;
    if (store) {
        store.setItem(key,value);
    }
}

function fnGetStorage(key){
	var store = window.localStorage;
	if (store) {
	 	return store.getItem(key);
	 }
}

// js设置cookie
//js里面没有专门的api读取或者设置cookie，需要自己写
//必须在服务器下执行才会生效，因为cookie是有服务器操作的
/*
 *函数名：fnSetCookies
 *功能：设置cookie,用于登录、登录超时判断
 */
function fnSetCookie(key,value,expires){
    //expires过期时间
    var date = new Date();
    date.setDate(date.getDate() + expires);

    //cookie的格式：key=value;expires=GMT_String
    document.cookie = key + '=' + value + ((expires==null)?"":";expires=" + date.toGMTString());
}


/*
 *函数名：fnGetCookie
 *功能：根据cookie的key获取对应的value
*/
function fnGetCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
}

/*删除全部cookie*/
function clearCookie(){ 
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
    if (keys) { 
        for (var i = keys.length; i--;) 
        document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString() 
    } 
} 



/*
 *函数名：fnChangeColor
 *功能：按钮效果，点击变色（长按保持，松手恢复原来的颜色）
 */

function fnChangeColor(father,child,attr,value1,value2,url){
	var url = url || "";
	$(father).delegate(child,'touchstart', function(event) {
		$(this).css(attr, value1);
	});
	$(father).delegate(child,'touchend', function(event) {
		$(this).css(attr, value2);
		if (url) {
			window.location.href = url;
		}
	});
}

/*针对 memberMine.html item太多需要滑动的情况。其他点击变色也可使用此方法，也仍可沿用 fnChangeColor 。但是如果出现需要上下滚动则需要用fnSkip*/
function fnSkip(target,attr,value1,value2,url){

	$(target).on({
		touchstart: function(e){
			temp = url;			
		    $(this).css(attr, value1);
		},
		touchmove: function(){
		    //滑动
		    $(this).css(attr, value2);
		    // return false; 
		    temp = "";
		},
		touchend: function(){
			$(this).css(attr, value2);
			if (temp) {
				window.location.href = temp;
			}
		}
	})
}



/*
函数名：fnFill
功能：自动填写信息
使用范围：推荐志愿者——志愿者
*/
function fnFill(selector,num,name,val1,val2) {
	$(selector).on('change', function(event) {		
		if ($(this).prop("checked")) {
			$(num).val(val1);
			$(num).attr('disabled', 'true');
			$(name).val(val2);
			$(name).attr('disabled', 'true');
		}else{
			$(num).val("");
			$(num).removeAttr('disabled');
			$(name).val("");
			$(name).removeAttr('disabled');			
		}
	});
}

/*
函数名：fnInfo
功能：显示提示信息
使用范围：全部页面
*/
function fnInfo(url) {
	var url = url || "";
	$(".content .out").css('opacity', '1');
	setTimeout(function () {
		$(".content .out").css('opacity', '0');
		if (url) {
			window.location.href = url;			
		};

	}, 1500);
}

/*
函数名：fnGetMemberName
功能：根据会员号获取对应的姓名
使用范围：自我充值
*/
// //请求会员信息
function fnGetMemberName(accessKey,dynamicKey,target,num) {
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
				var userName = _data.userName;
				$(target).val(userName);
				return;
			}

		}else {
		    $(".info").html(result.statusHint);
		    fnInfo();
		    return;
		}
	})
}

/*接口数据*/
//根目录
var _url = "http://120.76.242.163:8888/paysys/";
// var _url = "http://elian.cc/paysys/";

//普通用户
//1、用户-用户注册
var _registerUser = "muser/registerUser";

//2、 用户找回密码
var _retrieveUserPwd = "muser/retrieveUserPwd";

//3、用户-用户登录
var _loginUser = "muser/loginUser";

//4、用户-获取个人信息
var _getUserInfo = "muser/getUserInfo";

//5、用户-修改密码
var _editUserPwd = "muser/editUserPwd";

//6.用户修改个人信息
var _editUserInfo = "muser/editUserInfo";

//7、用户-判断是否为会员
var _isMember = "muser/judgeIsMember";

//8、用户-根据手机号获取姓名
var _getUserName = "muser/getUserName";

//9、用户-检测用户密码
var _judgeUserPwd = "muser/judgeUserPwd";


//会员
//10、志愿者-志愿者登录
var _loginMember = "member/loginMember";

//11、志愿者-获取个人信息
var _getMemberInfo = "member/getMemberInfo";

//12、志愿者-修改志愿者密码
var _editMemberPwd = "member/editMemberPwd";

//13、志愿者-修改志愿者信息
var _editMemberInfo = "member/editMemberInfo";

//14、志愿者-根据志愿者号获取姓名
var _getMemberName = "member/getMemberName";

//15、志愿者-获取银行列表
var _getBankList = "index/getBankList";

//16、志愿者-志愿者充值套餐列表
var _getSetMealList = "index/getSetMealList";

//17、志愿者-检测志愿者密码
var _judgeMemberPwd = "member/judgeMemberPwd";

//18、志愿者-判断推荐人、辅导人卡号是否正确
var _judgeAffiliation = "mpay/judgeAffiliation";

//20、志愿者-生成支付订单
var _wechatPayment = "mpay/wechatPayment";

//21、志愿者-查看个人账户
var _getAccountInfo = "maccount/getAccountInfo";

//22、志愿者-回去app更新推送内容
var _getPushContent = "mhome/getPushContent";

//23、我的小伙伴
var _getLowerMemberList = "member/getLowerMemberList";

//24、志愿者-根据志愿者号获取业绩
var _getAchievement = "maccount/getAchievement";

//25、志愿者-获取流水资金和总收入
var _getBillDetailsList = "maccount/getBillDetailsList";

//26、用户-根据用户获取单号列表
var _getUserNumberList = "maccount/getUserNumberList";

//27、志愿者-根据志愿者账号获取详细信息
var _getMemberByNumber = "member/getMemberByNumber";

//28、志愿者-获取小伙伴的叶子
var _getLastLowerMembers = "member/getLastLowerMembers";

//29、志愿者-获取各个分支的业绩明细
var _getBranchAchievement = "maccount/getBranchAchievement";

//30、志愿者-根据志愿者号获取资金明细
var _getFinancialDetails = "maccount/getFinancialDetails";

//31、用户-志愿者-获取邀请记录列表
var _getRecommendLog = "index/getRecommendLog";

//32、用户-注册发送验证码
var _sendRegisterCode = "mhome/sendRegisterCode";

//33、提现--公众号未实现
var _withdrawDeposit = "mpay/withdrawDeposit";

//34、网页授权
var _webAuthorization = "mpay/webAuthorization";

//获取公钥（登录或注册）
var _getPublicKeyToRegister = "mhome/getPublicKeyToRegister";

//获取公钥（已登录）
var _getPublicKey = "mhome/getPublicKey";
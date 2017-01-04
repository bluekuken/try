
var fillMemInfo = JSON.parse(fnGetStorage("memberInfo"));
$("#bankType").val(fillMemInfo.bankName);

$(".send-btn").attr('disabled', 'disabled');

//获取到cookie
var accessKey=fnGetCookie("accessKey");
var dynamicKey=fnGetCookie("dynamicKey");

$(".bank_number input").on('input', function(event) {
    var bankName = $("#bankType").val();
    var owner = $("#owner").val();
    var idCardNum = $("#idCardNum").val();

    if (bankName && owner && idCardNum) {
        $(".send-btn").css('backgroundColor','#44BB5C').removeAttr('disabled');
    }else{
        $(".send-btn").css('backgroundColor','#ccc').attr('disabled','disabled');
    }
});

$(".send-btn").on('click', function(event) {
    //检验身份证--未完成
    //点击改变背景颜色
    var idcard = $("#idCardNum").val();
    //校验身份证合法性
    var bo=/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(idcard);
    var year = idcard. substr(6,4);
    var month = idcard. substr(10,2);
    var day = idcard. substr(12,2);

    if(bo==false||month>12||day>31){
        $("#idCardNum").focus();

        $(".out .info").html("请输入正确的身份证号码！");
        //动态显示，1.5s后消失
        fnInfo();
        return false;
    }

    window.location.href = "userRecharge.html";

    var owner = $("#owner").val();
    var idCardNum = $("#idCardNum").val();

    var fillMemInfo = JSON.parse(fnGetStorage("memberInfo"));
    fillMemInfo.owner = owner;
    fillMemInfo.idCardNum = idCardNum;
    fillMemInfo.mark = true;

    fnSetStorage("memberInfo",JSON.stringify(fillMemInfo));
});
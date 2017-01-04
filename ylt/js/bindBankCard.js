    //btn-send点击变色效果
fnSkip(".next-btn",'opacity','0.5','1');
//获取页面信息，自动填写--针对用户返回“上一级”的情况
function fnSplit(){
    var str = document.referrer;
    arr = str.split("/");

    return (arr[arr.length-1])?arr[arr.length-1]:"";
}

var target = fnSplit();

if (target === "bankMessage.html" || target === "improveData.html") {
    //自动填写
    var fillMemInfo = JSON.parse(fnGetStorage("memberInfo"));
    $(".china").val(fillMemInfo.bankName);
    $(".bank_number input").val(fillMemInfo.bankNum);

    $(".next-btn").css('backgroundColor', '#44BB5C').removeAttr('disabled');
    $(".next-btn").onclick = function(){
        window.location.href = "bankMessage.html";
    }
}else{
    //信息没有完整时，“下一步”按钮不可用
    $(".next-btn").css('backgroundColor', '#ccc').attr('disabled', 'disabled');
}

//获取到cookie
var accessKey=fnGetCookie("accessKey");
var dynamicKey=fnGetCookie("dynamicKey");

//获取银行列表
$.ajax({
    url: _url + _getBankList,
    type: 'post',
    dataType: 'json',
    async : false,
    data: {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    }
})
    .done(function(result) {

        if (result.revertCode != 0) {
            $(".out .info").html(result.statusHint);
            //动态显示，1.5s后消失
            fnInfo();

            return;//不继续往下执行了，结果码那个不再执行。
        }

        if (result.statusCode == 0) {//结果码
            for(var i=0;i<result.data.length;i++){

                var target=result.data[i];
                var _divs="";

                _divs+='<div>'+ ((target.bankName != null)?target.bankName: "" ) +'</div>';
                $(".modal-content>.modal-body").append(_divs);
            }

            //点击弹出银行列表(模态框)
            $(".content_mail").click(function(){
                $("#myModal").modal('toggle');
            });

        }else{
            $(".out .info").html(result.statusHint);
            fnInfo();
        }
    });




var _index="";//选择银行类别ID
var _span="";//获取模态框中选中的银行名称
var _bankId="";//传到后台的id

$(".modal-content>.modal-body>div").click(function(){
    //因为接口的bankId是从1开始的，所以要加1
    _index=$(this).index()+1;

    //点击变换颜色
    fnSkip('.modal-body>div','backgroundColor',"rgba(200,200,202,0.5)",'#fff');

    /*console.log(_index);*/
    _span = $(this).html();
    //把当前银行的值赋值到文本里
    $(".content_mail>.china").val(_span);
    $("#myModal").modal('toggle');
});

//“next-btn”的可用性检测
$(".content input").on('input', function(event) {
    var bankName = $(".china").val();
    var bankNum = $(".bank_number input").val();

    if (bankNum && bankName) {
        $(".next-btn").removeAttr('disabled').css('backgroundColor', ' #44BB5C');
        fnSkip('.next-btn','opacity',"0.6",'1');
    }
});

$(".bank_number input").on('input', function(event) {
    $("#length").css({"opacity":"0","transition":1000});
});

//为按钮btn绑定click事件
$(".content .next-btn").click(function(){

    //如果模态框的银行的值有效，说明用户点击了模态框
    if(_span){
        //
        _bankId = _index;
    }else{
        _bankId = 1;
    }

    //校验卡号的合法性
    var value = $(".bank_number input").val();

    //简单检验 卡号小于10位 提示
    if (value.length < 10) {
        $("#length").css({"opacity":"1","transition":1000});
        $(".content input").focus();

        return false;
    }

    window.location.href = "bankMessage.html";

    //保存现有信息，提供用户返回上一步是获取自动填写
    var bankName = $(".china").val();
    var bankNum = $(".bank_number input").val();

    var fillMemInfo = JSON.parse(fnGetStorage("memberInfo"));

    fillMemInfo.bankName = bankName;
    fillMemInfo.bankNum = bankNum;
    fillMemInfo.bankId = _bankId;

    fnSetStorage("memberInfo",JSON.stringify(fillMemInfo));
});
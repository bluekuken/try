//用户充值信息
var memberInfo = {}

//获取页面信息，自动填写--针对用户返回“上一级”的情况
function fnSplit(){
    var str = document.referrer;
    arr = str.split("/");

    return (arr[arr.length-1])?arr[arr.length-1]:"";
}

var target = fnSplit();

if (target === "bindBankCard.html") {
    //自动填写
    var fillMemInfo = JSON.parse(fnGetStorage("memberInfo"));

    $("#userName").val(fillMemInfo.userName);
    $("#email").val(fillMemInfo.email);
    $("#location").val(fillMemInfo.location);
    $("#address").val(fillMemInfo.address);

    $("#next").css('backgroundColor', '#44BB5C').removeAttr('disabled');
    $("next").onclick = function(){
        window.location.href = "bindBankCard.html";
    }
}else{
    //信息没有完整时，“下一步”按钮不可用
    $("#next").attr('disabled', 'disabled');
}

/*为“所在地”绑定click事件，弹出模态框选择城市*/
$(".region").click(function(){
    $("#myModal").modal("toggle");
});

//数组变量 cityCodeArr ,记录选中的地址代码
var cityCodeArr = new Array();

//地址选择框--确定--获取城市代号与名称
$("#btn_sure").on('click', function(event) {

    var collection = $(".title").children('span');
    var address = "";

    if (collection.length) {
        $("#btn_sure").removeAttr('disabled');

        for(var i = 0; i < collection.length; i++){
            //地址城市代号
            cityCodeArr.push($(collection[i]).attr("data-code")) ;
            address += $(collection[i]).html();
        }

        $("#location").val(address);
        $("#myModal").modal("toggle");

        memberInfo.location_code = cityCodeArr;
    }
});


/*邮箱合法性校验--1--start*/
$("#email").on('input', function(event) {
    $("#geshi").css({"opacity":"0","transition":1000});
});

/*邮箱合法性校验--end*/

/*校验详细地址--1--start*/
$("#address").on('input', function(event) {
    $("#length").css({"opacity":"0","transition":1000});
});
/*校验详细地址--end*/

//btn-send点击变色效果
fnSkip("#jump",'opacity','0.5','1');
fnSkip("#next",'opacity','0.5','1');
/*按钮事件*/
//跳过填写信息，以后再 “修改” 页面填写
$("#jump").click(function(){
    $("#jumpModal").modal("toggle");
});

//全部输入完整后 启用 “下一步” 按钮
$(".item input").on('input', function(event) {

    var userName = $("#userName").val();
    var email = $("#email").val();
    var location = $("#location").val();
    var address = $("#address").val();

    if (userName && email && location  && address) {
        $("#next").css('backgroundColor', '#44BB5C').removeAttr('disabled');
    }else{
        $("#next").css('backgroundColor', '#ccc').attr('disabled', 'disabled');
    }
});


/*点击“下一步”按钮校验*/
$("#next").on('click', function(event) {
    var emailMark = false;
    var addressMark = false;

    // function(){
    /*检验邮箱--2*/
    var email = $("#email").val();

    if(email != ""){
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!email.match(filter)){
            //如果 email 格式不对，则不能填写下一项，并显示提示信息“格式不对”
            $("#geshi").css({"opacity":"1","transition":1000});
            $("#email").focus();

            return false;
        }else{
            //写对后 隐藏提示信息 “格式不对”
            $("#geshi").css({"opacity":"0","transition":1000});

            emailMark = true;
        }
    }

    /*检验详细地址--2*/
    var address = $("#address").val();

    if (address.length < 5) {
        $("#address").focus();
        $("#length").css({"opacity":"1","transition":1000});
    }else{
        //写对后 隐藏提示信息 “格式不对”
        $("#length").css({"opacity":"0","transition":1000});

        addressMark = true;
    }

    if (emailMark && addressMark) {
        window.location.href = "bindBankCard.html";
    }

    //保存现有信息，提供用户返回上一步是获取自动填写
    var userName = $("#userName").val();
    var location = $("#location").val();

    memberInfo.userName = userName;
    memberInfo.email = email;
    memberInfo.location = location;
    memberInfo.address = address;

    fnSetStorage("memberInfo",JSON.stringify(memberInfo));

});

/*跳过*/
$("#yes").on('click', function(event) {
    window.location.href = "userRecharge.html";
});
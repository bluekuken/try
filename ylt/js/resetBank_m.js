
fnSkip('.exit-btn','backgroundColor',"rgba(68,187,92,0.5)",'#44BB5C');

//获取到cookie
var accessKey=fnGetCookie("accessKey_m");
var dynamicKey=fnGetCookie("dynamicKey_m");

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
        /*console.log(result);*/
        $(".content_mail>.china").html(result.data[0].bankName);
        for(var i=0;i<result.data.length;i++){

            var target=result.data[i];
            var _divs="";

            _divs+='<div>'+ ((target.bankName != null)?target.bankName: "" ) +'</div>';
            $(".modal-content>.modal-body").append(_divs);
        }
    });

//点击弹出银行列表(模态框)
$(".content_mail").click(function(){
    $("#myModal").modal('toggle');
});
//选择银行类别ID
var _index="";

//获取到模态框银行名称
var _span="";

//传到后台的id
var _bankId="";

$(".modal-content>.modal-body>div").click(function(){
    //因为接口的bankId是从1开始的，所以要加1
    _index=$(this).index()+1;

    //点击变换颜色
    fnSkip('.modal-body>div','backgroundColor',"rgba(200,200,202,0.5)",'#fff');

    /*console.log(_index);*/
    _span=this.innerHTML;
    //把当前银行的值赋值到文本里
    $(".content_mail>.china").html(this.innerHTML);
    $("#myModal").modal('toggle');
});

//为按钮btn绑定click事件
$(".content .exit-btn").click(function(){
    //如果模态框的银行的值有效，说明用户点击了模态框
    if(_span){
        //
        _bankId=_index;
    }else{
        _bankId=1;
    }

    $.ajax({
        url: _url + _editMemberInfo,
        type: 'post',
        dataType: 'json',
        async : false,
        data: {
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "bankId":_bankId,
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
                $(".out .info").html(result.statusHint);
                fnInfo("memberInfo.html");
            }else{
                $(".out .info").html(result.statusHint);
                fnInfo();
            }
        });

});
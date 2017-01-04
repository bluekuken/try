
fnSkip("#yes",'backgroundColor',"#ddd",'#fff');
fnSkip("#no",'backgroundColor',"#ddd",'#fff');



$("#yes").click(function(){
    window.location.href="memberLogin_bill.html"
});
$("#no").click(function(){
    $("#myModal").modal('toggle');
});

//获取到cookie
var accessKey=fnGetCookie("accessKey");
var dynamicKey=fnGetCookie("dynamicKey");

$.ajax({
    url: _url + _getUserNumberList,
    type: 'POST',
    dataType: 'JSON',
    data: {
        "accessKey": accessKey,
        "dynamicKey": dynamicKey,
        "mark":"wpage"
    }
})
    .done(function(result) {
        var data = result.data;

        for(var i = 0; i < data.length; i++) {
            var message="";
            message += '\
                    <div class="col-xs-12 item">\
                        <div class="col-xs-3" style="padding: 0;">' + data[i].memberName + '</div>\
                        <div class="col-xs-3 memNum" style="padding: 0;">' + data[i].memberNumber + '</div>\
                        <div class="col-xs-3" style="padding: 0;">' + data[i].createDate + '</div>\
                        <div class="col-xs-3 note" style="padding: 0;">' + data[i].note + '</div>\
                    </div>';
            $("#vol_message").append(message);

            fnSkip('.item','backgroundColor',"#FBBF23",'#fff');
        }

        //点击弹出银行列表(模态框)
        $(".item").click(function(){
            $("#myModal").modal('toggle');

            //写入志愿者账号，跳转 memberLogin.html 后自动获取并填写
            var _memNum = $(this).find('.memNum').html();
            fnSetCookie("_volunteerAccount",_memNum);

        });
    });
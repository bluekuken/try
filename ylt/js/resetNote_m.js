
//获取到cookie
var accessKey=fnGetCookie("accessKey_m");
var dynamicKey=fnGetCookie("dynamicKey_m");


var _note=$(".content_mail>input");
//获取到按钮
var btn=$(".content .exit-btn");
//一开始禁用按钮
btn.attr("disabled","true");

_note.on("input",function(){
    var note=_note.val();
    //console.log(this)
    if($(this).val() != ""){//判断value值是否为空
        btn.removeAttr("disabled");
        //改变背景颜色
        //btn变背景颜色
        btn.css("background-color","#44BB5C");
        fnSkip('.exit-btn','backgroundColor',"rgba(68,187,92,0.5)",'#44BB5C');
    }else{
        btn.attr("disabled",true);
        fnSkip( '.exit-btn', 'opacity', "1", '1');
        btn.css("background-color","#D0D0D0");
    }
});

//为按钮btn绑定click事件
btn.click(function(){
    var note=_note.val();
    $.ajax({
        url: _url + _editMemberInfo,
        type: 'POST',
        dataType: 'JSON',
        data: {
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "note":note,
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

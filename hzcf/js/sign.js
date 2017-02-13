$(".btn_code").click(function(event) {
    var count_time = 5;
    fnCountTime($(this),count_time);
});
//获取验证码-倒计时函数 fnCountTime
function fnCountTime(obj,time) {

    if (time == 0) {
        obj.css('backgroundColor', '#EE8F00');
        obj.text("发送验证码");
        obj.removeAttr("disabled");
    }else {
        obj.css('backgroundColor', '#ccc');
        obj.attr('disabled', 'true');
        time--;
        obj.text("发送验证码("+time+"s)");

        setTimeout(function() {
                fnCountTime(obj,time)
        },1000);
    }
}


    /*主菜单切换*/
    $(".item").on('touchstart', function(event) {
        //选中状态的按钮置默认
        var src_old = "../images/" + $(".selected").find("img").attr('name') + ".png";
        $(".selected").find("img").attr('src', src_old);
        $(this).siblings().removeClass('selected');

        //当前点击的按钮变色
        var src_new = "../images/" + $(this).find("img").attr('name') + "1.png";
        $(this).find("img").attr('src', src_new);
        $(this).addClass('selected');
    });
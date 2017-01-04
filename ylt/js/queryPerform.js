fnSkip(".exit-btn","opacity",".5","1");
// //检测到未登录则提示
if (fnGetCookie("accessKey_m")) {

    var memberNum=fnGetCookie("_memberNum");
    $("#memberNum").val(memberNum);
    // 	//获取当前日期

    // jQuery的选择器居然不能使用这个属性
    document.getElementById('start').valueAsDate = new Date();
    document.getElementById('end').valueAsDate = new Date();



    $(".content .exit-btn").click(function(){
        var start=$("#start").val();
        var end=$("#end").val();

        if (start <= end) {
            //设置查询日期，在查询页面获取然后查询
            fnSetCookie("_dataEnd",end);
            fnSetCookie("_dataStart",start);

            window.location.href="achieveDetail.html";
        }else{
            $(".info").html("结束日期不能小于开始日期！");
            //动态显示，1.5s后消失
            fnInfo();
        }
    });
}else{
    $(".info").html("请重新登录后查询！");
    //动态显示，1.5s后消失
    fnInfo();
}


$("#start").on('click', function(event) {
    $(this).attr('type', 'date');
});
//接收推送按钮
var pushMark = false;
$(".butn_push").on('click', function(event) {
    event.preventDefault();

    if (pushMark) {
        $(this).css('backgroundColor', '#C0FFC0');
        $(this).text("ON");
    }else{
        $(this).text("OFF");
        $(this).css({
            'backgroundColor': '#fff',
            "borderColor": '#ccc'
        });
    }

    pushMark = !pushMark;
});
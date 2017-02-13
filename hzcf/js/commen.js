//模拟按钮点击效果
//对默认按钮 defaultBtn 使用
$(".defaultBtn").on('touchstart', function(event) {
  	$(this).css('opacity', '0.5');
});
$(".defaultBtn").on('touchmove', function(event) {
  	$(this).css('opacity', '1');
});
$(".defaultBtn").on('touchend', function(event) {
  	$(this).css('opacity', '1');
});

//fnSkip函数
// 参数解释：target:选择器类名，attr：点击时变化的属性，value1：点击时样式，value2：松手时样式，url：点击跳转的页面
function fnSkip(target,attr,value1,value2,url){
	$(target).on({
		touchstart: function(e){
			temp = url;			
		    $(this).css(attr, value1);
		},
		touchmove: function(){
		    //滑动
		    $(this).css(attr, value2);
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
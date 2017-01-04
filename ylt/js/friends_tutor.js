//获取登录key、志愿者号
var accessKey = fnGetCookie("accessKey_m");
var dynamicKey = fnGetCookie("dynamicKey_m");
var memNum = fnGetCookie("_memberNum");

if (!accessKey) {
    var info = "";
    info += '\
		<div class="out">\
			<div class="info"></div>\
		</div>';

    $(".content").append(info);
    $(".out .info").html("请先登录！");
    //动态显示，1.5s后消失
    fnInfo();
}else{

    //请求数据
    $.ajax({
        url: _url + _getLowerMemberList,
        data:{
            "accessKey": accessKey,
            "dynamicKey": dynamicKey,
            "style":"introducer",
            "mark":"wpage"
        },
        type:"post",
        async: false,
        success: function(data){
            var obj_data = $.parseJSON(data);
            var _data = obj_data.data;
            var memList = new Array();//同层数据集
            var showList = new Array();//展示数据集

            if (obj_data.revertCode != 0) {
                var info = "";
                info += '\
		        	<div class="out">\
		        		<div class="info"></div>\
		        	</div>';

                $(".content").append(info);

                $(".out .info").html(obj_data.statusHint);
                //动态显示，1.5s后消失
                fnInfo();
                return;//不继续往下执行了，结果码那个不再执行。
            }

            if (obj_data.statusCode == 0) {//结果码

                //构造同层集合，根据target(树形)数据构造同级数据
                function fnMemList(target,num){
                    num++;
                    for( i in target) {
                        var obj = new Object();

                        obj.isopen = false;//是否展开，默认否
                        obj.hasson = target[i].hasson;
                        obj.introducerName = target[i].introducerName;
                        obj.introducerNum = target[i].introducerNum;
                        obj.manamentName = target[i].manamentName;
                        obj.manamentNum = target[i].manamentNum;
                        obj.name = target[i].name;
                        obj.note = target[i].note;
                        obj.number = target[i].number;
                        obj.paterId = target[i].paterId;
                        obj.totalCoun = target[i].totalCoun;
                        obj.layer = num;//层级，区分所属层级关系

                        memList.push(obj);

                        if (target[i].hasson) {
                            fnMemList(target[i].data,num)
                        }
                    }
                }

                fnMemList(_data,"0");
                fnShowList();

                //构造显示数据集showList
                function fnShowList(){
                    for(i in memList){
                        if (memList[i].layer == 1) {
                            showList.push(memList[i]);
                        }
                    }
                }


                //初始化显示页面（第一次）
                function fnInnit(cacheMemList){
                    for(i in cacheMemList) {

                        if (cacheMemList[i].hasson) {
                            var showStyle = '<i class="icon-plus-sign"></i>';
                        }else{
                            var showStyle = '<i></i>';
                        }
                        var _detail = "";
                        _detail += '\
				        			<div class="item item_first"> '+ showStyle +'\
						        		<em>'+ cacheMemList[i].layer +'</em>\
						        		<span>'+ cacheMemList[i].name + '('+ cacheMemList[i].number + ')' +'</span>\
						        		<div class="fr">\
						        			<strong>总辅导单数：</strong>\
						        			<small>'+ cacheMemList[i].totalCoun +'</small>\
						        		</div>\
						        	</div>';

                        $(".content").append(_detail);
                    }
                }

                fnInnit(showList);

                //点击事件
                function fnClick(){
                    $(".content .item").on('click', function(event) {
                        var num = $(this).index();
                        var memNum = showList[num].number;
                        var arr = new Array();
                        var count = 0;

                        if (showList[num].isopen) {
                            //收起
                            for( i in memList ) {
                                if (memList[i].paterId == memNum) {
                                    //统计二级对象的个数（在展示集合里面）
                                    count++;
                                    //二级对象，用于遍历叶子节点
                                    arr.push(memList[i]);
                                }
                            }
                            //统计叶子节点
                            for(i in arr){
                                if (arr[i].isopen && arr[i].hasson) {

                                    var _num = arr[i].number;
                                    for(j in memList){
                                        if (memList[j].paterId == _num) {
                                            //统计叶子节点+二级对象的个数（在展示集合里面）
                                            count++;
                                        }
                                    }
                                }

                                //重置为“收起”状态
                                arr[i].isopen = false;
                            }

                            //删除点击对象的全部后代，实现“收起”状态
                            showList.splice(num+1, count);
                        }else{
                            //展开
                            for(i in memList){
                                if (memList[i].paterId == memNum) {
                                    showList.splice(num+1,0,memList[i]);
                                }
                            }
                        }

                        //重置状态(收起或展开)
                        showList[num].isopen = !showList[num].isopen;

                        $(".content").html("");

                        fnShowHtml(showList);

                        fnClick();
                        fnPress();
                    });
                }

                fnClick();
                fnPress();


                //长按事件
                function fnPress(){
                    var timeout;

                    $(".content .item").delegate($(".content .item").children(), 'touchstart', function(event) {
                        var self = $(this);
                        timeout = setTimeout(function() {
                            var num = self.index();

                            var modal = "";

                            modal += '\
		        			   	<div id="infoModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		        			   		<div class="modal-dialog">\
		        			   		    <div class="modal-content">\
		        			   			    <div class="modal-header" style="padding: 0">'+ showList[num].name +'</div>\
		        			   			    <div class="modal-body">\
		        			   		     		<div><span>推荐志愿者姓名：</span><em>'+ showList[num].introducerName +'</em></div>\
		        			   		     		<div><span>推荐志愿者账号：</span><em>'+ showList[num].introducerNum +'</em></div>\
		        			   		     		<div><span>辅导志愿者姓名：</span><em>'+ showList[num].manamentName +'</em></div>\
		        			   		     		<div><span>辅导志愿者账号：</span><em>'+ showList[num].manamentNum +'</em></div>\
		        			   			    </div>\
		        			   		    </div>\
		        			   	    </div>\
		        			   	</div>';

                            $(".content").append(modal);
                            $("#infoModal").modal();

                        }, 500);
                    });


                    $(".content .item").delegate($(".content .item").children(), 'touchend', function(event) {
                        if (timeout) {
                            clearTimeout(timeout);
                        }
                    });
                }

                //展示页面
                function fnShowHtml(cacheMemList){
                    for(i in cacheMemList){
                        if(!cacheMemList[i].hasson){
                            //没有后代没有符号
                            var showStyle = '<i></i>';
                        }else if (cacheMemList[i].isopen) {
                            //有后代且展开的话是 减号
                            var showStyle = '<i class="icon-minus-sign"></i>';
                        }else{
                            //有后代且收起的话是 加号
                            var showStyle = '<i class="icon-plus-sign"></i>';
                        }

                        //判断第几层实现缩进
                        switch(cacheMemList[i].layer){
                            case 1: {var item = '<div class="item item_first">';break}
                            case 2: {var item = '<div class="item item_second">';break}
                            case 3: {var item = '<div class="item item_third">';break}
                        }

                        var _detail = item + showStyle;

                        _detail += '\
									<em>'+ cacheMemList[i].layer +'</em>\
			        					<span>'+ cacheMemList[i].name + '('+ cacheMemList[i].number + ')' +'</span>\
			        					<div class="fr">\
			        						<strong>总辅导单数：</strong>\
			        						<small>'+ cacheMemList[i].totalCoun +'</small>\
			        					</div>\
			        				</div>';

                        $(".content").append(_detail);
                    }
                }

                //查询功能
                $("#query").on('input', function(event) {
                    var value = $(this).val();
                    var tempArr = new Array();

                    fnQuery(value,_data);
                    //查询，拿到最初树形data
                    function fnQuery(value,target){
                        if (value) {
                            for( i in target ){

                                var mark_num = (target[i].number.indexOf(value) >= 0)?true:false;
                                var mark_name = (target[i].name.indexOf(value) >= 0)?true:false;

                                if (mark_name ||  mark_num) {
                                    tempArr.push(target[i]);
                                }
                                else if (target[i].hasson) {
                                    fnQuery(value,target[i].data);
                                }
                            }
                        }else{
                            tempArr = _data;
                        }
                    }

                    console.log(tempArr)
                    if (tempArr.length) {
                        //查询得到的树形data
                        //1 构造同层集合 memList
                        memList = [];
                        fnMemList(tempArr,"0");

                        //2 构造展示集合 showList
                        showList = [];
                        fnShowList();

                        $(".content").html("");
                        fnShowHtml(showList);
                        fnClick();
                        fnPress();
                    }else{
                        $(".content").html("");

                        var info = "";
                        info += '\
							<div class="out">\
								<div class="info"></div>\
							</div>';

                        $(".content").append(info);

                        $(".out .info").html("查不到相关数据！");
                        //动态显示，1.5s后消失
                        fnInfo();
                    }

                });

            }else{
                var info = "";
                info += '\
		        	<div class="out">\
		        		<div class="info"></div>\
		        	</div>';

                $(".content").append(info);

                $(".out .info").html(obj_data.statusHint);
                //动态显示，1.5s后消失
                fnInfo();
                return;//不继续往下执行了，结果码那个不再执行。
            }
        }
    })
};


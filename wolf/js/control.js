window.onload = function(){

	//点击开始
	var oScore = document.getElementById('score');
	var oStart = document.getElementById('start');
	var time_pro = null;
	var time_move = null;
	var time_autoMove = null;
	var num_wolf;
	var lv_first = true;//第一阶段，上下冒头
	var lv_second = false;
	var num = 0;//用于图片左右移动以实现上下冒头运动
	var mark = true;//小灰标志，false为大灰
	var flag = null;

	var wolfs = document.getElementsByTagName('img');
	//判断标志：当前是否有图，false默认为无。


	//进度条
	var step = 180;
	var oInner = document.getElementById('inner');

	oStart.onmousemove = function(){
		oStart.style.color = 'white';
		oStart.style.fontSize = '60' + 'px';
		oStart.style.left = '40' + 'px';
	}

	oStart.onmouseout = function(){
		oStart.style.color = '#537990';
		oStart.style.fontSize = '50' + 'px';
		oStart.style.left = '60' + 'px';
	}

	oStart.onclick = function(){
		oStart.style.display = 'none';
		time_pro = setInterval(myProgress, 200);
		
		fnWolf();
	}


	//进度条、开始，结束
	function myProgress(){
		step--;
		oInner.style.width = step + 'px';
		if (step == 0) {
			step = 0;
			oInner.style.width = 0 + 'px';
			clearInterval(time_pro);//停止计时
			oStart.innerText = 'GameOver';
			oStart.style.fontSize = '40' + 'px';
			oStart.style.color = 'white';
			oStart.style.display = 'block';
			oStart.onmousemove = null;
			oStart.onmouseout = null;
			oStart.onclick = null;
			fnScore = null;
		};
	}


	//随机冒头
	function fnWolf(){
		//随机生成一个0~8的随机数，指定第几个冒头
		num_wolf = Math.floor(Math.random()*9);
		fnBigSmall();

		wolfs[num_wolf].style.display = 'block';


		//添加敲打积分函数
		for (var i = 0; i < wolfs.length; i++) {
			wolfs[i].onclick = fnScore;
		};

		if (time_move) {
			clearInterval(time_move);
			time_move = null;
		};

		//轮播实现上下运动
		time_move = setInterval(fnMove, 80);
		time_autoMove = setTimeout(fnWolf, 1300);
	}

	//冒头运动
	function fnMove(){

		if (lv_second) {
			if (num > 9) {
				num = 0;
				wolfs[num_wolf].style.display = 'none';
				lv_second = false;
			};
			wolfs[num_wolf].style.left = -108*num + 'px';
			num++;
		}else {
			if (lv_first) {
				//如果没到最顶就继续往上冒
				num++;
				if (num > 5) {
					num = 5;
					lv_first = false;
				};
				wolfs[num_wolf].style.left = -108*num + 'px';
			}else {
				//如果到最顶就开始往下降
				num--;
				if (num < 0) {
					num = 0;
					lv_first = true;
					wolfs[num_wolf].style.display = 'none';
					clearInterval(time_move);
				}
				wolfs[num_wolf].style.left = -108*num + 'px';
			};
		};
	}

	//确定大小灰函数
	function fnBigSmall(){
		var num = Math.floor(Math.random()*100 + 1);
		if(num % 2 == 0){
			mark = true;
		}else {
			mark = false;
		}

		if(mark){
			wolfs[num_wolf].src = 'images/x.png';
			flag = false;
		}else {
			wolfs[num_wolf].src = 'images/h.png';
			flag = true;
		}
	}

	//计分函数
	function fnScore(){
		if (flag) {
			oScore.innerText = eval(oScore.innerText) + 10;
		}else {
			oScore.innerText = eval(oScore.innerText) - 10;
		};

		this.onclick = null;

		num = 6;
		lv_second = true;
	}


}


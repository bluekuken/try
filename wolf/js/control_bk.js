window.onload = function(){

	//点击开始
	var oStart = document.getElementById('start');
	var oProgress = document.getElementById('oProgress');
	var time = null;


	//进度条
	var step = 180;
	var oInner = document.getElementById('inner');

	//分数
	var oScord = document.getElementById('scord');


	//冒头
	var mark;//标记冒出的是“小灰灰”还是“灰太狼”，true——小灰灰，false——灰太狼


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
		oScord.style.display = 'display';

		time = setInterval(myProgress, 100);

		time3 = setInterval(myHead,500);

	}


	//进度条、开始，结束
	function myProgress(){
		step--;
		oInner.style.width = step + 'px';
		if (step == 0) {
			oInner.style.width = 0 + 'px';
			clearInterval(time);
			oStart.innerText = 'GameOver';
			oStart.style.fontSize = '40' + 'px';
			oStart.style.color = 'white';
			oStart.style.display = 'block';
			oStart.onmousemove = null;
			oStart.onmouseout = null;
			oStart.onclick = null;
		};
	}


	//随机冒头部分
	var oWolfs = document.getElementsByTagName('img');
	var num2 = 0;//照片下标控制冒头,从第0张图片开始，到第五张图片循环第0张
	var flag = true;
	var num3;
	


	//设置判断标记 mark，确定冒出是“小灰灰”还是“灰太狼”，true为小灰灰，false为灰太狼
	function myHead(){
		var num1 = Math.floor(Math.random() * 100 + 1);//获取1到100的随机数，奇数将判断为“小灰灰”，偶数判断为“灰太狼”
		num3 = Math.floor(Math.random() * 9);//获取随机数0-8，判定哪一个孔冒头

		if (num1 % 2 == 1) {
			//小灰灰
			mark = true;
		}else {
			//灰太狼
			mark = false;
		};

		
		time2 = setInterval(autoMove, 150);
	}

	function autoMove(){
		if (mark) {//小灰灰
			oWolfs[num3].src ='images/x' + num2 + '.png';
			oWolfs[num3].style.display = 'block';
		}else{//灰太狼
			oWolfs[num3].src ='images/h' + num2 + '.png';
			oWolfs[num3].style.display = 'block';
		}
		
		if (flag) {//升到最顶（第五张）就暂停500毫秒，然后降回去
			if (num2 == 5) {
				flag = false;
				clearInterval(time2);
				setTimeout(clock, 500)
			};
			num2++;
		}else{
			num2--;
			if (num2 == 0) {
				flag = true;
				oWolfs[num3].style.display = 'none';
				clearInterval(time2);
			};

		}
	}

	function clock(){
		num2--;
		time2 = setInterval(autoMove, 150);
	}












}
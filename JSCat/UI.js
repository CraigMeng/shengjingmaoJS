
var bgImage = new Image();
bgImage.src = "./Image/bg.jpg";
var grayCircle = new Image();
grayCircle.src = "./Image/pot1.png";
var orangeCircle = new Image();
orangeCircle.src = "./Image/pot2.png";
var cat = new Image();
cat.src = "./Image/stay.png";
var resourceCount = 0;
bgImage.onload = function() {
	context.drawImage(bgImage, 0, 0,480,800);
	//resourceCount++;
};

grayCircle.onload = function() {
	setTimeout(function(){
		loadMap();
	},300);
};

var intervalID = null; // 间隔调用的ID

function loadMap() {
	// 首先生成随机的堵截点
	generateRandPoint(MapArray);
	// 开始加载地图
	//while (!bgLoaded){}
	
    //loadCircle();
	//loadCat(current.x,current.y,240);
	intervalID = setInterval(reload, 80);
}
function generateRandPoint(array) {
	if (array instanceof Array) {
		var checkSet = [];
		// 随机生成12~18个堵截点
		var blockCount = Math.floor(Math.random() *7 + 12);
		for (var count = 0; count < blockCount; count++) {
			var randPoint = Math.floor(Math.random() * 81 + 1);
			while (checkSet.some(function(x) {
				return x == randPoint
			}) || randPoint == 41) {
				randPoint = Math.floor(Math.random() * 81 + 1);
			}
			checkSet.push(randPoint);
			var row = Math.floor(randPoint / 9);
			if (row == 9)
				row = 8;
			var col = randPoint % 9;
			if (col == 0)
				col = 8;
			else
				col -= 1;
			array[row][col] = 1;
		}
	}
}
function loadCircle() {
/*	var width1 = 15;
  for (var raw = 0; raw < 9; raw++) {
  	context.drawImage(grayCircle,width1,240);
  	width1+=48;
  }
  var width2 = 37;
  for (var col = 0; col < 9; col++) {
  	context.drawImage(orangeCircle,width2,285);
  	width2+=48;
  }*/
  var height = 240;
  for (var raw = 0; raw < 9; raw++) {
  	if (raw % 2 == 0)
  		var width = 15;
  	else 
  		var width = 37;
  	for (var col = 0; col<9;col++) {
  		if (MapArray[raw][col] == 0)
  			context.drawImage(grayCircle,width,height+45*raw);
  		else
  			context.drawImage(orangeCircle,width,height+45*raw);
  		width+=48;
  	}
  }
}

function getCatPosition() {
	// 坐标变换
	var y = current.x;
	var x = current.y;
	var bottom = 240 + 45 * y + 23;
	var pointy = bottom - 100;

	// 计算猫的左边缘
	if (y % 2 == 0)
		var width = 15;
	else
		var width = 37;
	var left = width + 48 * x - 10;
	return {x:left, y:pointy};
}
/*
* 根据传入的横坐标x和纵坐标y加载猫
*/
function loadCat() {
	// 首先计算出图片的加载位置
	// 猫的底边
	var position = getCatPosition();
	context.drawImage(cat, res[catStatus].x, res[catStatus].y, res[catStatus].w, res[catStatus].h, position.x, position.y, 61, 100);
	if (catStatus == 15)
		catStatus = 0;
	else
		catStatus += 1;
	/*if (arguments.length == 3) {
		var bottom = height + 45 * y + 23;
		var pointy = bottom - 100;

		// 计算猫的左边缘
		if (y % 2 == 0)
			var width = 15;
		else
			var width = 37;
		var left = width + 48 * x - 10;
		//context.drawImage(cat, 122, 93, 61, 93, left, pointy, 61, 100);
		context.drawImage(cat,res[catStatus].x,res[catStatus].y,res[catStatus].w,res[catStatus].h,left,pointy,61,100);
		if (catStatus == 15)
			catStatus = 0;
		else
			catStatus +=1;
		return {x:left, y:pointy};
	}
	else {
		// 猫扭动的动画
		// arguments.length == 2, 即只给出了花猫的位置
		context.drawImage(cat,res[catStatus].x,res[catStatus].y,res[catStatus].w,res[catStatus].h,arguments[0],arguments[1],61,100);
		if (catStatus == 15)
			catStatus = 0;
		else
			catStatus +=1;
	}*/
}

/*
* 根据传入的坐标，获得是哪一个圆被点击了
* 如果不在点击范围内，那么就返回{-1，-1}
*/
function getWhichCircleClicked(x,y) {
	if (y < 240 || y > 240 +  45*9)
		return {x: -1, y: -1};
	// 根据y判断出是哪一行
	y = y - 240;
	y = y - y%45;
	y = y / 45;
	// 这里获得的y已经是以0位索引开始的了
	if (y % 2 == 0){
		// 是奇数行
		if (x < 15 || x > 15 + 48*9)
			return {x:-1, y:-1};
		x = x - 15;
	}
	else {
		if (x < 37 || x > 37 + 48*9)
			return {x:-1, y:-1};
		x = x - 37;
	}
	x = x - x%48;
	x = x / 48;
	return {x:x, y:y};
}

function setBlock(x,y) {
	MapArray[y][x] = 1;
}

/*
* 重画
*/
function reload() {
	context.drawImage(bgImage, 0, 0,480,800);
	loadCircle();
	loadCat();
}
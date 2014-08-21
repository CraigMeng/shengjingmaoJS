
var clickHandler = function(event) {
	clearInterval(intervalID);
	intervalID = null;
	var x, y;

	if (event.layerX || event.layerX == 0) {

		x = event.layerX;

		y = event.layerY;

	} else if (event.offsetX || event.offsetX == 0) { // Opera

		x = event.offsetX;

		y = event.offsetY;

	}
	//alert(event.layerX+" "+event.layerY);
	var NodeIndex = getWhichCircleClicked(x,y);
	if (NodeIndex.x == -1)
		return;
	//alert(NodeIndex.x+" "+NodeIndex.y);
	//alert("你点击了"+(NodeIndex.x+1)+" "+(NodeIndex.y+1));
	setBlock(NodeIndex.x, NodeIndex.y); // 这里的x指的是横坐标，对应到数组中代表column，y对应raw
	// 由于坐标和矩阵中的坐标相反，所以这里做一下变换
	var pointX = NodeIndex.y;
	var pointY = NodeIndex.x;
	move();
	
	//reload();
};
var mCanvas = document.getElementById("gameArea");
// 为canvas注册事件
mCanvas.addEventListener("click",clickHandler,false);

function move() {
	var nextStep = getNextStep(current);
	if (nextStep.length == 0) {
		gameOver(false);
		return;
	}
	var minstep = -1;
	var minIndex = -1;
	for (var index = 0; index < nextStep.length; index++) {
		var path = new Array();
		path.push(current);
		var step = getMinStep(nextStep[index], current, path);
		if (step != -1 && (minstep == -1 || minstep > step)) {
			minstep = step;
			minIndex = index;
		}
	}
	if (minstep == -1) {
		gameOver(false);
		return;
	}
	current.x = nextStep[minIndex].x;
	current.y = nextStep[minIndex].y;

	if (current.x == 0 || current.x ==8 || current.y == 0
		|| current.y == 8) {
		gameOver(true);
		return;
	}
	intervalID = setInterval(reload,80);
}

function getNextStep(point) {
	var nextStepList = new Array();
	var nextstep = getNext6Step(point);
	for (var i = 0; i < nextstep.length; i++) {
		if (getValue(nextstep[i]) == 0)
			nextStepList.push(nextstep[i]);
	}
	return nextStepList;
}

function getNext6Step(point) {
	var array = new Array(6);
	if (point.x % 2 == 0) {
		array[0] = {x: point.x-1, y: point.y-1};
		array[1] = {x: point.x-1, y: point.y};
		array[2] = {x: point.x, y: point.y+1};
		array[3] = {x: point.x+1, y: point.y};
		array[4] = {x: point.x+1, y: point.y-1};
		array[5] = {x: point.x, y: point.y-1};
	}
	else {
		array[0] = {x: point.x-1, y: point.y};
		array[1] = {x: point.x-1, y: point.y+1};
		array[2] = {x: point.x, y: point.y+1};
		array[3] = {x: point.x+1, y: point.y+1};
		array[4] = {x: point.x+1, y: point.y};
		array[5] = {x: point.x, y: point.y-1};
	}
	return array;
}

function getValue(point) {
	if (point.x < 0 || point.x > 8)
		return 1;
	if (point.y < 0 || point.y > 8)
		return 1;
	return MapArray[point.x][point.y];
}

function getNextStepWithPrev(point, previous) {
	var result = new Array(3);
	if (previous.x == point.x && previous.y < point.y) {
		result[0] = 2;
		result[1] = 3;
		result[2] = 4;
		return result;
	}
	if (previous.x == point.x && previous.y > point.y) {
		result[0] = 1;
		result[1] = 5;
		result[2] = 6;
		return result;
	}
	if (previous.x % 2 == 0) {
		if (previous.x > point.x && previous.y > point.y) {
			result[0] = 1;
			result[1] = 2;
			result[2] = 6;	
		}
		else if (previous.x > point.x && previous.y == point.y) {
			result[0] = 1;
			result[1] = 2;
			result[2] = 3;
		}
		else if (previous.x < point.x && previous.y == point.y) {
			result[0] = 3;
			result[1] = 4;
			result[2] = 5;
		}
		else {
			result[0] = 4;
			result[1] = 5;
			result[2] = 6;
		}
	}
	else {
		if (previous.x > point.x && previous.y == point.y) {
			result[0] = 1;
			result[1] = 2;
			result[2] = 6;
		}
		else if (previous.x > point.x && previous.y < point.y) {
			// 右上角  1 2 3
			result[0] = 1;
			result[1] = 2;
			result[2] = 3;
		}
		else if (previous.x < point.x && previous.y < point.y) {
			// 右下角 3 4 5
			result[0] = 3;
			result[1] = 4;
			result[2] = 5;
		}
		else {
			// previous.x < point.x && previous.y == point.y
			// 左下角 4 5 6
			result[0] = 4;
			result[1] = 5;
			result[2] = 6;
		}
	}
	return result;
}

function getMinStep (point, previous, path) {
	if (point.x == 0 || point.x == 8 || point.y == 0
		|| point.y == 8)
		return 0;
	path.push(point);
	var nextStepList = new Array();
	var nextstep = getNext6Step(point);
	if (previous == null) {
		for (var i = 0; i < nextstep.length; i++) {
			if (getValue(nextstep[i]) == 0 && !path.some(function(p){
				if (p.x == nextstep[i].x && p.y == nextstep[i].y)
					return true;
				else
					return false;
			}))
				nextStepList.push(nextstep[i]);
		}
	}
	else {
		var nodeIndex = getNextStepWithPrev(point, previous);
		for (var i = 0; i < nodeIndex.length; i++) {
			if (getValue(nextstep[nodeIndex[i]-1]) == 0 &&
				!path.some(function(p){
					if (p.x == nextstep[nodeIndex[i]-1].x && p.y == nextstep[nodeIndex[i]-1].y)
						return true;
					else
						return false;
				}))
				nextStepList.push(nextstep[nodeIndex[i]-1]);
		}
	}
	var minStep = -1;
	for (var index = 0; index < nextStepList.length; index++) {
		var distance = -1;
		if ((distance = getMinStep(nextStepList[index],point,path)) != -1) {
			distance +=1;
			if (minStep == -1 || minStep > distance)
				minStep = distance;
		}
	}
	path.pop();
	return minStep;
}

function gameOver(losed) {
	if (losed) {
		// 输了
		alert("你输啦 QAQ");
	}
	else {
		// 赢了
		alert("你赢啦 ^_^");
	}
	// 重载游戏
	for (var index = 0; index < MapArray.length; index++) {
    	MapArray[index] = new Array(9);
      for (var i = 0; i < 9; i++) {
        MapArray[index][i] = 0;
      }
    }
    current.x = 4;
    current.y = 4;
    clearInterval(intervalID);
    loadMap();
}
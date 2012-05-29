/**
 * @author Administrator
 */

var ChineseChess={};	
(function(chess){
	
	//棋盘横线偏移
	var hOffset = [80,116,152,186,222,257,292,327,362,398];
	//棋盘纵线偏移
	var vOffset = [20,55,90,125,160,195,230,265,300];

	
	var RED = 0, BLACK = 1;
	var GO = 0, BEAT = 1;
	
	var redPieces = [], blackPieces = [];
	var redJiang,blackJiang;
	
	var Piece = function(xCoor,yCoor,type){	
		this.xCoor = xCoor;
		this.yCoor = yCoor;
		this.type = type;
		this.alive = true;	
		
		this.toeat = null;
		this.savedX = this.xCoor;
		this.saveY = this.yCoor;
	}
	
	Piece.prototype.hasPieceBetweenJiang = function(){
		if(redJiang.xCoor != blackJiang.xCoor) return true;
		var cur, all = chess.pieces, interval = 0;
		for(var i = 0; i < all.length; i++){
			cur = all[i];
			if(!cur.alive || cur.xCoor != redJiang.xCoor) continue;
			var diff1 = cur.yCoor - redJiang.yCoor;
			var diff2 = cur.yCoor - blackJiang.yCoor;
			var mark = diff1 * diff2; 
			if(mark < 0){
				if(interval++ > 0) 
					return true;
			}
		}
		return (interval > 0);
	}
	
	Piece.prototype.getCenterXY = function(opt){
			var posX = opt.posX, posY = opt.posY;
			var xCoor = vOffset[0], yCoor = hOffset[0];
			var i,j;
			for(i = 0; i < vOffset.length; i++){				
				if(Math.abs(vOffset[i] - posX) <= ChineseChess.trans.x){
					break;
				}
			}
			if(i == vOffset.length)
				i--;
				
			for(j = 0; j < hOffset.length; j++){				
				if(Math.abs(hOffset[j] - posY) <= ChineseChess.trans.y){
						break;
				}
			}
			if(j == hOffset.length)
				j--;
				
			return {
				xCoor	:i,
				yCoor	:j,
			}
			
		}
		
		Piece.prototype.objInRightBorder = function(objPos){return true;};
		Piece.prototype.objReachable = function(objPos){return true;};		
		
		Piece.prototype.go = function(opt){
			var objPos = this.getCenterXY(opt);
			var right =  this.objInRightBorder(objPos);
			if(right){			
				 var reachable = this.objReachable(objPos);
				 if(reachable){
				 	this.savedX = this.xCoor;
					this.saveY = this.yCoor;
					
				 	this.xCoor = objPos.xCoor;
				 	this.yCoor = objPos.yCoor;
				 	if(this.hasPieceBetweenJiang()){
				 		if(this.toeat){
				 			this.toeat.alive = false;
				 			this.toeat = null;
				 		} 
				 	}else{
				 		this.xCoor = this.savedX;
						this.yCoor = this.saveY;
						this.toeat = null;
						reachable = false;
				 	}
				 }
				 return reachable;
			}else
				return false;
		};
	
	
	
	var Che = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_che.png' :this.src = 'b_che.png';
	}
	Che.prototype = new Piece();
	Che.prototype.objInRightBorder = function(objPos){
		return (objPos.xCoor == this.xCoor || objPos.yCoor == this.yCoor);
	}
	Che.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;
		//纵向走子
		if(objPos.xCoor == this.xCoor){
			for(var i = 0; reachable && i < all.length; i++){
				p = all[i];
				if(!p.alive || p === this || p.xCoor != this.xCoor) continue;
				//判断p是否在this,和objPos之间
				var diff1 = p.yCoor - this.yCoor;
				var diff2 = p.yCoor - objPos.yCoor;
				var mark = diff1 * diff2; 
				//不在中间
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//待吃子
						reachable = true;
						this.toeat = p;
					} 
				}else{
					reachable = false;
				}			
			}
		}else{
			for(var i = 0; reachable && i < all.length; i++){
				p = all[i];
				if(!p.alive || p === this || p.yCoor != this.yCoor) continue;
				var diff1 = p.xCoor - this.xCoor;
				var diff2 = p.xCoor - objPos.xCoor;
				var mark = diff1 * diff2; 
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//待吃子
						reachable = true;
						this.toeat = p;
					} 
				}else{
					reachable = false;
				}
				
			}
		}
		return reachable;
	}
	
	var Ma = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_ma.png' : this.src = 'b_ma.png';		
	}
	Ma.prototype = new Piece();
	Ma.prototype.objInRightBorder = function(objPos){
		var diffX = Math.abs(objPos.xCoor - this.xCoor);
		var diffY = Math.abs(objPos.yCoor - this.yCoor);
		var bigger, smaller;
		if(diffX > diffY){
			bigger = diffX; smaller = diffY;
		}else{
			bigger = diffY; smaller = diffX;
		}
		var right = (bigger == 2 && bigger/smaller == 2);
		if(right){
			var tripX, triY;
			if(bigger == diffX){
				tripY = this.yCoor;
				if(objPos.xCoor > this.xCoor)
					tripX = this.xCoor + 1;
				else
					tripX = this.xCoor -1;
			}else{
				tripX = this.xCoor;
				if(objPos.yCoor > this.yCoor)
					tripY = this.yCoor + 1;
				else
					tripY = this.yCoor -1;
			}
			
			var p , all = chess.pieces;
			for(var i = 0; i < all.length; i++){
				p = all[i];
				if(p.xCoor == tripX && p.yCoor == tripY)
					return false;
			}
		}else
			return false;
		return true;
	}
	Ma.prototype.objReachable = function(objPos){
		var p , all = chess.pieces, reachable = true;
		for(var i = 0; i < all.length; i++){
			p = all[i];
			if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;
			if(p.type == this.type) reachable = false;
			else{
				//吃子
				reachable = true;
				this.toeat = p;
			} 
			return reachable;	
		}
		return reachable;	
	}
	
	var Xiang = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);		
		this.type == RED ? this.src = 'r_xiang.png' : this.src = 'b_xiang.png';
	}
	Xiang.prototype = new Piece();
	Xiang.prototype.objInRightBorder = function(objPos){
		var right = Math.abs(objPos.xCoor - this.xCoor) == 2 && Math.abs(objPos.yCoor - this.yCoor) == 2;
		if(right && (objPos.xCoor % 2 == 0)){
			if(this.type == RED){				
				return (objPos.yCoor % 2 == 0 && objPos.yCoor <= 4);
			}else{				
				return (objPos.yCoor % 2 == 1 && objPos.yCoor >= 5);
			}
		}
		return false;
	}
	Xiang.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;	
		//先判断中心位置是否有障碍	
		for(var i = 0; i < all.length; i++){
			p = all[i];
			var diffY1 = p.yCoor - this.yCoor;
			var diffY2 = p.yCoor - objPos.yCoor;
			var markY = diffY1 + diffY2;
			
			var diffX1 = p.xCoor - this.xCoor;
			var diffX2 = p.xCoor - objPos.xCoor;
			var markX = diffX1 + diffX2;
			if(markX == 0 && markY == 0){
				reachable = false;
			}			
		}
		if(reachable){
			for(var i = 0; i < all.length; i++){
				p = all[i];
				if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;
				if(p.type == this.type) reachable = false;
				else{
					//吃子
					reachable = true;
					this.toeat = p;
				} 
				return reachable;	
			}
		}		
		return reachable;
	}
	
	var Shi = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_shi.png' : this.src = 'b_shi.png';		
	}
	Shi.prototype = new Piece();
	Shi.prototype.objInRightBorder = function(objPos){
		var right = Math.abs(objPos.xCoor - this.xCoor) == 1 && Math.abs(objPos.yCoor - this.yCoor) == 1;
		if(right && (objPos.xCoor >=3 && objPos.xCoor <= 5)){
			if(this.type == RED){				
				return (objPos.yCoor >=0 && objPos.yCoor <= 2);
			}else{				
				return (objPos.yCoor >= hOffset.length -3 && objPos.yCoor <= hOffset.length - 1);
			}
		}
		return false;
	}
	Shi.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;		
		for(var i = 0; i < all.length; i++){
			p = all[i];
			if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;				
			if(p.type == this.type) reachable = false;
			else{
				//吃子
				reachable = true;
				this.toeat = p;
			} 
			return reachable;	
		}		
		return reachable;
	}
	
	var Jiang = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_jiang.png' : this.src = 'b_jiang.png';		
	}
	Jiang.prototype = new Piece();
	Jiang.prototype.objInRightBorder = function(objPos){
		var diffX = objPos.xCoor - this.xCoor;
		var diffY = objPos.yCoor - this.yCoor;
		if(Math.abs(diffX + diffY) == 1 && diffX * diffY == 0 ){
			if((objPos.xCoor >=3 && objPos.xCoor <= 5)){
				if(this.type == RED){				
					return (objPos.yCoor >=0 && objPos.yCoor <= 2);
				}else{				
					return (objPos.yCoor >= hOffset.length -3 && objPos.yCoor <= hOffset.length - 1);
				}
			}
			return false;
		}	
		return false;	
	}
	Jiang.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;		
		for(var i = 0; i < all.length; i++){
			p = all[i];
			if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;				
			if(p.type == this.type) reachable = false;
			else{
				//吃子
				reachable = true;
				this.toeat = p;
			} 
			return reachable;	
		}		
		return reachable;
	}
	
	var Pao = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_pao.png' : this.src = 'b_pao.png';		
	}
	Pao.prototype = new Piece();
	
	Pao.prototype.objInRightBorder = function(objPos){
		return (objPos.xCoor == this.xCoor || objPos.yCoor == this.yCoor);
	}	
	
	Pao.prototype.objReachable = function(objPos){
		var p , all = chess.pieces, interval = 0;
		var reachable = true;		
		//纵向走子
		if(objPos.xCoor == this.xCoor){
			for(var i = 0; reachable && i < all.length; i++){
				p = all[i];
				if(!p.alive || p === this || p.xCoor != this.xCoor) continue;
				//判断p是否在this,和objPos之间
				var diff1 = p.yCoor - this.yCoor;
				var diff2 = p.yCoor - objPos.yCoor;
				var mark = diff1 * diff2; 
				//不在中间
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//待吃子
						reachable = true;
						this.toeat = p;
					} 
				}else{
					if(interval++ > 1)
						reachable = false;
				}			
			}
		}else{
			for(var i = 0; reachable && i < all.length; i++){
				p = all[i];
				if(!p.alive || p === this || p.yCoor != this.yCoor) continue;
				var diff1 = p.xCoor - this.xCoor;
				var diff2 = p.xCoor - objPos.xCoor;
				var mark = diff1 * diff2; 
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//待吃子
						reachable = true;
						this.toeat = p;
					} 
				}else{
					if(interval++ > 1)
						reachable = false;
				}
				
			}
		}
		if(interval == 1 && !this.toeat) reachable = false;
		return reachable;
	}
	
	var Zu = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_zu.png' : this.src = 'b_zu.png';		
	}	
	Zu.prototype = new Piece();
	
	Zu.prototype.objInRightBorder = function(objPos){
		var right = true;
		if(objPos.xCoor == this.xCoor){			
			this.type == RED && (objPos.yCoor - this.yCoor != 1) && (right = false);
			this.type == BLACK && (objPos.yCoor - this.yCoor != -1) && (right = false);
			return right;
		}else if(objPos.yCoor == this.yCoor){
			this.type == RED && this.yCoor <= 4 && (right = false);
			this.type == BLACK && this.yCoor >= 5 && (right = false);
			return right;
		}
		return false;
	}
	Zu.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;		
		for(var i = 0; i < all.length; i++){
			p = all[i];
			if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;				
			if(p.type == this.type) reachable = false;
			else{
				//吃子
				reachable = true;
				this.toeat = p;
			} 
			return reachable;	
		}		
		return reachable;
	}
	
	var i, xCoor, yCoor,piece;
	var func = [Che, Ma, Xiang, Shi, Jiang, Shi, Xiang, Ma, Che];
	//车马象士帅
	for(i = 0; i < vOffset.length; i++){
		xCoor = i, yCoor = 0;		

		piece = new func[xCoor](xCoor,yCoor,RED);
		redPieces.push(piece);
		
		yCoor = hOffset.length - 1;
		piece = new func[xCoor](xCoor,yCoor,BLACK);
		blackPieces.push(piece);
	}
	redJiang = redPieces[4]; blackJiang = blackPieces[4];	
	//炮
	for(i = 1; i < vOffset.length; i = i + 6){
		xCoor = i, yCoor = 2;	

		piece = new Pao(xCoor,yCoor,RED);
		redPieces.push(piece);
		
		yCoor = hOffset.length - 3;
		piece = new Pao(xCoor,yCoor,BLACK);
		blackPieces.push(piece);
	}
	
	//卒
	for(i = 0; i < vOffset.length; i = i + 2){
		xCoor = i, yCoor = 3;	

		piece = new Zu(xCoor,yCoor,RED);
		redPieces.push(piece);
		
		yCoor = hOffset.length - 4;
		piece = new Zu(xCoor,yCoor,BLACK);

		blackPieces.push(piece);
	}	
	
	chess.pieces = redPieces.concat(blackPieces);
	chess.hOffset = hOffset;
	chess.vOffset = vOffset;
	
	chess.debug = function(log){
		console.log(log);
	}
	
})(ChineseChess);
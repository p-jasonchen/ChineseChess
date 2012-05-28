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
	
	var Piece = function(xCoor,yCoor,type){	
		this.xCoor = xCoor;
		this.yCoor = yCoor;
		this.type = type;
		this.alive = true;	
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
		Piece.prototype.getBothPieces = function(){
			var self , enemy;
			if(this.type == RED){
				self = chess.redPieces;
				enemy = chess.blackPieces;
			}else{
				self = chess.blackPieces;
				enemy = chess.redPieces;
			}
			return {self : self, enemy : enemy};
		};

		
		Piece.prototype.go = function(opt){
			var objPos = this.getCenterXY(opt);
			var right =  this.objInRightBorder(objPos);
			if(right){			
				 var reachable = this.objReachable(objPos);
				 if(reachable){
				 	this.xCoor = objPos.xCoor;
				 	this.yCoor = objPos.yCoor;
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
		var both = this.getBothPieces();
		var self = both.self;
		var enemy = both.enemy;
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
				chess.debug('');
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//吃子
						reachable = true;
						p.alive = false;
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
				chess.debug('');
				if(mark > 0){
					reachable = true;
				}else if(mark == 0){
					if(p.type == this.type) reachable = false;
					else{
						//吃子
						reachable = true;
						p.alive = false;
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
		
	}
	Ma.prototype.objReachable = function(objPos){
		
	}
	
	var Xiang = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);		
		this.type == RED ? this.src = 'r_xiang.png' : this.src = 'b_xiang.png';
	}
	Xiang.prototype = new Piece();
	Xiang.prototype.objInRightBorder = function(objPos){
		
	}
	Xiang.prototype.objReachable = function(objPos){
		var p , all = chess.pieces;
		var reachable = true;		
		for(var i = 0; i < all.length; i++){
			p = all[i];
			if(!p.alive || p === this || p.xCoor != objPos.xCoor || p.yCoor != objPos.yCoor) continue;				
			if(p.type == this.type) reachable = false;
			else{
				//吃子
				reachable = true;
				p.alive = false;
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
				return (objPos.yCoor >=vOffset.length -3 && objPos.yCoor <= vOffset.length -1);
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
				p.alive = false;
			} 
		}		
		return reachable;
	}
	
	var Jiang = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_jiang.png' : this.src = 'b_jiang.png';		
	}
	Jiang.prototype = new Piece();
	Jiang.prototype.objInRightBorder = function(objPos){
		return true;
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
				p.alive = false;
			} 
		}		
		return reachable;
	}
	
	var Pao = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_pao.png' : this.src = 'b_pao.png';		
	}
	Pao.prototype = new Piece();
	Pao.prototype.objInRightBorder = function(objPos){
		
	}
	Pao.prototype.objReachable = function(objPos){
		
	}
	
	var Zu = function(xCoor,yCoor,type){
		Piece.call(this,xCoor,yCoor,type);
		this.type == RED ? this.src = 'r_zu.png' : this.src = 'b_zu.png';		
	}	
	Zu.prototype = new Piece();
	Zu.prototype.objInRightBorder = function(objPos){
		if(objPos.xCoor == this.xCoor){
			var right = true;
			this.type == RED && (objPos.yCoor < this.yCoor) && (right = false);
			this.type == BLACK && (objPos.yCoor > this.yCoor) && (right = false);
			return right;
		}else{
			return objPos.yCoor == this.yCoor;
		}
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
				p.alive = false;
			} 
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
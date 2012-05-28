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
	
	var Piece = function(opt){		
		for(var key in opt){
			this[key] = opt[key];
		}
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
		
		Piece.prototype._objInRightBorder = function(objPos){return true;};
		Piece.prototype._objReachable = function(objPos){return true;};

		
		Piece.prototype.go = function(opt){
			var objPos = this.getCenterXY(opt);
			var right =  this._objInRightBorder(objPos);
			if(right){			
				 var reachable = this._objReachable(objPos);
				 if(reachable){
				 	this.xCoor = objPos.xCoor;
				 	this.yCoor = objPos.yCoor;
				 }
				 return reachable;
			}else
				return false;
		};
	
	
	
	var Che = function(opt){
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_che.png' :this.src = 'b_che.png';
	}
	var p = Che.prototype = new Piece();
	
	var Ma = function(opt){
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_ma.png' : this.src = 'b_ma.png';		
	}
	var p = Ma.prototype = new Piece();
	var Xiang = function(opt){
		Piece.call(this,opt);		
		opt.type == RED ? this.src = 'r_xiang.png' : this.src = 'b_xiang.png';
	}
	var p = Xiang.prototype = new Piece();
	var Shi = function(opt){
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_shi.png' : this.src = 'b_shi.png';		
	}
	var p = Shi.prototype = new Piece();
	var Jiang = function(opt){
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_jiang.png' : this.src = 'b_jiang.png';		
	}
	Jiang.prototype = new Piece();
	var Pao = function(opt){
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_pao.png' : this.src = 'b_pao.png';		
	}
	var p = Pao.prototype = new Piece();
	var Zu = function(opt){
		
		Zu.prototype._isLegalPrivate = function(objPos){
			chess.debug('zu');
			var legal = true, action = GO;			
			if(objPos.xCoor != this.xCoor && objPos.yCoor != this.yCoor)
				legal = false;
			else if(objPos.xCoor != this.xCoor){
				Math.abs(objPos.xCoor - this.xCoor) != 1 && (legal = false);
			}else{
				//纵向走子
				Math.abs(objPos.yCoor - this.yCoor) != 1 && (legal = false);
				if(legal){
					this.type == RED && (objPos.yCoor < this.yCoor) && (legal = false);
					this.type == BLACK && (objPos.yCoor > this.yCoor) && (legal = false);
				}	
			}
				
			return {legal : legal, action : action};	
		}
		
		Piece.call(this,opt);
		opt.type == RED ? this.src = 'r_zu.png' : this.src = 'b_zu.png';		
	}	
	var p = Zu.prototype = new Piece();
	
	
	var i, xCoor, yCoor,piece;
	var func = [Che, Ma, Xiang, Shi, Jiang, Shi, Xiang, Ma, Che];
	//车马象士帅
	for(i = 0; i < vOffset.length; i++){
		xCoor = i, yCoor = 0;		
		piece = new func[xCoor]({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: RED,			
		});
		redPieces.push(piece);
		
		yCoor = hOffset.length - 1;
		piece = new func[xCoor]({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: BLACK,
		});
		
		blackPieces.push(piece);
	}
	//炮
	for(i = 1; i < vOffset.length; i = i + 6){
		xCoor = i, yCoor = 2;	
		piece = new Pao({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: RED,
		});
		redPieces.push(piece);
		
		yCoor = hOffset.length - 3;
		piece = new Pao({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: BLACK,
		});
		blackPieces.push(piece);
	}
	
	//卒
	for(i = 0; i < vOffset.length; i = i + 2){
		xCoor = i, yCoor = 3;	
		piece = new Zu({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: RED,
		});
		redPieces.push(piece);
		
		yCoor = hOffset.length - 4;
		piece = new Zu({
			xCoor	:xCoor,
			yCoor	:yCoor,
			type	: BLACK,
		});
		blackPieces.push(piece);
	}	
	
	chess.pieces = redPieces.concat(blackPieces);
	chess.hOffset = hOffset;
	chess.vOffset = vOffset;
	
	chess.debug = function(log){
		console.log(log);
	}
	
})(ChineseChess);
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
		
		/**
		 * 
		 * @param {Object} goDirKey 判断走子方向的key,如果为xCoor则为纵向，对应的opGoDirKey值为yCoor。
		 * @param {Object} opGoDirKey
		 */
		Piece.prototype.getAdjacent = function(goDirKey, opGoDirKey){
			var cur, opponent, myself;
			if(this.type == RED){
				opponent = blackPieces;
				myself = redPieces;
			}else{
				opponent = redPieces;
				myself = blackPieces;
			}
			//lower表示相对左上位置，greater表示相对右下位置	
			var opLower,opGreater,myLower,myGreater;				
			for(var i = 0; i < opponent.length; i ++){
				cur = opponent[i];
				if(cur.alive && cur !== this && cur[goDirKey] == this[goDirKey]){
					if(cur[opGoDirKey] > this[opGoDirKey]){
						if(!opGreater || cur[opGoDirKey] < opGreater[opGoDirKey] )
							opGreater = cur;
					}else{
						if(!opLower || cur[opGoDirKey] > opLower[opGoDirKey])
							opLower = cur;
					}
				}
			}
			
			for(var i = 0; i < myself.length; i ++){
				cur = myself[i];
				if(cur.alive && cur !== this && cur[goDirKey] == this[goDirKey]){
					if(cur[opGoDirKey] > this[opGoDirKey]){						
						 if(!myGreater || cur[opGoDirKey] < myGreater[opGoDirKey])
							myGreater = cur;
					}else{
						if(!myLower || cur[opGoDirKey] > myLower[opGoDirKey])
							myLower = cur;
					}
				}
			}
			return {opLower: opLower, opGreater: opGreater, myLower: myLower, myGreater: myGreater};
		}
		
		Piece.prototype.isLegalByDirectionPublic = function(objPos, opGoDirKey, adj){
			var opLower = adj.opLower ,opGreater = adj.opGreater ,myLower = adj.myLower, myGreater = adj.myGreater;	
			var legal = true, action = GO;
			//向下走子
			if(objPos[opGoDirKey] > this[opGoDirKey] ){
				if(opGreater && myGreater){
					//自己的子在上方
					if(opGreater[opGoDirKey]  > myGreater[opGoDirKey] ){
						if(objPos[opGoDirKey]  < myGreater[opGoDirKey] ){
							legal = true;
							action = GO;
						}else{
							legal = false;
						}
					}else if(opGreater[opGoDirKey]  < myGreater[opGoDirKey] ){	//自己的子在下方
						if(objPos[opGoDirKey]  < opGreater[opGoDirKey] ){
							legal = true;
							action = GO;
						}else  if(objPos[opGoDirKey]  == opGreater[opGoDirKey] ){
							legal = true;
							action = BEAT;
							opGreater.alive = false;
						}else{
							legal = false;
						}
					}
				}else if(opGreater){
					if(objPos[opGoDirKey]  < opGreater[opGoDirKey] ){
							legal = true;
							action = GO;
						}else  if(objPos[opGoDirKey]  == opGreater[opGoDirKey] ){
							legal = true;
							action = BEAT;
							opGreater.alive = false;
						}else{
							legal = false;
						}
				}else if(myGreater){
					if(objPos[opGoDirKey]  < myGreater[opGoDirKey] ){
							legal = true;
							action = GO;
						}else{
							legal = false;
						}
				}
			}else if(objPos[opGoDirKey]  < this[opGoDirKey] ){	//向上走子
				if(opLower && myLower){
					//自己的子在下方
					if(opLower[opGoDirKey]  < myLower[opGoDirKey] ){
						if(objPos[opGoDirKey]  > myLower[opGoDirKey] ){
							legal = true;
							action = GO;
						}else{
							legal = false;
						}
					}else if(opLower[opGoDirKey]  > myLower[opGoDirKey] ){	//自己的子在上方
						if(objPos[opGoDirKey]  > opLower[opGoDirKey] ){
							legal = true;
							action = GO;
						}else  if(objPos[opGoDirKey]  == opLower[opGoDirKey] ){
							legal = true;
							action = BEAT;
							opLower.alive = false;
						}else{
							legal = false;
						}
					}
				}else if(opLower){
					if(objPos[opGoDirKey]  > opLower[opGoDirKey] ){
							legal = true;
							action = GO;
						}else  if(objPos[opGoDirKey]  == opLower[opGoDirKey] ){
							legal = true;
							action = BEAT;
							opLower.alive = false;
						}else{
							legal = false;
						}
				}else if(myLower){
					if(objPos[opGoDirKey]  > myLower[opGoDirKey] ){
							legal = true;
							action = GO;
						}else{
							legal = false;
						} 	
				}
			}
			return {legal : legal, action : action};
		}
		
		Piece.prototype._isLegalPrivate = function(objPos){};
		Piece.prototype._isLegalPublic = function(objPos){
			var adj, ret;
				//纵向走子
				if(objPos.xCoor == this.xCoor){	
					adj =this.getAdjacent('xCoor','yCoor');
					ret = this.isLegalByDirectionPublic(objPos,'yCoor', adj);					
				}else if(objPos.yCoor == this.yCoor){
					adj = this.getAdjacent('yCoor','xCoor');
					ret = this.isLegalByDirectionPublic(objPos,'xCoor', adj);
				}
				if(ret){
					legal = ret.legal;
					action = ret.action;
				}
				
				if(legal){
					for(var key in objPos){
						this[key] = objPos[key];
					}
				}
				return ret;
		};

		
		Piece.prototype.go = function(opt){
			var objPos = this.getCenterXY(opt);
			var private =  this._isLegalPrivate(objPos);
			if(private.legal)			
				return this._isLegalPublic(objPos);
			else
				return private;
		};
	}
	
	
	
	var Che = function(opt){
		var p = Che.prototype = new Piece(opt);		
		opt.type == RED ? p.src = 'r_che.png' : p.src = 'b_che.png';
		p._isLegalPrivate = function(objPos){
			chess.debug('che');
			var legal = true, action = GO;
			if(objPos.xCoor != this.xCoor && objPos.yCoor != this.yCoor)
				legal = false;
			return {legal : legal, action : action};
			
		};
		return p;
	}
	
	var Ma = function(opt){
		var p = Ma.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_ma.png' : p.src = 'b_ma.png';
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			
		};
		return p;
	}
	
	var Xiang = function(opt){
		var p = Xiang.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_xiang.png' : p.src = 'b_xiang.png';
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			
		};
		return p;
	}
	
	var Shi = function(opt){
		var p = Shi.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_shi.png' : p.src = 'b_shi.png';
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			
		};
		return p;
	}
	
	var Jiang = function(opt){
		var p = Jiang.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_jiang.png' : p.src = 'b_jiang.png';
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			
		};
		return p;
	}
	
	var Pao = function(opt){
		var p = Pao.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_pao.png' : p.src = 'b_pao.png';
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			
		};
		return p;
	}
	
	var Zu = function(opt){
		var p = Zu.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_zu.png' : p.src = 'b_zu.png';
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
		return p;
	}	
	
	
	
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
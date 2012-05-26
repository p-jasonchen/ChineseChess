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
		
		Piece.prototype.getCenterXY = function(opt){
			var posX = opt.posX, posY = opt.posY;
			var xCenter = vOffset[0], yCenter = hOffset[0];
			var i,j;
			for(i = 0; i < vOffset.length; i++){				
				if(Math.abs(vOffset[i] - posX) <= ChineseChess.trans.x){
					xCenter = vOffset[i]; break;
				}
			}
			if(i == vOffset.length)
				xCenter = vOffset[i - 1];
				
			for(j = 0; j < hOffset.length; j++){				
				if(Math.abs(hOffset[j] - posY) <= ChineseChess.trans.y){
						yCenter = hOffset[j]; break;
					}
				}
			if(j == hOffset.length)
				yCenter = hOffset[j - 1];
				
			return {
				xCenter : xCenter,
				yCenter : yCenter,
			}
			
		}
		
		Piece.prototype.isLegal = function(objPos){};
		Piece.prototype.go = function(opt){
			var result = this.getCenterXY(opt);
			this.isLegal(result);
		};
	}
	
	
	
	var Che = function(opt){
		var p = Che.prototype = new Piece(opt);		
		opt.type == RED ? p.src = 'r_che.png' : p.src = 'b_che.png';
		/**
		 * 
		 * @param {Object} goDirKey 判断走子方向的key,如果为xCenter则为纵向，对应的opGoDirKey值为yCenter。
		 * @param {Object} opGoDirKey
		 */
		Che.prototype.getAdjacent = function(goDirKey, opGoDirKey){
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
				if(cur !== this && cur[goDirKey] == this[goDirKey]){
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
				if(cur !== this && cur[goDirKey] == this[goDirKey]){
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
		
		Che.prototype.isLegalByDirection = function(objPos, opGoDirKey, adj){
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
		
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			if(objPos.xCenter != this.xCenter && objPos.yCenter != this.yCenter)
				legal = false;
			else{
				var adj, ret;
				//纵向走子
				if(objPos.xCenter == this.xCenter){	
					adj =this.getAdjacent('xCenter','yCenter');
					ret = this.isLegalByDirection(objPos,'yCenter', adj);					
				}else if(objPos.yCenter == this.yCenter){
					adj = this.getAdjacent('yCenter','xCenter');
					ret = this.isLegalByDirection(objPos,'xCenter', adj);
				}
				if(ret){
					legal = ret.legal;
					action = ret.action;
				}
				
				if(legal){
					this.xCenter = objPos.xCenter;
					this.yCenter = objPos.yCenter;
				}else{
					alert('illegal go');
				}
			}
		};
		return p;
	}
	
	var Ma = function(opt){
		var p = Ma.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_ma.png' : p.src = 'b_ma.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Xiang = function(opt){
		var p = Xiang.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_xiang.png' : p.src = 'b_xiang.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Shi = function(opt){
		var p = Shi.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_shi.png' : p.src = 'b_shi.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Jiang = function(opt){
		var p = Jiang.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_jiang.png' : p.src = 'b_jiang.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Pao = function(opt){
		var p = Pao.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_pao.png' : p.src = 'b_pao.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Zu = function(opt){
		var p = Zu.prototype = new Piece(opt);
		opt.type == RED ? p.src = 'r_zu.png' : p.src = 'b_zu.png';
		p.go = function(opt){
			
		};
		return p;
	}	
	
	
	
	var i, xCenter, yCenter, piece;
	var func = [Che, Ma, Xiang, Shi, Jiang, Shi, Xiang, Ma, Che];
	//车马象士帅
	for(i = 0; i < vOffset.length; i++){		
		xCenter = vOffset[i], yCenter = hOffset[0];		
		piece = new func[i]({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: RED,			
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 1];		
		piece = new func[i]({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: BLACK,
		});
		
		blackPieces.push(piece);
	}
	//炮
	for(i = 1; i < vOffset.length; i = i + 6){
		xCenter = vOffset[i], yCenter = hOffset[2];		
		piece = new Pao({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: RED,
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 3];		
		piece = new Pao({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: BLACK,
		});
		blackPieces.push(piece);
	}
	
	//卒
	for(i = 0; i < vOffset.length; i = i + 2){
		xCenter = vOffset[i], yCenter = hOffset[3];		
		piece = new Zu({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: RED,
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 4];		
		piece = new Zu({
			xCenter	: xCenter,
			yCenter	: yCenter,
			type	: BLACK,
		});
		blackPieces.push(piece);
	}	
	
	chess.pieces = redPieces.concat(blackPieces);
	
	
	
})(ChineseChess);
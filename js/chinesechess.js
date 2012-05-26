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
		
		p.isLegal = function(objPos){
			var legal = true, action = GO;
			if(objPos.xCenter != this.xCenter && objPos.yCenter != this.yCenter)
				legal = false;
			else{
				var cur, opponent, myself;
				if(this.type == RED){
					opponent = blackPieces;
					myself = redPieces;
				}else{
					opponent = redPieces;
					myself = blackPieces;
				}
				var opUp,opDown,myUp,myDown;
				//纵向走子
				if(objPos.xCenter == this.xCenter){					
					for(var i = 0; i < opponent.length; i ++){
						cur = opponent[i];
						if(cur.xCenter == this.xCenter){
							if(cur.yCenter > this.yCenter){
								opDown = cur;
								if(opDown && opDown.yCenter < cur.yCenter)
									opDown = cur;
							}else{
								opUp = cur;
								if(opUp && opUp.yCenter > cur.yCenter)
									opUp = cur;
							}
						}
					}
					
					for(var i = 0; i < myself.length; i ++){
						cur = myself[i];
						if(cur.xCenter == this.xCenter){
							if(cur.yCenter > this.yCenter){
								myDown = cur;
								if(myDown && myDown.yCenter < cur.yCenter)
									myDown = cur;
							}else{
								myUp = cur;
								if(myUp && myUp.yCenter > cur.yCenter)
									myUp = cur;
							}
						}
					}
					
					//向下走子
					if(objPos.yCenter > this.yCenter){
						if(opDown && myDown){
							//自己的子在上方
							if(opDown.yCenter > myDown.yCenter){
								if(objPos.yCenter < myDown.yCenter){
									legal = true;
									action = GO;
								}else{
									legal = false;
								}
							}else if(opDown.yCenter < myDown.yCenter){	//自己的子在下方
								if(objPos.yCenter < opDown.yCenter){
									legal = true;
									action = GO;
								}else  if(objPos.yCenter == opDown.yCenter){
									legal = true;
									action = BEAT;
								}else{
									legal = false;
								}
							}
						}
					}else if(objPos.yCenter < this.yCenter){	//向上走子
						if(opUp && myUp){
							//自己的子在下方
							if(opUp.yCenter < myUp.yCenter){
								if(objPos.yCenter > myUp.yCenter){
									legal = true;
									action = GO;
								}else{
									legal = false;
								}
							}else if(opUp.yCenter > myUp.yCenter){	//自己的子在上方
								if(objPos.yCenter > opUp.yCenter){
									legal = true;
									action = GO;
								}else  if(objPos.yCenter == opUp.yCenter){
									legal = true;
									action = BEAT;
								}else{
									legal = false;
								}
							}
						}
					}
				}else{
					
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
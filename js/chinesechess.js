/**
 * @author Administrator
 */

var ChineseChess={};	
(function(chess){
	
	var Piece = function(opt){		
		for(var key in opt){
			this[key] = opt[key];
		}	
		
		Piece.prototype.go = function(opt){};
	}
	
	//棋盘横线偏移
	var hOffset = [80,116,152,186,222,257,292,327,362,398];
	//棋盘纵线偏移
	var vOffset = [20,55,90,125,160,195,230,265,300];
	
	var RED = 0, BLACK = 1;
	
	var Che = function(opt){
		var p = new Piece(opt);		
		opt.type == RED ? p.src = 'r_che.png' : p.src = 'b_che.png';
		
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Ma = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_ma.png' : p.src = 'b_ma.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Xiang = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_xiang.png' : p.src = 'b_xiang.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Shi = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_shi.png' : p.src = 'b_shi.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Jiang = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_jiang.png' : p.src = 'b_jiang.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Pao = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_pao.png' : p.src = 'b_pao.png';
		p.go = function(opt){
			
		};
		return p;
	}
	
	var Zu = function(opt){
		var p = new Piece(opt);
		opt.type == RED ? p.src = 'r_zu.png' : p.src = 'b_zu.png';
		p.go = function(opt){
			
		};
		return p;
	}	
	
	
	var redPieces = [], blackPieces = [];
	var pieceSize = 16;
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
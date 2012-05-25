/**
 * @author Administrator
 */

var ChineseChess={};	
(function(chess){
	
	var Piece = function(opt){		
		for(var key in opt){
			this[key] = opt[key];
		}
	}
	
	//棋盘横线偏移
	var hOffset = [80,116,152,186,222,257,292,327,362,398];
	//棋盘纵线偏移
	var vOffset = [20,55,90,125,160,195,230,265,300];
	
	var redSrc = [
		'r_che.png',	'r_ma.png',		'r_xiang.png',		'r_shi.png',
		'r_jiang.png',	'r_shi.png',	'r_xiang.png',		'r_ma.png',
		'r_che.png',	'r_pao.png',	'r_pao.png',		'r_zu.png',
		'r_zu.png',		'r_zu.png',		'r_zu.png',			'r_zu.png',
	];
	
	var blackSrc = [
		'b_che.png',	'b_ma.png',		'b_xiang.png',		'b_shi.png',
		'b_jiang.png',	'b_shi.png',	'b_xiang.png',		'b_ma.png',
		'b_che.png',	'b_pao.png',	'b_pao.png',		'b_zu.png',
		'b_zu.png',		'b_zu.png',		'b_zu.png',			'b_zu.png',
	];
	
	var redPieces = [], blackPieces = [];
	var pieceSize = 16;
	var i, xCenter, yCenter, piece, srcIndex = 0;
	//车马象士帅
	for(i = 0; i < vOffset.length; i++){		
		xCenter = vOffset[i], yCenter = hOffset[0];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: redSrc[srcIndex],
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 1];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: blackSrc[srcIndex],
		});
		srcIndex++;
		blackPieces.push(piece);
	}
	//炮
	for(i = 1; i < vOffset.length; i = i + 6){
		xCenter = vOffset[i], yCenter = hOffset[2];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: redSrc[srcIndex],
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 3];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: blackSrc[srcIndex],
		});
		srcIndex++;
		blackPieces.push(piece);
	}
	
	//卒
	for(i = 0; i < vOffset.length; i = i + 2){
		xCenter = vOffset[i], yCenter = hOffset[3];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: redSrc[srcIndex],
		});
		redPieces.push(piece);
		
		yCenter = hOffset[hOffset.length - 4];		
		piece = new Piece({
			xCenter	: xCenter,
			yCenter	: yCenter,
			src		: blackSrc[srcIndex],
		});
		srcIndex++;
		blackPieces.push(piece);
	}
	
	chess.pieces = redPieces.concat(blackPieces);
	
	
	
})(ChineseChess);
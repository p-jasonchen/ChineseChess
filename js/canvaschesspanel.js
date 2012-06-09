( function(window) {"use strict";	

		window.log = function(data){
			window.console.log && window.console.log(data);
		}	
		
		function absoluteCenter(canvas, span, offset){
			var left = (document.body.clientWidth - canvas.width)/2;
			var top = (document.body.clientHeight - canvas.height)/2;
			var css = {
				position: 'absolute',
				left : left + 'px',
				top : top + 'px',	
								
			} 	
			css['text-align'] = 'center';
			$(canvas).css(css);		
			
			if(span){
				css.width = canvas.width;
				css.height = canvas.heigth;		
				var _offset = offset;
				if(!_offset)
					_offset = 0;
				css.top = top + _offset + 'px';				
				$(span).css(css);
			}				
				
		}
		
		var ChessProtocal = {	
			HEART_BEAT : 0,		
			SET_PLAYER_ID :1,
			MOVE_PIECE : 2,  
			PLAYER_IN : 3,   
			PLAYER_OUT : 4,  
			GAME_REQUEST : 5,
			GAME_RESPONSE:6,			
		}
		
		var GameStatus = {
			waiting: 0,
			playing: 1,
			over: 2,
			myturn:3,
		}
		
		 window.heart = function(){	
		 	var heart = {cmd: ChessProtocal.HEART_BEAT};	 	
			window.window.chessPanel.wsocket.send(window.JSON.stringify(heart));	
			window.t=setTimeout('heart()',4000);
		}
		
		window.doGameRequest = function(anchor){
			var playerId = anchor.innerHTML;
			var req = {
				cmd: ChessProtocal.GAME_REQUEST,
				playerId : playerId,
			}
			window.chessPanel.wsocket.send(window.JSON.stringify(req));
		}
		
		var GameResponse = function(result, reqId){
			var rsp = {
				cmd: ChessProtocal.GAME_RESPONSE,
				result: result,
				playerId: reqId,
			}
			if(result == 1){ 
				$('#tips').html('等待对方先走棋...');
				$('#piece_type').html('红方');
			}
			window.chessPanel.pieceType = ChineseChess.RED;
			window.chessPanel.wsocket.send(window.JSON.stringify(rsp));
		}
		
		var ChessSocket = function(chessPanel){
			var proxyServerIp = $('#PROXY_SERVER_IP').val();
			if(proxyServerIp)
				var url = 'ws://' + proxyServerIp + ':33601/demo';
			else
				var url = "ws://124.73.15.139:33601/demo";
			try {
				var ws = new WebSocket(url);
				ws.onopen = this.onOpen;
                ws.onmessage = this.onMessage;
                ws.onclose = this.onClose;
                ws.onerror = this.onError;
                ws.chessPanel = chessPanel;          
                this.ws = ws;     
			} catch (ex) {
				$('#tips').html('您的浏览器暂不支持websocket哦...');
			}
			
		}
		
		
		
		
		ChessSocket.prototype.onOpen = function(Event){			
			window.log('ChessSocket.prototype.onOpen');
			window.heart();
		}
		
		ChessSocket.prototype.onMessage = function(MessageEvent){
			var data = MessageEvent.data;
			var jsonMsg = window.JSON.parse(data);
			var cmd = parseInt(jsonMsg.cmd);
			switch(cmd){
				//获取自己的playerID
				case ChessProtocal.SET_PLAYER_ID :{
					if(jsonMsg.playerId){
						var player = '<li class="player" value="' + jsonMsg.playerId + '"><a>昵称：'+ jsonMsg.playerId +'</a></li>';
						$('#players ul').prepend(player);
					}else{
						$('#tips').html('抱歉，服务器拒绝请求，请稍后再试...');
					}
					break;
				}
				case ChessProtocal.MOVE_PIECE:{
					window.chessPanel.moveEnemyPiece(jsonMsg);		
					$('#tips').html('对方走子完毕，请您走棋');			
					break;
					
				}				
				//player in
				case ChessProtocal.PLAYER_IN:{
					var player = '<li class="player" value="' + jsonMsg.playerId + '"><a href="#" onclick="javascript:doGameRequest(this)">'+ jsonMsg.playerId +'</a></li>';	
					$('#players ul').append(player);break;
				}
				//player out
				case ChessProtocal.PLAYER_OUT:{
					var selector = '#players ul li[value ="' + jsonMsg.playerId + '"]';
					$(selector).remove();break;
				}
				case ChessProtocal.GAME_REQUEST:{
					var reqId = jsonMsg.playerId;
					var dialog = {
						title:'游戏请求',
						content:reqId + '发来游戏请求，是否同意？',
						callbackone:function(){GameResponse(1, reqId)},
						callbacktwo:function(){GameResponse(0, reqId)},
						buttonone:'开始',
						buttontwo:'拒绝',
					}
					
					Component.MsgDialog.msgbox(dialog);break;
				}
				case ChessProtocal.GAME_RESPONSE:{
					if(jsonMsg.result == 1){
						this.chessPanel.gameStatus = GameStatus.myturn;
						this.chessPanel.pieceType = ChineseChess.BLACK;
						$('#tips').html('对方接受邀请.您为黑方，请先走棋');
						$('#piece_type').html('黑方');
					}
					break;
				}
			}
			window.log('ChessSocket.prototype.onMessage');
		}
		
		ChessSocket.prototype.onClose = function(Event){
			clearTimeout(window.t);
			$('#tips').html('抱歉，与服务器失去连接，请稍后再试...');
			window.log('ChessSocket.prototype.onClose');
		}
		
		ChessSocket.prototype.onError = function(){
			$('#tips').html('抱歉，出错啦，请稍后再试...');
			window.log('ChessSocket.prototype.onError');
		}
		
		ChessSocket.prototype.send = function(msg){
			this.ws && this.ws.send(msg);
		}
		
		/*
		 * CanvasChessPanel
		 */
		var CanvasChessPanel = function(id, opt) {
			var CanvasChessPanel = new CanvasWrapper(id, opt);
			var wsocket = new ChessSocket(CanvasChessPanel);
			CanvasChessPanel.wsocket = wsocket;
			CanvasChessPanel.width = 320;
			CanvasChessPanel.height = 480;				
			CanvasChessPanel.gameStatus = GameStatus.waiting;
			
			CanvasChessPanel.moveEnemyPiece = function(jsonData){
				var oldX = jsonData.oldX;
				var oldY = jsonData.oldY;
				var newX = jsonData.newX;
				var newY = jsonData.newY;
				var beat = jsonData.beat;
				var pieces = this.pieces;
				if(beat && beat == 1){
					for(var i = 0; i < pieces.length; i++) {
						var cur = pieces[i];
						if(cur.alive) {						
							if(cur.xCoor == newX && cur.yCoor == newY){								
								cur.alive = false;break;
							}
						}
					}
				}
		
				for(var i = 0; i < pieces.length; i++) {
					var cur = pieces[i];
					if(cur.alive) {						
						if(cur.xCoor == oldX && cur.yCoor == oldY){							
							cur.xCoor = newX; 
							cur.yCoor = newY;
							break;
						}
					}
				}
				this.gameStatus = GameStatus.myturn;
				this.draw();
			}
						
			CanvasChessPanel.draw = function () {
		    	var c = this.con;	
		    	if(this.chessPanelImg){			    	  	
		    		c.drawImage(this.chessPanelImg, 0, 0); 
		    	} 
		    	var that = this;			    	
			    var pieces = that.pieces;	
			    var xCenter, yCenter;		    	
			    if(pieces){
			    	c.translate(- that.trans.x , -that.trans.y);
			    	for(var i = 0; i < pieces.length; i++){
			    		var cur = pieces[i];
			    		if(cur.alive){
				    		xCenter = ChineseChess.vOffset[cur.xCoor];	
				    		yCenter = ChineseChess.hOffset[cur.yCoor];	    		
				    		c.drawImage(cur.image, xCenter, yCenter);
			    		}
			    	}
			    	
			    	var selected = that.selected;
			    	if(selected){
			    		xCenter = ChineseChess.vOffset[selected.xCoor];	
			    		yCenter = ChineseChess.hOffset[selected.yCoor];	 
			    		var border = {
							xPos		: xCenter,
							yPos		: yCenter,
							borderWidth : 2 * that.trans.x,
							borderHeight : 2 * that.trans.y,
						};
						that.con.strokeStyle = "rgb(255,0,0)";
						//之前设置的translate依然有效
						that.con.strokeRect(border.xPos, border.yPos, border.borderWidth, border.borderHeight);
			    	}
			    	c.translate( that.trans.x , that.trans.y);
			    	
		    	}	
			};
			
			
			CanvasChessPanel.preDraw = function(){
				var image = new Image();
		    	image.src = 'img/chesspanel.png';
		    	var that = this;
		    	var c = this.con;
		    	image.onload = function(){	
		    		//棋盘缩放系数
		    		var xScale = (that.width / image.naturalWidth);	    		
		    		var yScale = (that.height / image.naturalHeight);		    		
		    		c.scale(xScale,yScale);
		    		that.chessPanelImg = image;			    	
			    	var pieces = that.pieces;			    	
			    	if(pieces){
			    		var cur = pieces[0];
			    		image = new Image();
			    		image.src = 'img/' + cur.src;
			    		var trans = {
			    			x : image.naturalWidth /2,
			    			y : image.naturalHeight / 2,
			    		};			    		
			    		that.trans = trans;
			    		ChineseChess.trans = trans;
			    		
			    		for(var i = 0; i < pieces.length; i++){
				    		cur = pieces[i];
				    		image = new Image();
				    		image.src = 'img/' + cur.src;
				    		cur.image = image;
			    		}
			    	}
			    	that.draw();
			    }
				
			};
			
			CanvasChessPanel.setMousedownCallBack = function(){
					var that = this;
					$(window).mousedown(function(e) {
					var canvasX = Math.floor(e.pageX-that.can.offsetLeft);
					var canvasY = Math.floor(e.pageY-that.can.offsetTop);
				});
			};

			CanvasChessPanel.setClickCallBack = function(){
					var that = this;
					$(window).click(function(e) {
					if(that.gameStatus != GameStatus.myturn)
						return;
					var canvasX = Math.floor(e.pageX-that.can.offsetLeft);
					var canvasY = Math.floor(e.pageY-that.can.offsetTop);
					if(that.selected){	
						var objPos = that.selected.getCenterXY({posX : canvasX, posY : canvasY});	
						if(that.selected.xCoor == objPos.xCoor && that.selected.yCoor == objPos.yCoor)	
							that.selected = null;	
						else{
							if(that.selected.type != that.pieceType){
								that.selected = null;return;
							}
							var ret = that.selected.go({posX : canvasX, posY : canvasY});

							if(ret.reachable){	
								var cur = that.selected;															
								var go = {
									cmd : ChessProtocal.MOVE_PIECE,
									oldX : cur.savedX,
									oldY : cur.saveY,
									newX : cur.xCoor,
									newY : cur.yCoor,
									beat : ret.beat,
								}
								wsocket.send(window.JSON.stringify(go));
								that.gameStatus = GameStatus.playing;
								$('#tips').html('等待对方走棋...');
							}else{
								alert('illegal go');
							}
							that.selected = null;
						}						
						that.redraw();
						return;
					}

					var cur, xCenter, yCenter;

					for(var i = 0; i < that.pieces.length; i++){
						cur = that.pieces[i];
						if(!cur.alive) continue;
						xCenter = ChineseChess.vOffset[cur.xCoor];	
			    		yCenter = ChineseChess.hOffset[cur.yCoor];	 
						if(Math.abs(xCenter - canvasX) < that.trans.x && Math.abs(yCenter - canvasY) < that.trans.y){
							that.selected = cur;
							that.redraw();						
							return;
						}
					}
				});
			};			
			CanvasChessPanel.Config = function(){
				this.setAttr(this.can, {
					width : this.width,
					height : this.height
				});
				this.setAttr(this.cCan, {
					width : this.width,
					height : this.height
				});	
				
				this.preDraw();
				//this.setMousedownCallBack();
				this.setClickCallBack();
				//absoluteCenter(this.can);			
			//this.setColor('#a8a5a8');	
			this.show();
				
			}
			
			CanvasChessPanel.Config();
			
			
			
			
			
			
			return CanvasChessPanel;
		};
		
		
		window.CanvasChessPanel = CanvasChessPanel;
		/*
		 * CanvasChessPanel
		 */
	
		
		
	}(window));
	

	

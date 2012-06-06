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
			SET_PLAYER_ID :1,
			MOVE_PIECE : 2,  
			PLAYER_IN : 3,   
			PLAYER_OUT : 4,  
			GAME_REQUEST : 5,
		}
		
		function heart(chessSocket){
			//chessSocket.send('heart packet');
			console.log('heart');
			var t=setTimeout('heart()',4000)
		}
		
		window.doGameRequest = function(anchor){
			var playerId = anchor.innerHTML;
			var req = {
				cmd: ChessProtocal.GAME_REQUEST,
				playerId : playerId,
			}
			window.chessPanel.wsocket.send(window.JSON.stringify(req));
		}
		
		
		var ChessSocket = function(){
			try {
				var ws = new WebSocket("ws://127.0.0.1:33601/demo");
				ws.onopen = this.onOpen;
                ws.onmessage = this.onMessage;
                ws.onclose = this.onClose;
                ws.onerror = this.onError;
                this.ws = ws;               
			} catch (ex) {
				
			}
			
		}
		
		
		
		
		ChessSocket.prototype.onOpen = function(Event){
			var a = arguments;
			window.log('ChessSocket.prototype.onOpen');
		}
		
		ChessSocket.prototype.onMessage = function(MessageEvent){
			var data = MessageEvent.data;
			var jsonMsg = window.JSON.parse(data);
			var cmd = parseInt(jsonMsg.cmd);
			switch(cmd){
				//获取自己的playerID
				case ChessProtocal.SET_PLAYER_ID :{
					var player = '<li class="player" value="' + jsonMsg.playerId + '"><a>'+ jsonMsg.playerId +'</a></li>';
					$('#players ul').prepend(player);break;
				}
				case ChessProtocal.MOVE_PIECE:{
					
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
					alert(reqId + '请求开始游戏');
				}
			}
			window.log('ChessSocket.prototype.onMessage');
		}
		
		ChessSocket.prototype.onClose = function(Event){
			var a = arguments;
			window.log('ChessSocket.prototype.onClose');
		}
		
		ChessSocket.prototype.onError = function(){
			var a = arguments;
			window.log('ChessSocket.prototype.onError');
		}
		
		ChessSocket.prototype.send = function(msg){
			this.ws && this.ws.send(msg);
		}
		
		/*
		 * CanvasChessPanel
		 */
		var CanvasChessPanel = function(id, opt) {
			var wsocket = new ChessSocket();
			var CanvasChessPanel = new CanvasWrapper(id, opt);
			CanvasChessPanel.wsocket = wsocket;
			CanvasChessPanel.width = 320;
			CanvasChessPanel.height = 480;	
						
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
					var canvasX = Math.floor(e.pageX-that.can.offsetLeft);
					var canvasY = Math.floor(e.pageY-that.can.offsetTop);
					if(that.selected){	
						var objPos = that.selected.getCenterXY({posX : canvasX, posY : canvasY});	
						if(that.selected.xCoor == objPos.xCoor && that.selected.yCoor == objPos.yCoor)	
							that.selected = null;	
						else{
							var ret = that.selected.go({posX : canvasX, posY : canvasY});

							if(ret){		
								wsocket.send('data from browser');
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
	

	

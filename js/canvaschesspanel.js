( function(window) {"use strict";		
		
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
		
		
		/*
		 * CanvasChessPanel
		 */
		var CanvasChessPanel = function(id, opt) {
			
			var CanvasChessPanel = new CanvasWrapper(id, opt);
			CanvasChessPanel.width = 320;
			CanvasChessPanel.height = 480;			
			 

			
			CanvasChessPanel.draw = function () {
		    	var c = this.con;	
		    	if(this.chessPanelImg){			    	  	
		    		c.drawImage(this.chessPanelImg, 0, 0); 
		    	} 
		    	var that = this;			    	
			    var pieces = that.pieces;			    	
			    if(pieces){
			    	c.translate(- that.trans.x , -that.trans.y);
			    	for(var i = 0; i < pieces.length; i++){
			    		var cur = pieces[i];			    		
			    		c.drawImage(cur.image, cur.xCenter, cur.yCenter);
			    	}
			    	
			    	var selected = that.selected;
			    	if(selected){
			    		var border = {
							xPos		: selected.xCenter,
							yPos		: selected.yCenter,
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
					//console.log('mousedown canvasX=' + canvasX);
					//console.log('mousedown canvasY=' + canvasY);
				});
			};

			CanvasChessPanel.setClickCallBack = function(){
					var that = this;
					$(window).click(function(e) {
					var canvasX = Math.floor(e.pageX-that.can.offsetLeft);
					var canvasY = Math.floor(e.pageY-that.can.offsetTop);
					//console.log('click canvasX=' + canvasX);
					//console.log('click canvasY=' + canvasY);
					if(that.selected){						
						that.selected.go({posX : canvasX, posY : canvasY});
						that.selected = null;
						that.redraw();
						return;
					}
					var cur;
					for(var i = 0; i < that.pieces.length; i++){
						cur = that.pieces[i];
						if(Math.abs(cur.xCenter - canvasX) < that.trans.x && Math.abs(cur.yCenter - canvasY) < that.trans.y){
							if(that.selected === cur)
								that.selected = null;
							else	
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

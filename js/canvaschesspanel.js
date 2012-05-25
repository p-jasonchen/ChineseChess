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
		    	var c = this.con, d = 1000;		    	
		    	c.clearRect(0, 0, d, d);
		    	var image = new Image();
		    	image.src = 'img/chesspanel.png';
		    	var that = this;
		    	image.onload = function(){	
		    		//棋盘缩放系数
		    		var xScale = (that.width / image.naturalWidth);	    		
		    		var yScale = (that.height / image.naturalHeight);		    		
		    		c.scale(xScale,yScale);
			    	c.drawImage(image, 0, 0);   
			    	
			    	var pieces = that.pieces;			    	
			    	if(pieces){
			    		var cur = pieces[0];
			    		image = new Image();
			    		image.src = 'img/' + cur.src;
			    		c.translate(- image.naturalWidth /2 , -image.naturalHeight / 2);
			    		for(var i = 0; i < pieces.length; i++){
			    			cur = pieces[i];
			    			image = new Image();
			    			image.src = 'img/' + cur.src;
			    			c.drawImage(image, cur.xCenter, cur.yCenter);
			    		}
			    	}
		    	}	
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
				
				//absoluteCenter(this.can);			
			this.setColor('#a8a5a8');	
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

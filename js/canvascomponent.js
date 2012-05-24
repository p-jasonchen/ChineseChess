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
		 * CanvasProgressbar 
		 */		
		 var CanvasProgressbar = function(id, opt) {		 	
			var progressbar = new CanvasWrapper(id, opt);			
			
			progressbar.width = 200;
			progressbar.height = 20;
			progressbar.progress = 0;		
			
			
			var span = progressbar.addEl('span', document.getElementById(opt.id));
			 if(span){
			 	span.id = 'loadingres_span';
			 	span.innerHTML = '0%';
			 	span.width = progressbar.width;
			 	span.height = progressbar.height;
			 }
			

			progressbar.setProgress = function(progress) {
				span.innerHTML = (progress * 100).toFixed(0) + '%';
				// console.log(span.innerHTML);
				this.progress = progress;
				this.redraw();
			}
			
			progressbar.Config = function(){
				this.setAttr(this.can, {
					width : this.width,
					height : this.height
				});
				this.setAttr(this.cCan, {
					width : this.width,
					height : this.height
				});	
				
				absoluteCenter(this.can, span);
			}
			
			progressbar.draw = function () {
		    	var c = this.con, d = 1000;
				c.clearRect(0, 0, d, d);
				
				c.fillStyle = "rgb(" + this.cRGB.r + "," + this.cRGB.g + "," + this.cRGB.b + ")";								
				c.fillRect(0,0, this.width * this.progress,this.height);
			};
			
			progressbar.Config();
		
			return progressbar;

		};
		
		window.CanvasProgressbar = CanvasProgressbar;
		/*
		 * CanvasProgressbar
		 */
		
		
		/*
		 * CanvasLoader
		 */
		var CanvasLoader = function(id, opt) {
			
			var canvasloader = new CanvasWrapper(id, opt);
			canvasloader.width = 100;
			canvasloader.height = 100;
			
			var span = canvasloader.addEl('span', document.getElementById(opt.id));
			 if(span){
			 	span.id = 'loading_span';
			 	span.innerHTML = '加载中...';
			 	span.width = canvasloader.width;
			 	span.height = canvasloader.height;
			 }
			 
			canvasloader.draw = function () {
		    	var c = this.con, d = 1000;		    	
		    	c.clearRect(0, 0, d, d);
		    	var image = new Image();
		    	image.src = '../img/loading.png';
		    	var that = this;
		    	image.onload = function(){	
		    		var xScale = (that.width / image.naturalWidth);	    		
		    		var yScale = (that.height / image.naturalHeight);
		    		c.scale(xScale,yScale);
			    	c.drawImage(image, 0, 0);   
		    	}	
			};
			
			canvasloader.Config = function(){
				this.setAttr(this.can, {
					width : this.width,
					height : this.height
				});
				this.setAttr(this.cCan, {
					width : this.width,
					height : this.height
				});	
				
				absoluteCenter(this.can, span, 0.5 * this.height);
				
			}
			
			canvasloader.Config();
			return canvasloader;
		};
		
		
		window.CanvasLoader = CanvasLoader;
		/*
		 * CanvasLoader
		 */
	
		
		
	}(window));

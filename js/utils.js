var Utils={};
(function(util){	
	
	function _re_mask() {
		/*
		 更改遮罩层的大小,确保在滚动以及窗口大小改变时还可以覆盖所有的内容
		 */
		var mask = document.getElementById("mask");
		if(null == mask)
			return;
		mask.style.width = util.getVisualWidth() + "px";
		mask.style.height = util.getVisualHeight() + "px";
	}

	function _re_pos(id) {
		/*
		 更改弹出对话框层的位置,确保在滚动以及窗口大小改变时一直保持在网页的最中间
		 */
		var box = document.getElementById(id);
		if(null != box) {
			var w = box.clientWidth;			
			var h = box.clientHeight;			
			box.style.left = util.getLeft(w) + "px";
			box.style.top = util.getTop(h) + "px";
		}
	}

    
	util.getVisualWidth = function(){
		var w1 = document.body.clientWidth;
		var w2 = window.innerWidth;
		return  (w1 > w2) ? w1 : w2;
		//return w1;
	}
	util.getVisualHeight = function(){
		var h1 = document.body.clientHeight;
		var h2 = window.innerHeight;
		return  (h1 > h2) ? h1 : h2;
		//return h1;
	}
	
	 util.getLeft = function(w) {
        var bw = document.body.clientWidth;
        var bh = document.body.clientHeight;
        w = parseFloat(w);
        return (bw / 2 - w / 2 + document.body.scrollLeft);
    }

    util.getTop = function(h) {
        var bw = document.body.clientWidth;
        var bh = document.body.clientHeight;
        h = parseFloat(h);
        return (document.body.scrollTop + h / 2);
    }
    
	util.createMask = function(){//创建遮罩层的函数
		if(this.mask) return this.mask;
		var mask=document.createElement("div");
		mask.id="mask";
		mask.style.position="absolute";
		//mask.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=4,opacity=25)";//IE的不透明设置
		mask.style.opacity=0.3;//Mozilla的不透明设置
		mask.style.background=" rgba(0, 0, 0, 0.3)";
		mask.style.top="0px";
		mask.style.left="0px";
		mask.style.width=this.getVisualWidth()+'px';
		mask.style.height=this.getVisualHeight()+'px';
		mask.style.zIndex=1000;
		document.body.appendChild(mask);
		this.mask = mask;
	}
	
	var Guide = function(guideArray){
		if(!guideArray || guideArray.length == 0) return;		
		if(!this.guideArray){
			util.createMask();
			
			var box=document.createElement("img");
			box.src="img/" + guideArray[0];
			box.id="guide";
			box.style.position="absolute";
			
			box.style.top="0px";
			box.style.left="0px";
			box.style.opacity=0.7;
			
			box.style.width=util.getVisualWidth()+'px';
	
			box.style.height=util.getVisualHeight()+'px';
			box.style.overflow="visible";
			//box.style.border="1px solid black";
			//box.style.borderRadius = "6px";	
			
			box.style.zIndex=1001;
			document.body.appendChild(box);
			//_re_pos(box.id);
			var that  = this;			
			box.onclick = function(){
				var array = that.guideArray;
				var guide = array.shift();
				array.push(guide);
				box.src="img/" + guide;
				if(that.count++ == array.length) box.style.display='none';				
			}
		}
		this.guideArray = guideArray;	
		this.count = 0;	
		
	}
	
	
	util.Guide = Guide;
	
})(Utils);

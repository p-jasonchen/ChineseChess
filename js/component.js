var Component={};
(function(comp){

	/*
	功能:自定义窗口标题,自定义窗口内容,是否显示取消按钮,焦点位置设定
	*/
	function _getWidth(){
		return (document.body.clientWidth+document.body.scrollLeft);
	}
	function _getHeight(){
		return (document.body.clientHeight+document.body.scrollTop);
	}
	function _getLeft(w){
		var bw=document.body.clientWidth;
		var bh=document.body.clientHeight;
		w=parseFloat(w);
		return (bw/2-w/2+document.body.scrollLeft);
	}
	function _getTop(h){
		var bw=document.body.clientWidth;
		var bh=document.body.clientHeight;
		h=parseFloat(h);
		return (bh/2-h/2+document.body.scrollTop);
	}

	function _createMask(){//创建遮罩层的函数
		var mask=document.createElement("div");
		mask.id="mask";
		mask.style.position="absolute";
		//mask.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=4,opacity=25)";//IE的不透明设置
		mask.style.opacity=0.3;//Mozilla的不透明设置
		mask.style.background=" rgba(0, 0, 0, 0.3)";
		mask.style.top="0px";
		mask.style.left="0px";
		mask.style.width=_getWidth();
		mask.style.height=_getHeight();
		mask.style.zIndex=1000;
		document.body.appendChild(mask);
	}
    function _createMsgbox(w,h,t){//创建弹出对话框的函数
		var box=document.createElement("div")	;
		box.id="msgbox";
		box.style.opacity=0.7;
		box.style.position="absolute";
		box.style.background="black";
		box.style.width=w;

		box.style.height=h*0.8;
		box.style.overflow="visible";
		box.style.border="1px solid black";
		box.style.borderRadius = "6px";
		box.innerHTML=t;
		box.style.zIndex=1001;
		document.body.appendChild(box);
		_re_pos();
	}
	function _re_mask(){
		/*
		更改遮罩层的大小,确保在滚动以及窗口大小改变时还可以覆盖所有的内容
		*/
		var mask=document.getElementById("mask")	;
		if(null==mask)return;
		mask.style.width=_getWidth()+"px";
		mask.style.height=_getHeight()+"px";
	}
	function _re_pos(){
		/*
		更改弹出对话框层的位置,确保在滚动以及窗口大小改变时一直保持在网页的最中间
		*/
		var box=document.getElementById("msgbox");
		if(null!=box){
			var w=box.clientWidth;//style.width;
			var h=box.clientHeight;//style.height;
			box.style.left=_getLeft(w)+"px";
			box.style.top=_getTop(h)+"px";
		}
	}
	function _remove(){
		/*
		清除遮罩层以及弹出的对话框
		*/
		var mask=document.getElementById("mask");
		var msgbox=document.getElementById("msgbox");
		if(null==mask&&null==msgbox)return;
		document.body.removeChild(mask);
		document.body.removeChild(msgbox);
	}
 	function _re_show(){
		/*
		重新显示遮罩层以及弹出窗口元素
		*/
		_re_pos();
		_re_mask();	
	}
	function _set_url(url)
	{
    window.location.href=goUrl(url);
	}

	comp.MsgDialog={		
		msgbox:function (option){
		var mstitle =option.title||null;
		var mstext  =option.content||null;
		var callbackone =option.callbackone||null;
		var callbacktwo =option.callbacktwo||null;
		var buttonone =option.buttonone||null;
		var buttontwo =option.buttontwo||null;
		var isfocus =option.focus||null;
		_createMask();
		
		//if(typeof callbacktwo == 'string')callbacktwo="set_url('"+callbacktwo+"')";
		var temp="<div style=\"max-width:350px;border:1px dotted white;margin:5px 5px 5px 5px;\"><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"font:14px Verdana, Geneva, Arial, Helvetica, sans-serif\">";
		if(mstitle)temp+="<tr><td   height=\"22\" style=\"padding-left:8px;padding-top:8px;font-weight: bold;color:white;\">"+mstitle+"</td></tr>";
		temp+="<tr><td   height=\"75\" style=\"padding:6px;color:white;font-size:30px;\">"+mstext+"</td>";
		temp+="</tr><tr><td height=\"22\" align=\"center\" >";
		if(buttonone){temp+="<a id ='buttonone' name=\"msgconfirmb\" style=\"padding: 4px; font-size: 25px; margin: 10px 30px; background: #000; color: #FFF; border: 1px solid #AAA;\" type=\"button\">"+buttonone+"</a>";}
		if(buttontwo){temp+="&nbsp;&nbsp;<a id ='buttontwo' name=\"msgcancelb\" style=\"padding: 4px; font-size: 25px; margin: 10px 30px; background: #000; color: #FFF; border: 1px solid #AAA;\" type=\"button\" >"+buttontwo+"</a></td>";}
		if(!buttonone&&!buttontwo){temp+="<a id ='buttonone' name=\"msgconfirmb\" style=\"padding: 4px; font-size: 25px; margin: 10px 30px; background: #000; color: #FFF; border: 1px solid #AAA;\" type=\"button\"   onclick=\"_remove();\">"+"关闭</a>";}
		temp+="</tr><tr><td  width=\"355\" height=\"8\"></td></tr></table></div>";
		_createMsgbox(400,200,temp);
		if(buttonone)
			document.getElementById('buttonone').onclick =function(){
				_remove();
				(typeof callbackone == 'string') ?_set_url(callbackone):callbackone();
			};
		if(buttontwo)
			document.getElementById('buttontwo').onclick =function(){
				_remove();
				(typeof callbacktwo == 'string') ?_set_url(callbacktwo):callbacktwo();
			};
		if(focus==0||focus=="0"||null==focus){document.getElementById("buttonone").focus();}
		else if(focus==1||focus=="1"){document.getElementById("buttontwo").focus();}		
		_re_show();
	}
	};	
	
	
				
	comp.CanvasLoader={		
		show:function(id, opt){
			if (!this.cl) {
                cl = new CanvasLoader(id, opt);
                cl.setColor('#a8a5a8'); // default is '#000000'     
                /*
                cl.setColor('#a8a5a8'); // default is '#000000'
                cl.setShape('spiral'); // default is 'oval'
                cl.setDiameter(50); // default is 40
                cl.setDensity(45); // default is 40
                cl.setRange(1); // default is 1.3                        
                this.cl = cl;
                 */                             
                this.cl = cl;
                
            }
            $("#canvasLoader").css("margin-top", ($(window).height() / 2 - 20) + "px");
	        $("#canvasLoader").css("margin-left", ($(window).width() / 2 - 20) + "px");	                    
	        $('#info-loading').css('display', 'block');
            this.cl.show();
		},			
		
		hide:function(){
			if (this.cl) {
				this.cl.hide();
			}
			$('#info-loading').css('display', 'none');
		},	
		
	};
	
	comp.CanvasProgressbar={		
		init : function(id, opt) {							
			if(!this.cpb) {
				var cpb = new CanvasProgressbar(id, opt);
				cpb.setColor('#a8a5a8');
				// default is '#000000'
				this.cpb = cpb;

			}
			$("#canvasProgressbar").css("margin-top", ($(window).height() / 2 - 20) + "px");
			$("#canvasProgressbar").css("margin-left", ($(window).width() / 2 - 20) + "px");
			$('#info-loading').css('display', 'block');
			this.cpb.show();
			return this;
		},

		setProgress : function(progress) {
			if(this.cpb) {
				this.cpb.setProgress(progress);
				if(progress == 1){
					this.cpb.hide();
					$('#info-loading').css('display', 'none')
				}
					
			}
		},
	};
	
})(Component);

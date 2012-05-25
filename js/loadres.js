var DownloadControler={};	
(function(controler){
	
	var DownloaderCtx = function(_states, _progressBar){
		this.states = _states;
		this.state	= this.states[0];
		this.progressBar = _progressBar;
		
		this.total = 0;
		for(var i=0; i< this.states.length; i++){
			this.total += this.states[i].jRes.resArray.length;
		}
		
		DownloaderCtx.prototype.load = function(){
			var that = this;
			if(that.state)
				that.state.load(that);
		}
	}
	
	var State = function(_order){		
		this.order = _order;
		this.jRes = {};
		
		State.prototype.setProgress = function(jData){
			var ctx = this.ctx;
			if(jData){
				var current = jData.args[0]; 
				for(var i = 0; i < this.order; i++){
					current += ctx.states[i].jRes.resArray.length;
				}		
				if(ctx){
					if(ctx.progressBar)
						ctx.progressBar.setProgress(current / ctx.total);
					if(jData.args[0] == jData.args[1]){	
						ctx.state = ctx.states[this.order + 1];
						ctx.load();
						if(this.onFinish)
							this.onFinish();
					}
				}
			}
		};		
		
		
		State.prototype.load = function(ctx){
			var rm = new ResourceManager.ResourceDownloader();
			this.ctx = ctx;
			rm.bind(this);
			rm.loadRes(this.jRes);		
			
		};
	}
		
		
	
	
	var ImgState = function(_order){
		var img = new State(_order);
		img.jRes = {
			type:'img',
			path:'img/',
			resArray:[			
				'chesspanel.png',	'r_jiang.png',		'r_shi.png',
				'r_xiang.png',		'r_che.png',		'r_ma.png',
				'r_pao.png',		'r_zu.png',		'b_zu.png',
				'b_pao.png',		'b_jiang.png',		'b_ma.png',
				'b_shi.png',		'b_xiang.png',		'b_che.png',	
				'ready.png',		'newgame.png',		
			]
		};	
		
		img.onFinish = function(){
			var opt = {
				id : 'canvasChessPanel',				
			};
			var chessPanel = new CanvasChessPanel('chess_frame', opt);		
			chessPanel.pieces =  ChineseChess.pieces,
			window.chessPanel = chessPanel;
		}	
		
		return img;
	}
	
	var CommonJsState = function(_order){
		var js = new State(_order);
		js.jRes =  {
			type:'script',
			path:'../javascript/',
			resArray:[
				'nc.js',
				'zepto.js',
				'common.js',
				'iscroll4.js',
			]
		};
	
		
		js.onFinish = function(){
			NC.pages.config({switchStyle:NC.SwitchStyleEnum.CUBE,defaultPage:'index'});
		}	
		
		return js;
	}
	
	var WorkJsState = function(_order){
		var js = new State(_order);
		js.jRes = {
			type:'script',
			resArray:[
				'index.js',
				'index_new.js',
				'pintu.js',
				'favorite.js',
				'gameend.js',
				'selectpic.js',
				'selectdif.js',
				'gamelist.js',
				'roominfo.js',
				'roundinfo.js',
				'pcomment.js',
				'guide.js'
			]
		};	
		
		return js;
	}	
	
	
	
	var doDownload = function(){
		var states = [];
		states.push(new ImgState(states.length));
		//states.push(new CommonJsState(states.length));
		//states.push(new WorkJsState(states.length));	
		
		
		
		var opt = {};
	    opt.id = 'canvasProgressbar';
		var pb = Component.CanvasProgressbar.init('info-loading', opt);	
	
		var ctx = new DownloaderCtx(states,pb);
		ctx.load();		
	};
	
	
	controler.doDownload = doDownload;
	
	

})(DownloadControler);
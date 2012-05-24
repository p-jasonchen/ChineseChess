/**
 * 资源管理器
 */

var ResourceManager={};	
(function(manager){
    var ResourceDownloader=function(){
    	this.resources = [];    	
    	this.callbackObj = [];
    	this.countLoaded=0;
    	
    	ResourceDownloader.prototype.init = function(jRes){
    		
    	};
    	
    	ResourceDownloader.prototype.loadRes = function(jRes){
    		if(jRes){
    			var type = jRes.type;
    			//相对路径
    			var path =  (jRes.path == undefined) ? './' : jRes.path;
    			var resArray = jRes.resArray;
    			
    			var that=this;
	            for(var i=0;i<resArray.length;i++){
	            	var e = document.createElement(type);
	            	e.id ='e_'+Math.random();	            	
	            	that.resources.push(e);					
					e.src =  path + resArray[i];    
					if(type === 'script')
						document.head.appendChild(e);
	                e.onload = function() {
	                    that.countLoaded++;
		                that.fire({
			                type:'loading',
			                args:[that.countLoaded,that.resources.length]
	                    });
	                 };
	                
	            }
    			
    		}
    		
    	};  	
    	
    	
    	
	   
	    /**
	     * 注册事件监听行为
	     * @param callback
	     */
	    ResourceDownloader.prototype.bind = function(callbackObj){
			if(callbackObj){
				this.callbackObj.push(callbackObj);
			}				
	    },
	    
	    
	    
	    ResourceDownloader.prototype.fire=function(jData){
	    	for(var i=0;i<this.callbackObj.length;i++){
	    		this.callbackObj[i].setProgress(jData);
	    	}
	    		
	    	
	    }    
    };
    manager.ResourceDownloader = ResourceDownloader;
    })(ResourceManager);

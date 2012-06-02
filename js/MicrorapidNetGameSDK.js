/**
 * @author Administrator
 */


//todo: 参考jquery的noConflict 机制，可以对SDK重命名，防止和开发商的类冲突
var MicrorapidNetGameSDK = {};
(function(sdk) {
	
	var Utils = function(){};
	Utils.prototype.cleanString2Json = function(rspTxt){
		var jsonData = window.JSON.parse(rspTxt);
		var stringData = jsonData.data;		
		var last = stringData.lastIndexOf('}');
		stringData = stringData.substring(0,last+1);
		jsonData = window.JSON.parse(stringData);
		return jsonData;
	}
	Utils.prototype.getFriends = function(rspTxt){
					
		var jsonData = this.cleanString2Json(rspTxt);
		//正常获取好友列表
		if(jsonData.code == '1'){
			frienListString = jsonData.list;
			jsonFriends = window.JSON.parse(frienListString);
		}
	}
	
	Utils.prototype.getPayMoneyResult = function(rspTxt){
		var jsonData = this.cleanString2Json(rspTxt);	
	}
	
	Utils.prototype.getQueryMoneyResult = function(rstTxt){
		var jsonData = this.cleanString2Json(rspTxt);
	}
	
	Utils.prototype.isObject = function(param){
		var b = (parma || typeof param == 'object');
		return b;
	}
	
	Utils.prototype.isFunction = function(param){
		var b = (param || typeof param == 'function');
		return b;
	}
	
	Utils.prototype.getKeyValueReg = function(str) {
	    var res = [];
	    var reg = /(\w+)=([^&]+)/g;
	    while ((a = reg.exec(str))) {
	        res.push(a[0]);       
	    }
	    return res;
	}
	
	var helper = new Utils();
	
	var AjaxType = {
		getFriendList	: 1,
		qcoins			: 2,
		ppay			: 3,
	}

	var Ajax = function(opt, ajaxType) {
		if(window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			this.xmlhttp = new XMLHttpRequest();
		} else {// code for IE6, IE5
			this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		var xmlhttp = this.xmlhttp, opt = opt || {};
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4) {
				switch(xmlhttp.status) {
					case 0:
						window.log('ajaxType:' + ajaxType);
						helper.isFunction(opt.error) && opt.error(xmlhttp);break;
					case 200:{
						var jsonData;
						switch(ajaxType){							
							case AjaxType.getFriendList:
								jsonData = helper.getFriends(xmlhttp.responseText);break;
							case AjaxType.qcoins:
								jsonData = helper.getQueryMoneyResult(xmlhttp.responseText);break;
							case AjaxType.ppy:
								jsonData = helper.getPayMoneyResult(xmlhttp.responseText);break;	
						}
						helper.isFunction(opt.success) && opt.success(jsonData);
						break;
						}
				}
			}
		}
		var method, url, async = true;
		
		helper.isFunction(opt.beforeSend) && opt.beforeSend(xmlhttp);
		opt.data && typeof opt.data == 'string' && ( method = 'POST');
		if(!method) {
			var type;
			opt.type && typeof opt.type == 'string' && ( type = opt.type.toLocaleUpperCase());
			(type == 'GET' || type == 'POST') ? ( method = type) : ( method = 'GET');
		}

		opt.async && typeof opt.async == 'boolean' && ( async = opt.async);
		opt.url && typeof opt.url == 'string' && ( url = opt.url);
		window.log('method :' + method);
		xmlhttp.open(method, url, async);
		
		if(opt.data){
			var data = opt.data;
			//发送post数据的关键设置代码
			xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
			xmlhttp.send(data);
		}else 
			xmlhttp.send();
		

		
	}
	var Proxy = function() {
		this.postUrl = "http://221.130.15.185:18000/json";		//dev
		this.cookie = this.getCookie();
	}
	
	Proxy.prototype.doPost = function(cmd, ajaxType ,successFunc, errorFunc) {
		var jsonData = {
			data : cmd,
			url : '1379/MLibok/main.swf',
			//md5 : 'a5cea1eac184bb7f2bee9e99e79b8961',
			md5	: 'c6e7c6a1b86042745fc64766b16bbe62',
			cookie : this.cookie,
		};

		var stringData = window.JSON.stringify(jsonData);
		window.log(stringData);
		
		var success,error;
		helper.isFunction(successFunc)? success = successFunc : success = function(jsonData) {
				window.log('success' + jsonData);				

		};
		
		helper.isFunction(errorFunc) ? error = errorFunc : error = function(xhr) {
				window.log('error' + xhr);
		};
		var opt = {
			url : this.postUrl,
			type : 'POST',
			data : "data=" + stringData,
			// data : stringData,
			async : true,
			success : success,
			error : error,
			beforeSend : function(xhr) {
				window.log('beforeSend' + xhr);
			}
		};		
		new Ajax(opt, ajaxType);
	}


	
	
	Proxy.prototype.getCookie = function() {
		var chromecookiefgdev = "token=PCDZ7QfsdDoHIiF1GkArgCesWJTthFT4zpkAAdbAFKIPa0fnyVtr0/BlpkyZ89WfDIotlb9dsUKyGK9ATvH5L2iENA/Z1ysFI9jv/GYqAL7LnkVLiyQlaconSB2CzGUo;appid=10002;gameid=1379;g_ut=3;PK=0;sid=AcWfxRIXEpKAmSjI_QqFhtc3;JumpURLExtraData=0|0|0|newwap|0|0;"
		var host = window.location.host, token;
		//必须使用dev 环境的cookie才能在fgnew 环境调试
		if(host.indexOf('dev') == -1)
			token = chromecookiefgdev;
		else {			
			paras = window.location.search;
			ret = helper.getKeyValueReg(paras);
			token = ret.join(';');
		}
		return token;
	}

	/**
	 * 获取好友列表
	 * @param successFunc 获取好友列表成功的回调
	 * @param errorFunc	获取好友列表失败的回调
	 */
	Proxy.prototype.getFriendList = function(successFunc, errorFunc) {		
		window.log('getFriendList');
		this.doPost('cmd=getFriendList', AjaxType.getFriendList, successFunc, errorFunc);
	}

	/**
	 * 获取账户余额
	 * @param successFunc 获取账户余额成功的回调
	 * @param errorFunc	获取账户余额失败的回调
	 */
	Proxy.prototype.queryAccountBalance = function(successFunc, errorFunc) {
		window.log('queryAccountBalance');
		this.doPost('cmd=qcoins', AjaxType.qcoins, successFunc, errorFunc);
	}
	
	/**
	 * 购买商品请求支付接口
	 * @param successFunc 支付成功的回调
	 * @param errorFunc	支付失败的回调
	 */
	Proxy.prototype.payMoney = function(goods, successFunc, errorFunc) {
		window.log('payMoney');
		this.doPost('cmd=ppay&' + goods.toString(), AjaxType.ppay, successFunc, errorFunc);
	}

	/**
	 * 跳转到充值页面的请求
	 */
	Proxy.prototype.go2ReCharge = function() {
		window.log('go2ReCharge');
		var key = 'gameid=';
		var params = window.location.search;
		var start = params.indexOf(key), end, gameid;
		if(start > -1) {
			end = params.indexOf('&', start);
			start += key.length;
			if(end == -1)
				gameid = params.substring(start);
			else
				gameid = params.substring(start, end);
		} else {
			window.log('gameid not exist, use default for test');
			gameid = 1225;
		}
		window.log(gameid);
		window.location = 'http://flash' + gameid + '.mbdev.3g.qq.com';
	}
	
	/**
	 * 对游戏中购买的商品的封装类
	 * @param id 所购买商品的id
	 * @param price 所购买商品的单价
	 * @param num 所购买商品的数量
	 */
	var Goods = function(id, price, num) {
		this.id = id;
		this.price = price, this.num = num;

		Goods.prototype.toString = function() {
			var s = ['propid=', this.id, "&price=", this.price, '&num=', this.num];
			return s.join('');
		}
	}
	
	

	sdk.Proxy = Proxy;
	sdk.Goods = Goods;	
	/*
	sdk.getKeyValueRegTest = function(){
		var a='?name=zhiyelee&blog=www.tsnrose.com&name=zhiyelee&blog=www.tsnrose.com&name=zhiyelee&blog=www.tsnrose.com';
		return helper.getKeyValueReg(a);
	}
	*/
	
	window.debug = true;
	window.log = function(b) {
		if(window.debug) {
			window.console && window.console.log(b); 
		}
	}

})(MicrorapidNetGameSDK);

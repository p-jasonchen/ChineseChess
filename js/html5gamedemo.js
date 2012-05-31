$(document).ready(function() {
	var proxy = new MicrorapidNetGameSDK.Proxy();
	
	function createFriendListHtml (jsonFriends) {
		var array = [];
		
	  	array.push('<div id="friends"><ul class="horizontal_nav">');
	  	
	  	for(i = 0; i < jsonFriends.length&& i < 10; i++){
	  		friend = jsonFriends[i];
		  	array.push('<li class="friend"><ul><li>openid：<span class="openid">'
		  		 + friend.openid + '</span></li><li>昵称：<span class="nickname">'
				 + friend.nickname + '</span></li></ul></li>');
		}
	  	array.push('</ul></div>');
	  	return array.join('');
	  	
	}
	
	function showFriendList(data){
	 	jsonData = window.JSON.parse(data);
		stringData = jsonData.data;		
		last = stringData.lastIndexOf('}');
		stringData = stringData.substring(0,last+1);
		////window.log('stringData:' + stringData);	
		jsonData = window.JSON.parse(stringData);			
		
		//正常获取好友列表
		if(jsonData.code == '1'){
			frienListString = jsonData.list;
			jsonFriends = window.JSON.parse(frienListString);
			html = createFriendListHtml(jsonFriends);
			$("#container").html(html);
		}else{
			var array = [];	
		  	array.push('<div class="result"><ul class="horizontal_nav">');
		  	array.push('<li class="desc">' + jsonData.desc + '</li><li class="orderid"></li>');
		  	array.push('</ul></div>'); 	
		  	html = array.join('');
			$("#container").html(html);			
		}	
		
	}
	
	function showBuyPropResult(data){
		jsonData = window.JSON.parse(data);
		stringData = jsonData.data;
		last = stringData.lastIndexOf('}');
		stringData = stringData.substring(0,last+1);
		//window.log('stringData:' + stringData);	
		jsonData = window.JSON.parse(stringData);		
		
		$(".result").show();
		if(jsonData.code >= '0'){
			$(".result .desc").html('单号：');			
			$(".result .orderid").html(jsonData.orderid);
		}else{
			$(".result .desc").html(jsonData.code);
			$(".result .orderid").html(jsonData.desc);
		}
		
	}
	
	function showQueryMoneyResult(data){
		jsonData = window.JSON.parse(data);
		stringData = jsonData.data;		
		last = stringData.lastIndexOf('}');
		stringData = stringData.substring(0,last+1);
		//window.log('stringData:' + stringData);	
		jsonData = window.JSON.parse(stringData);		
		
		var array = [];	
		array.push('<div class="result"><ul class="horizontal_nav">');
		array.push('<li class="desc"></li><li class="balance"></li>');
		array.push('</ul></div>'); 	
		html = array.join('');
		$("#container").html(html);			
		
		if(jsonData.code == '0'){
			$(".result .desc").html('余额：');			
			$(".result .balance").html(jsonData.balance);
		}else{
			$(".result .desc").html(jsonData.code);
			$(".result .balance").html(jsonData.desc);
		}	
	}
	
	function resetContainer () {
	  $("#container").html('');
	}
	
	chongzhi = function (){		
		proxy.go2ReCharge();	
	}
	
	
	 doBuyProp = function (btn){
		div = $(btn).parent().parent();
		propid = div.children(".propid").val();		
		price = div.children('.prop_price_div').children('.prop_price').html();
		num = div.children('.prop_num').children('select').val();		
		var goods = new MicrorapidNetGameSDK.Goods(propid, price, num);
		proxy.payMoney(goods, showBuyPropResult);
	}	
	
	

	
	
	var getFriendsBtn = $("#get_friend_list_fgdev");	
	getFriendsBtn.click(function(){		
		resetContainer();
		//doPost(getCookie(),fgdevurl, 'cmd=getFriendList' ,showFriendList);
		proxy.getFriendList(showFriendList);
	});
	
	$('#query_money').click(function(){
		resetContainer();
		//doPost(getCookie(),fgdevurl, 'cmd=qcoins', showQueryMoneyResult);
		proxy.queryAccountBalance(showQueryMoneyResult);
	});
	
	$('#buy_prop').click(function(){
		resetContainer();
		$("#container").load('ppay.html');
		// $("#container").load('ppay');
		
	});	
	
});

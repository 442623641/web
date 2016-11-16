var search={
		newFlag:true,
		query:function(key){
			search.newFlag=true;
			$('input[type=search]').blur();
			stackList.sort='favo_count';
			stackList.tag=key;
			$$('.page-stack-list').length?mainView.router.reloadPage('stackList.html?sort=favo_count&tag='+key):mainView.router.loadPage('stackList.html?sort=favo_count&tag='+key);
			search.setKey(key);
			
		},
		setKey:function (val){
			var storage=window.localStorage;
			var keys=storage.getItem("keys");
			var keysArray=[];
			if(!keys)
			{
				keysArray.push(val);
			}else{
				keysArray=JSON.parse(keys);
				var index = keysArray.indexOf(val);
	            if (index > -1) {
	            	keysArray.splice(index, 1);
	            }
	            keysArray.push(val);
	            if(keysArray.length>10){
	            	keysArray.splice(-10, keysArray.length-10);
	            }
	            
			}
			storage.setItem('keys',JSON.stringify(keysArray));
		},
		getKeys:function(){
			var storage=window.localStorage;
			var keys=storage.getItem("keys");
			if(!keys||keys=='[]'){
				return;
			}
			var html=[];
			var keysArray=JSON.parse(keys);
			for(var i=keysArray.length-1;i>=0;i--){
				var item='<li class="swipeout transitioning"><div class="swipeout-content">'+
			             '<a href="javascript:search.query(\''+keysArray[i]+'\');" class="item-content"><div class="item-media"><i class="icon icon-remeber"></i></div>'+
			             '<div class="item-inner"><div class="item-text">'+keysArray[i]+'</div></div></a></div>'+
			             '<div class="swipeout-actions-right"><a href="javascript:search.removeKey('+i+');" class="swipeout-delete">移除</a></div>'+
			             '</li>';
				//javascript:search.removeKey('+i+')
				html.push(item);
			}
			$$('.popup-search .remeber').html('<div class="search-title">最近搜索过</div><div class="list-block"><ul>'+html.join('')+
			'<li><a href="javascript:search.removeKeys();" class="item-content"><div class="item-inner"><div class="item-text item-cleartext">清除搜索历史</div></div></a></li></ul></div></div>');
			search.newFlag=false;
			
		},
		removeKeys:function(){
			var storage=window.localStorage;
			$$('.popup-search .remeber').remove();
			localStorage.removeItem("keys");
			search.newFlag=true;
		},
		removeKey:function(index){
			var storage=window.localStorage;
			var keys=storage.getItem("keys");
			if(!keys){
				return;
			}
			var keysArray=JSON.parse(keys);
			$$('.popup-search .remeber .list-block li').eq(keysArray.length-1-index).remove();
			keysArray.splice(index, 1);
			storage.setItem('keys',JSON.stringify(keysArray));
			search.newFlag=true;
			
		},
		resetStorage:function (){
			var storage=window.localStorage;
			var keys=storage.getItem("keys");
			var keysArray=[];
			var ele=$$('.search .remeber .list-block li .item-text');
			for(var i=ele.length-2;i>=0;i--){
				keysArray.push(ele[i].textContent);
			}
			storage.setItem('keys',JSON.stringify(keysArray));
		}
};
(function(){
	$$('.popup-search').on('opened', function () {
		search.newFlag&&search.getKeys();
		$$('.popup-search .searchbar input[type=search]').val(stackList.tag);
		$$('.popup-search .searchbar').addClass('searchbar-active');
		$('.popup-search .searchbar input[type=search]').focus();
		
	});
	$$('.popup-search .searchbar input[type=search]').on('keyup', function (e) {
		var text=$$(this).val().replace(/(^\s*)|(\s*$)/g,'');
		(e.keyCode === 13&&text)&&search.query(text);
	});
	
})();

// Initialize your app
var myApp = new Framework7({
	modalTitle: '吃货',
	animateNavBackIcon : true,
	// Enable templates auto precompilation
	precompileTemplates : true,
	// Enabled pages rendering using Template7
	template7Pages : true,
	swipePanel: 'left',
	cache : true,
	uniqueHistory:true,
	onAjaxStart: function (xhr) {
        myApp.showIndicator();
    },
    onAjaxComplete: function (xhr) {
        myApp.hideIndicator();
    }
});

// Export selectors engine
var $$ = Dom7;
// Add main View
var mainView = myApp.addView('.view-main', {
// Enable dynamic Navbar
	dynamicNavbar: true,
	domCache: true
});
$$(document).on('pageInit', function(e) {
	$$('.toolbar-inner a').removeClass('active');
	$$('.toolbar-inner a').on('click', function () {
		$$('.toolbar-inner a').removeClass('active');
		$$(this).addClass('active');
		
	});
	var page = e.detail.page;
	switch (page.name) {
	case 'index':
		
		break;
//	case 'material':
////		material.link = page.query.id;
////		material.loadData(material.link);
////		
////		materialDetail.load(page.query.id);
//		break;
	case 'market':
		$$('.toolbar a').eq(1).addClass('active');
			if(market.name!= page.query.name||
					$$('.page-market .plan').length<10){
			if(typeof(page.query.marketID)!="undefined"){
				market.marketID =page.query.marketID;
				market.name = page.query.name;
			}
			market.init();
		}
		break;
	case 'stack':
		$$('.toolbar a').eq(2).addClass('active');
		dg.init();
		break;
	case 'dish':
		dish.id = page.query.id;
		dish.loadData(dish.id);
		break;
	case 'stackList':
		stackList.tag = page.query.tag;
		stackList.sort = page.query.sort;
		stackList.init();
		break;
	default:
		break;
		$$('.toolbar a').eq(3).addClass('active');
	}

});
sections();
var swiper = new Swiper('.swiper-container', {
	pagination : '.swiper-pagination',
	centeredSlides : true,
	autoplay : 2500,
	autoplayDisableOnInteraction : false
});

function sections() {
	$$.getJSON('../index.php/api/Menu/index',function(data){
		if (data.length > 0) {
			var template = Template7.templates.sections(data);
			$$('.page-home .page-content').append(template);
			for(var i=0;i<data.length;i++){
				if(typeof(data[i].hots)!='undefined'){
					var html=[];
					var hots=data[i].hots;
					for(var j=0;j<hots.length;j++){
						var item='<div class="button"><a href="stackList.html?tag='+hots[j]+'&sort=favo_count">'+hots[j]+'</a></div>';
						html.push(item);
					}
					$('.'+data[i].title+' .previews-wrapper .preview').eq(2).after(
							'<div class="preview preview--recipe" name="li" style="background:transparent;"><div class="hots">'+html.join('')+'</div></div>'	
					);
				}
				flow(data[i].title,8, 8);
			}
		} else {
			myApp.alert("不要急,再刷新下", '');
		}});
}

function flow(parn,mh, mv) { //参数mh和mv是定义数据块之间的间距，mh是水平距离，mv是垂直距离 
	//$$('section .previews-wrapper').eq(1).parent().remove();
	var parent=document.getElementsByClassName(parn)[0];
	if(parn!='well-chosen'){
		var last=$(parent).prev().find('.preview').last();
		parent.style.top=last.offset().top-170+ "px";
	}
	var w = document.documentElement.offsetWidth; //计算页面宽度 
	var ul = parent.getElementsByClassName("previews-wrapper")[0];
	var li = ul.getElementsByClassName("preview");
	var firstimg=li[0].getElementsByClassName("center-cropped-image")[0];
	firstimg.style.height=firstimg.offsetHeight+50+ "px";
	var iw = li[0].offsetWidth + mh; //计算数据块的宽度 
	var c = Math.floor(w / iw); //计算列数 
	ul.style.width = iw * c - mh + "px"; //设置ul的宽度至适合便可以利用css定义的margin把所有内容居中 
	var liLen = li.length;
	var lenArr = [];
	for (var i = 0; i < liLen; i++) { //遍历每一个数据块将高度记入数组 
		lenArr.push(li[i].offsetHeight);
	}

	var oArr = [];
	for (var i = 0; i < c; i++) { //把第一行排放好，并将每一列的高度记入数据oArr 
		li[i].style.top = "0";
		li[i].style.left = iw * i + "px";
		li[i].style.opacity = "1";
		li[i].style["-moz-opacity"] = "1";
		li[i].style["filter"] = "alpha(opacity=100)";
		oArr.push(lenArr[i]);
	}

	for (var i = c; i < liLen; i++) { //将其他数据块定位到最短的一列后面，然后再更新该列的高度 
		var x = _getMinKey(oArr); //获取最短的一列的索引值 
		li[i].style.top = oArr[x] + mv + "px";
		li[i].style.left = iw * x + "px";
		li[i].style.opacity = "1";
		li[i].style["-moz-opacity"] = "1";
		li[i].style["filter"] = "alpha(opacity=100)";
		oArr[x] = lenArr[i] + oArr[x] + mv; //更新该列的高度 
	}
}
//获取数字数组的最大值 
function _getMaxValue(arr) {
	var a = arr[0];
	for (var k in arr) {
		if (arr[k] > a) {
			a = arr[k];
		}
	}
	return a;
}
//获取数字数组最小值的索引 
function _getMinKey(arr) {
	var a = arr[0];
	var b = 0;
	for (var k in arr) {
		if (arr[k] < a) {
			a = arr[k];
			b = k;
		}
	}
	return b;
} 


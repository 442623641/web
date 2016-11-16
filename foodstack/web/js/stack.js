var dg = {
	catalogs : function(data) {
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var content = [];
			var tags = data[i].tags;
			for (var j = 0; j < tags.length; j += 3) {
				var row = [];
				if (tags[j] != undefined) {
					row.push('<div class="col-33"><a href="stackList.html?tag='
							+ tags[j].t +'&sort=favo_count" class="button">' + tags[j].t + '</a></div>');
				}
				if (tags[j + 1] != undefined) {
					row.push('<div class="col-33"><a href="stackList.html?tag='
							+ tags[j + 1].t + '&sort=favo_count" class="button">' + tags[j + 1].t
							+ '</a></div>');
				}
				if (tags[j + 2] != undefined) {
					row.push('<div class="col-33"><a href="stackList.html?tag='
							+ tags[j + 2].t +  '&sort=favo_count" class="button">' + tags[j + 2].t
							+ '</a></div>');
				}
				content.push('<div class="row">' + row.join('') + '</div>');
			}
			html.push('<li class="accordion-item"><a href="#" class="item-content item-link">'
							+ '<div class="item-media"><img src="images/stack/'
							+ data[i].icon_f
							+ '" width="44"></div>'
							+ '<div class="item-inner">'
							+ '<div class="item-title">'
							+ data[i].name
							+ '</div></div></a>'
							+ '<div class="accordion-item-content" style="">'
							+ '<div class="content-block">'
							+ content.join('')
							+ '</div></div></li>');
		}
		return html.join('');
	},
	init : function() {
		$$('.page-stack .list-block ul .accordion-item').length<10&&
		$$('.page-stack .list-block ul').html(dg.catalogs(catalogs));
	}
};
var stackList = {
	index : 1,
	size : 20,
	baseUrl : '../index.php/api/Stack/menu',
	data : [],
	total : 0,
	sort:'favo_count',
	tag : '',
	loadData : function(refresh) {
		if (stackList.data.length > 0 && stackList.index == prevStack.index
				&& stackList.size == prevStack.size && !refresh
				&& stackList.tag == prevStack.tag&&stackList.sort == prevStack.sort) {
			stackList.draw(stackList.data);
			return stackList.data;
		}
		var url=stackList.baseUrl + '/tag/' + stackList.tag+ '/sort/'+ stackList.sort+ '/index/' + stackList.index+ '/pageSize/' + stackList.size;
		$$.getJSON(url,function(json) {
				if (json.docs && json.docs.length > 0) {
					stackList.draw(json.docs);
					stackList.data = json.docs;
					if (stackList.index == 1) {
						stackList.total = json.numFound;
						stackList.loadMore();
					}
					prevStack.size = stackList.size;
					prevStack.index = stackList.index;
					stackList.index++;
					prevStack.tag = stackList.tag;
					return stackList.data;
				} else {
					// myApp.alert("网络太慢,放弃加载",'');
					$$('.page-stack .searchbar-not-found').show();
					$$('.page-stack .infinite-scroll-preloader')
							.remove();
				}
		});
	},
	lastData : function(refresh) {
		if (stackList.data.length > 0 && stackList.index == prevStack.index
				&& stackList.size == prevStack.size && !refresh
				&& stackList.tag == prevStack.tag&&stackList.sort == prevStack.sort) {
			stackList.draw(stackList.data);
			return stackList.data;
		}
		$$.ajax({
			url :  '../index.php/api/Menu/stack/top/20/sort/'+ stackList.sort ,
			type : 'get',
			dataType : 'json',
			success : function(data) {
				if (data.length > 0) {
					stackList.draw(data);
					stackList.data = data;
					if (stackList.index == 1) {
						stackList.total = 100;
						stackList.loadMore();
					}
					prevStack.size = stackList.size;
					prevStack.index = stackList.index;
					stackList.index++;
					prevStack.tag = stackList.tag;
					return stackList.data;
				} else {
					// myApp.alert("网络太慢,放弃加载",'');
					$$('.page-stack .searchbar-not-found').show();
					$$('.page-stack .infinite-scroll-preloader').remove();
				}
			},
			error : function() {
				$$('.page-stack .searchbar-not-found').show();
				$$('.page-stack .stack-content .infinite-scroll-preloader').remove();
			}
		});

	},
	getTop:function(sort){
		$$.ajax({
			url : '../index.php/api/Menu/stack/top/20/sort/favo_count',// 跳转 action
			type : 'get',
			cache : true,
			success : function(data) {
				if (data.length > 0) {
					var html=[];
					var swiper = new Swiper('.swiper-container', {
				        pagination: '.swiper-pagination',
				        centeredSlides: true,
				        autoplay: 3000,
				        autoplayDisableOnInteraction: false
				    });
					var re={index:1,ul:[]};
					for(var i=0;i<data.length;i+=2){
						data[i].pic=data[i].pic.replace(/170/, "320x320");
						data[i+1].pic=data[i+1].pic.replace(/170/, "320x320");
						var items=[];
						items.push(data[i]);
						items.push(data[i+1]);
						re.ul.push(items);
					}
					var wonderfulList = Template7.templates.wonderfulList(re);
					//$$('div[data-page="index"] .page-content .hand-picked .card-content-inner').append(html2.join(''));j_WonderfulList
					$$('.page-home .page-content #j_WonderfulList').append(wonderfulList);
				    
				} else {
					myApp.alert("网络太慢,放弃加载",'');
				}
			},
			error : function() {
				myApp.alert("网络太慢,放弃加载",'');
			}
		});
	},
	template : function(data) {
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var item = '<div class="card facebook-card">'
					+ '<a href="javascript:stackStep.load('
					+ (data[i].id==undefined? data[i].ID:data[i].id)
					+ ')"><div class="card-content">'
					+ '<div class="card-content-inner">'
					+ '<div class="cp_pic"><img src="'
					+ data[i].pic.replace(/170/, "400x300")
					+ '"></div><h3>'+data[i].title+ '</h3>'
					+ '<p class="color-666">'
					+ data[i].comment
					+ '</p>'
					+ '</div></div></a>'
					+ '<div class="card-footer"><a href="#" class="link">浏览'
					+ data[i].vc
					+ '</a><a href="javascript:myApp.alert(\"对不起,正在开发中...\",\"\")" class="post_comments">评论'
					+ data[i].favo_count
					+ '</a><a href="javascript:myApp.alert(\"对不起,正在开发中...\",\"\")" class="link">赞'
					+ data[i].clicks + '</a></div>' + '</div>';
			html.push(item);
		}
		return html.join('');
	},
	draw : function(data) {
		//$$("#stackList .page-content .navbar .center").text(data.title);
		$('#stackList .infinite-scroll-preloader').before(stackList.template(data));
	},
	loadMore : function() {
		// 加载flag
		var loading = false;
		// 上次加载的序号
		var lastIndex = $$('.page-satck-list .stack-content .facebook-card').length;
		// 注册'infinite'事件处理函数
		$$('.infinite-scroll')
				.on(
						'infinite',
						function() {
							// 如果正在加载，则退出
							if (loading)
								return;
							// 设置flag
							loading = true;
							// 模拟1s的加载过程
							setTimeout(
									function() {
										// 重置加载flag
										loading = false;
										if (lastIndex >= stackList.total) {
											// 加载完毕，则注销无限加载事件，以防不必要的加载
											myApp.detachInfiniteScroll($$('.page-satck-list .infinite-scroll'));
											// 删除加载提示符
											$$('.page-satck-list .infinite-scroll-preloader').remove();
											return;
										}
										// 生成新条目的HTML
										stackList.loadData(true);
										// 更新最后加载的序号
										lastIndex = $$('.page-satck-list .stack-content .facebook-card').length;
									}, 1000);
						});
	},
	init : function() {
		$$('.page-satck-list input[type="search"]').val(stackList.tag);
		if(stackList.tag!='今日最新'){
			stackList.loadData(true);
		}else{
			stackList.lastData(true);
		}		
		// stackList.draw(stackList.data);
	}
};

var prevStack = {
	index : -1,
	size : 20,
	data : [],
	tag : '',
	sort:null
};

//stackList.getTop();
var market = {
	imgsrc : function(floder, link, w, h, ext) {
		// imageView2/1/w/200/h/200
		// return
		// 'http://7xrjnb.com1.z0.glb.clouddn.com/images/'+floder+'//'+link+'.'+ext+'?imageMogr2/thumbnail/'+w+'x'+h+'/interlace/1';
		var para = 'imageView2/2/w/' + w + '/h/' + h + '/interlace/1';
		if (w > 100) {
			para = 'watermark/2/text/d3d3LmNhaXNoaW9uLmNvbQ==/fill/I0QwRDRENg==/interlace/1';
			;
		}
		return 'http://7xrjnb.com1.z0.glb.clouddn.com/images/' + floder + '//'
				+ link + '.' + ext + '?' + para;
	},
	index : 1,
	pageSize : 200,
	baseUrl : '../index.php/api/Markets/market',
	marketID : 172,
	markets : [],
	name : '上海虹桥',
	data : [],
	loadData : function(refresh) {
		$$('.page-market .center span').text(market.name);
		if (this.data.length > 0 && this.index == prevData.index
				&& this.size == prevData.size
				&& this.marketID == prevData.marketID
				&& this.date == prevData.date && !refresh) {
			this.draw(market.data);
			return this.data;
		}
		$$.ajax({
			url : this.baseUrl + '/index/' + this.index + '/pageSize/'
					+ this.pageSize + '/marketID/' + this.marketID,// 跳转
			// action
			type : 'get',
			cache : true,
			dataType : 'json',
			success : function(data) {
				if (data) {
					market.draw(data);
					market.data = data;
					prevData.pageSize = market.pageSize;
					prevData.index = market.index;
					prevData.marketID = market.marketID;

					return market.data;
				} else {
					myApp.alert("网络太慢,放弃加载", '');
				}
			},
			error : function() {
				myApp.alert("网络太慢,放弃加载", '');
			}
		});
	},
	draw : function(data) {
		//$$('.page-market .center span').text(market.name);
		var mylist = [];
		for (var i = 0; i < data.length; i++) {
			var id = market.getFoodType(data[i].name);
			mylist['"' + id + '"'] = myApp.virtualList(
					'.page-market #' + id + ' .pricing-table', {
						cache : true,
						height:63,
						rowsAfter : 0,
						items : data[i].food,
						renderItem : function(index, item) {
							return '<div class="plan"><a href="javascript:materialDetail.load('
									+ item.link+ ')"><h3><b>'+item.name+'</b><span style="background:url('
									+ market.imgsrc('material', item.link, 75,75, 'jpg')+') no-repeat center 100%;'
								    +'background-size: 100%;"></span></h3></a>'
									+'<ul><li><b>'
									+ parseFloat(item.avgPrice).toFixed(2)
									+ '</b> 元/kg</li></ul></div>';
											

						},
					});
			
		}
		$$('.loading-block').hide();
	},
	getSelMarket : function() {
		if (!this.markets.length) {
			$$.ajax({
				url : '../index.php/api/Markets/provinceMarket',// 跳转 action
				type : 'get',
				cache : true,
				dataType : 'json',
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization',
							'Basic Zm9vZHN0YWNrOjEyMzQ1Ng==');
				},
				success : function(data) {
					market.markets = data;
					market.drawSelMarket(market.markets);
					market.getMarket=true;
				}
			});
		} else {
			this.drawSelMarket(this.markets);
		}

	},
	drawSelMarket : function(data) {
		
		$$('.popup-selMarket .navbar_page_center a').text(
				'当前-' + $$('.page-market .center span').text());
		var html = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].market) {
				var htmlPro = [];
				var rows = data[i].market;
				for (var j = 0; j < rows.length; j++) {
					var item = '<div class="col-0"><a href="#" data-name="'
						+ rows[j].name + '" data-id="'
						+ rows[j].ID + '" class="close-popup">'
							+ rows[j].name + '</a></div>';
					htmlPro.push(item);
				}
				var str = '<h2 >' + data[i].name
						+ '</h2><div class="no-gutter row">'
						+ htmlPro.join('') + '</div></div>';
				html.push(str);
			}
		}
		$$('.popup-selMarket .selMarket .content-block').html(html.join(''));
		$$('.popup-selMarket .content-block .row a').on('click', function () {
			market.name=$$(this).attr('data-name');
			market.marketID=$$(this).attr('data-id');
			$$('.page-market .center span').text(market.name);
			market.loadData();
		});
	},
	init : function() {
		this.loadData();
		$$('.popup-selMarket').on('opened', function () {
			market.getSelMarket();
		});
	},
	getFoodType:function(name) {
		switch (name) {
		case "蔬菜":
			return "vegetables";
		case "水果":
			return "fruits";
		case "生鲜":
			return "fresh";
		case "水产":
			return "aquatic";
		case "其它":
			return "others";
		case 1:
			return "蔬菜";
		case 2:
			return "水果";
		case 3:
			return "生鲜";
		case 4:
			return "水产";
		case 5:
			return "其他";

		}
	}
};
var material = {
	name : '',
	baseUrl : '../index.php/api/Markets/material/link',
	loadData : function(link) {
		// $('#pages_maincontent
		// .main-img').attr('data-src',market.imgsrc('food1',material.link,400,200,'png'));
		$$(
				'.page-material .demo-card-header-pic .card-header')
				.css(
						'background-image',
						'url('
								+ market.imgsrc('food1', this.link, 200,
										100, 'png') + ')');
		// background-image:url(http://lorempixel.com/1000/600/people/6/)
		if (prevData.link === this.link && this.data) {
			this.draw(this.data);
			return;
		}
		$$.ajax({
			url : this.baseUrl + '/' + this.link,// 跳转 action
			type : 'get',
			cache : true,
			dataType : 'json',
			beforeSend : function(xhr) {
				xhr.setRequestHeader('Authorization',
						'Basic Zm9vZHN0YWNrOjEyMzQ1Ng==');
			},
			success : function(data) {
				if (data) {
					material.draw(data);
					material.data = data;
					prevData.link = material.link;
					prevData.name = data.name;
					material.name = data.name;
					$$('#menu').on('show', function() {
						menu.getMenu(material.name);
					});
					$$('#price').on('show', function() {
						price.getPrice(material.link, market.marketID);
					});
				} else {
					myApp.alert("网络太慢,放弃加载", '');
				}
			},
			error : function() {
				myApp.alert("网络太慢,放弃加载", '');
			}
		});
	},
	draw : function(data) {
		var html = [];
		var items = data.content;
		if (!data.content) {
			return;
		}

		$$("#material .page-content .navbar_page_center").text(data.name);
		for (var i = 0; i < items.length; i++) {
			var precent = items[i].nrv > 100 ? 100 : items[i].nrv;
			var item = '<tr><td>' + items[i].key + '</td><td class="capacity">'
					+ items[i].value + ' &nbsp;' + items[i].unit
					+ '</td><td class="progress"><span style="width:' + precent
					+ '%;float:left;"></span><td  class="nrv">' + items[i].nrv
					+ '%</td></td></tr>';
			html.push(item);
		}
		$$('.loading-block').remove();
		$$('#material #pages_maincontent .content-table tbody').html(
				html.join(''));
		// "goodcp": [{ "pic": 1494,"name": "猪肉","description":
		// "菠萝里含有菠萝蛋白酶，可分解猪肉蛋白，促进人体消化吸收。"}],page_single
		var gd = this.listOf('最佳拍档', data.goodcp);
		var bd = this.listOf('坑爹组合', data.badcp);
		var desc = this.descOf(data.description);
		$$("#material #pages_maincontent #desc").append(gd + bd + desc);
		$$('.loading-block').hide();
	},

	link : null,
	data : null,
	listOf : function(title, data) {
		if (!data.length) {
			return '';
		}
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var item = '<li><div class="item-content"><div class="item-media"><img src="'
					+ market.imgsrc('material', data[i].pic, 65, 65, 'jpg')
					+ '"></div><div class="item-inner"><div class="item-subtitle">'
					+ data[i].name
					+ '</div><div class="item-text">'
					+ data[i].description + '</div></div></div></li>';
			html.push(item);
		}
		// return '<li class="list-group-title">'+title+'</li>'+html.join('');
		return ('<div class="card"><div class="card-header">'
				+ title
				+ '</div><div class="card-content">'
				+ '<div class="list-block media-list contacts-list" style="display:block;"><ul>'
				+ html.join('') + '</ul></div></div></div>');
	},
	descOf : function(data) {
		if (!data.length) {
			return '';
		}
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var item = '<li><div class="item-content"><div class="item-inner"><div class="item-subtitle">'
					+ data[i].title
					+ '</div><div class="item-text">'
					+ data[i].content.join('</br>') + '</div></div></li>';
			html.push(item);
		}
		return ('<div class="card"><div class="card-content">'
				+ '<div class="list-block media-list contacts-list" style="display:block;"><ul>'
				+ html.join('') + '</ul></div></div></div>');

	}
}
var menu = {
	data : [],
	name : material.name,
	baseUrl : '../index.php/api/Menu/menu/index/1/pageSize/30/name',
	getMenu : function(name) {
		$$('.loading-block').show();
		if (prevMenu.name === this.name && this.data.length > 0) {
			this.draw(this.data);
			return;
		}
		$$.ajax({
			url : this.baseUrl + '/' + name,// 跳转 action
			type : 'get',
			cache : true,
			dataType : 'json',
			beforeSend : function(xhr) {
				xhr.setRequestHeader('Authorization',
						'Basic Zm9vZHN0YWNrOjEyMzQ1Ng==');
			},
			success : function(data) {
				if (data) {
					menu.data = data;
					menu.draw(data);
					prevMenu.data = data;
					prevMenu.link = material.link;
					prevMenu.name = material.name;
					$$('.loading-block').hide();
				} else {
					myApp.alert("网络太慢,放弃加载", '');
				}
			},
			error : function() {
				myApp.alert("网络太慢,放弃加载", '');
			}
		});
	},
	list : function(data) {
		if (!data.length) {
			return '';
		}
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var item = '<li><a href="dish.html?id='
					+ data[i].ID
					+ '" class="item-content"><div class="item-media"><img src="'
					+ data[i].pic
					+ '"/></div><div class="item-inner"><div class="item-subtitle">'
					+ data[i].name + '</div><div class="item-text">'
					+ data[i].brief + '</div></div></a></li>';
			html.push(item);
		}
		// return '<li class="list-group-title">'+title+'</li>'+html.join('');
		return ('<div class="list-block media-list contacts-list" style="display:block;"><ul>'
				+ html.join('') + '</ul></div>');
	},
	draw : function(data) {
		$$("#material #pages_maincontent #menu").prepend(this.list(data));
	}

}
var price = {
	data : [],
	baseUrl : '../index.php/api/Markets/priceOfprovince',
	getPrice : function(link, marketID) {
		$$('.loading-block').show();
		if (prevPrice.marketID === marketID && this.data.length > 0
				&& prevPrice.link == link) {
			// menu.draw(menu.data);
			return;
		}
		$$.ajax({
			url : this.baseUrl + '/link/' + link + '/marketId/' + marketID,// 跳转
			// action
			type : 'get',
			cache : true,
			dataType : 'json',
			beforeSend : function(xhr) {
				xhr.setRequestHeader('Authorization',
						'Basic Zm9vZHN0YWNrOjEyMzQ1Ng==');
			},
			success : function(data) {
				if (data) {
					price.data = data;
					price.draw(data);
					prevPrice.data = data;
					prevPrice.link = link;
					prevPrice.marketID = marketID;
					$$('.loading-block').hide();
				} else {
					myApp.alert("网络太慢,放弃加载", '');
				}
			},
			error : function() {
				myApp.alert("网络太慢,放弃加载", '');
			}
		});
	},
	list : function(data) {
		if (!data.length) {
			return '';
		}
		var html = [];
		for (var i = 0; i < data.length; i++) {
			var item = '<li><div class="item-content"><div class="item-media"><i class="icon icon-market"></i></div><div class="item-inner"><div class="item-subtitle">'
					+ data[i].name
					+ '</div><div class="item-subtext">'
					+ parseFloat(data[i].avgPrice).toFixed(2)
					+ '元/kg</div></div></li>';
			html.push(item);
		}
		return ('<div class="list-block contacts-list" style="display:block;"><ul>'
				+ html.join('') + '</ul></div>');
	},
	draw : function(data) {
		$$("#material #pages_maincontent #price").html(this.list(data));
	}

}

var prevData = {
	index : 1,
	pageSize : 10,
	marketID : 56,
	name : '',
	data : [],
	link : -1
}
var prevMenu = {
	name : '',
	data : [],
	link : -1,
}
var prevPrice = {
	marketID : '',
	data : [],
	link : -1,
}

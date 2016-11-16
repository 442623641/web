var menus={
	imgsrc:function(floder,link,w,h,ext){
		//imageView2/1/w/200/h/200
		//return 'http://7xrjnb.com1.z0.glb.clouddn.com/images/'+floder+'//'+link+'.'+ext+'?imageMogr2/thumbnail/'+w+'x'+h+'/interlace/1';
		var para='imageView2/2/w/'+w+'/h/'+h+'/interlace/1';
		if(w>100){
			para='watermark/2/text/d3d3LmNhaXNoaW9uLmNvbQ==/fill/I0QwRDRENg==/interlace/1';;
		}
		return 'http://7xrjnb.com1.z0.glb.clouddn.com/images/'+floder+'//'+link+'.'+ext+'?'+para;
	},
	index:1,
	size:12,
	baseUrl:'../index.php/api/Menu/menus',
	data:[],
	total:0,
	name:null,
	loadData:function(refresh,name){ 
		if(menus.data.length>0&&menus.index==prevData.index
			&&menus.size==prevData.size&&!refresh&&menus.name==prevData.name){
			menus.draw(market.data);
			return menus.data;
		}
		if(name!=null){
			menus.baseUrl=menus.baseUrl+'/name/'+name;
		}
		 $$.ajax( {  
		     url:menus.baseUrl+'/index/'+menus.index+'/pageSize/'+menus.size,// 跳转 action	      
		     type:'get',  
		     cache:true,  
		     dataType:'json',  
		     beforeSend: function (xhr) { xhr.setRequestHeader ('Authorization', 'Basic Zm9vZHN0YWNrOjEyMzQ1Ng=='); },
		     success:function(data) {  
		         if(data.data){
		        	$$('.loading-block').hide();
		        	menus.draw(data.data);
		        	menus.data=data.data;
		        	if( menus.index==1){
		        		menus.total=data.data.total;
		        		menus.loadMore();
		        	}
			        prevData.size=menus.size;
			        prevData.index=menus.index;
			        menus.index++;
			        prevData.name=menus.name;
			        return menus.data;
		         }else{  
		        	 myApp.alert("网络太慢,放弃加载",'');  
		         }  
		      },  
		      error : function() {  
		    	  myApp.alert("网络太慢,放弃加载",'');    
		      }  
		 });
		 
	},
	list:function(data){
		var html=[];
		var galleryIndex="gallery-"+($$(".gallery_switch .active").index()+1);
		for (var i=0;i<data.length;i++ ){
			var item ='<li><a rel="'+galleryIndex+'" href="dish.html?id='+data[i].ID+
			   			'" title="'+data[i].name+'"><div class="card demo-card-header-pic">'+
			   			'<div style="background-image: url('+data[i].pic+')"'+
			   			'valign="bottom" class="card-header color-white no-border"><strong>'+data[i].name+
			   			'</strong><span>'+data[i].brief+'</span></div></div></a></li>';
			html.push(item);
		}
		return html.join('');
	},
	draw:function(data){	
		$('.menu #photoslist').append(menus.list(data));
	},
	loadMore:function(){
		//加载flag
		var loading = false;
		// 上次加载的序号
		var lastIndex = $$('.menu #photoslist li').length;
		// 最多可加载的条目
		var maxItems = menus.total;
		// 注册'infinite'事件处理函数
		$$('.infinite-scroll').on('infinite', function () {
		  // 如果正在加载，则退出
		  if (loading) return;
		  // 设置flag
		  loading = true;
		  // 模拟1s的加载过程
		  setTimeout(function () {
		    // 重置加载flag
		    loading = false;
		    if (lastIndex >= maxItems) {
		      // 加载完毕，则注销无限加载事件，以防不必要的加载
		      myApp.detachInfiniteScroll($$('.infinite-scroll'));
		      // 删除加载提示符
		      $$('.infinite-scroll-preloader').remove();
		      return;
		    }
		    // 生成新条目的HTML
		    menus.loadData();
		    // 更新最后加载的序号
		    lastIndex = $$('.menu #photoslist li').length;
		  }, 1000);
		});  
	}
};
var dish={
		data:null,
		id:null,
		name:null,
		baseUrl:'../index.php/api/Menu/menu',
		loadData:function(id){
			if(dish.data!=null&&dish.id==prevData.id){
					dish.draw(dish.data);
					return dish.data;
				}
				 $$.ajax( {  
				     url:dish.baseUrl+'/id/'+id,// 跳转 action	      
				     type:'get',  
				     cache:true,  
				     dataType:'json',  
				     beforeSend: function (xhr) { xhr.setRequestHeader ('Authorization', 'Basic Zm9vZHN0YWNrOjEyMzQ1Ng=='); },
				     success:function(data) {  
				         if(data.ID){
				        	$$('.loading-block').hide();
				        	dish.draw(data);
				        	dish.data=data;
				        	dish.id=data.ID;
				        	dish.name=data.name;
					        prevData.id=data.ID;
					        return data;
				         }else{  
				        	 myApp.alert("网络太慢,放弃加载",'');  
				         }  
				      },  
				      error : function() {  
				    	  myApp.alert("网络太慢,放弃加载",'');    
				      }  
				 });
		},
		draw:function(data){
			$$('div[data-page="dish"]#dish .navbar_page_center').text(data.name);
			//$$('div[data-page="dish"] #pages_maincontent.dish .demo-card-header-pic .card-header').css('background-image','url('+data.pic+')');
			var comment=data.brief==''?'':'<div class="card-content"><div class="card-content-inner"><p>'+data.brief+'</p></div></div>';
			$$('div[data-page="dish"] #pages_maincontent.dish .demo-card-header-pic').append('<div valign="bottom" class="card-header color-white no-border" style="background-image:url('+data.pic+')"></div>'+comment);
			//材料
			var mhtml=[];
			var dm=JSON.parse(data.materials);
			var du=JSON.parse(data.units);
			for(var i=0;i<dm.length;i++){
				var size=du[i]==""?'适量':du[i];
				var item='<li class="item-content"><div class="item-inner">'+
                		'<div class="item-title">'+dm[i]+'</div>'+
                		'<div class="item-after">'+size+'</div> </div></li>';
				mhtml.push(item);
			}
			$$('div[data-page="dish"] #pages_maincontent .dish-material .list-block ul').append(mhtml.join(''));
			//步骤
			var shtml=[];
			var steps=JSON.parse(data.steps);
			for(var i=0;i<steps.length;i++){
				var pic=steps[i].hd==undefined?'':'<div class=" cp_pic"><img src="'+steps[i].hd+'"></div>';
				var item='<div class="card facebook-card"><div class="card-content"><div class="card-content-inner">'+pic+
				         '<p><i class="icon-circle">'+(i+1)+'</i><span>'+steps[i].desc+'</span></p></div></div></div>';
				shtml.push(item);
			}
			$$('div[data-page="dish"] .dish').append(shtml.join(''));
		}
}
var prevData={
		index:1,
		size:10,
		data:[],
		name:null,
		id:-1
};

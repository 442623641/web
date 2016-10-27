angular.module('starter.controllers')
.controller('RecipesCtrl', function($scope, $stateParams,MenusDbService,MenuService,$ionicModal,$ionicScrollDelegate, $rootScope) {
  $rootScope.slideHeader = false;
  $rootScope.slideHeaderPrevious = 0;
	// $scope.touch=function(id){
 //    var obj=document.getElementById(id);
 //    obj.removeEventListener("touchmove", function(){
 //      obj.addEventListener("touchmove", touchMove, false);
 //    } ,false);
    
 //    function touchMove(event) {
 //      var contentHandle=$ionicSideMenuDelegate.$getByHandle('contentHandle');
 //      if(contentHandle.isOpen()){
 //        var p=contentHandle.getOpenRatio();
 //        obj.style.webkitTransform="scale("+1-p+")";
 //      }
	//     }
	// }
	//$scope.touch('id1');
	var testshop=$stateParams.shopID;
	$ionicModal.fromTemplateUrl('templates/purchases.html', {
	    scope: $scope
	 }).then(function(modal) {
	    $scope.purchaseModal = modal;
	 });
	$scope.openPurchaseModal=function(){
		event.preventDefault();
		$scope.purchases=MenusDbService.get({'purchase':{ '$eq' : true}});
    	$scope.purchaseModal.show();
  	}
  // 	$ionicModal.fromTemplateUrl('templates/setup.html', {
	 //    scope: $scope
	 // }).then(function(modal) {
	 //    $scope.setupModal = modal;
	 // });
	$scope.openSetupModal=function(tag){
		event.preventDefault();
	    //animation&&$scope.loadingShow();
	  	MenuService.getSetup(tag).success(function(res){
	    	$scope.setup=res;
	    	$scope.setupModal.show();
	    })
	    .error(function (data, status) {
            alert("网络连接失败");
            console.log("Error occurred.  Status:" + status);
        })
        .finally(function() {
          	$scope.loadingHide();
         });
  	}
	$scope.menuChange=function(type,index){
		$scope.menu=MenusDbService.get({'type':{ '$eq' : type}});
		$scope.expand=0;
		$scope.menuIndex=index;
		return $scope.menu;
	}
	$scope.listShowChange=function(){
	  	$scope.listType=$scope.listType==2?1:2;
	}
	$scope.$on('$destroy', function() {
	    $scope.purchaseModal.remove();
	    $scope.setupModal.remove();
	});
	$scope.shopID=null;
	$scope.menu=[];
	$scope.listType=2;
	$scope.purchaseTotal=0;
	$scope.purchaseCount=0;
	$scope.doRefresh = function(animation) {
	    if($scope.shopID==testshop){
	    	$scope.$broadcast('scroll.refreshComplete');
       	 	return;
      	} 
      	var data=MenusDbService.get({'shopID':{ '$eq' : testshop+''}});
      	if(data.length){
			$scope.shopID=testshop;
	    	$scope.categorys=getCategorys(data[0].type);
	    	$scope.menuChange(data[0].type,0);
			return;
	    }
	    animation&&$scope.loadingShow();
	  	MenusDbService.loadData(testshop).success(function(res){
	    	MenusDbService.add(res);
	    	$scope.shopID=testshop;
	    	$scope.categorys=getCategorys(res);
	    	$scope.menuChange(res[0].type,0);

	    })
	    .error(function (data, status) {
            alert("网络连接失败");
            console.log("Error occurred.  Status:" + status);
        })
        .finally(function() {
        	// 停止广播ion-refresher
       		$scope.$broadcast('scroll.refreshComplete');
          	$scope.loadingHide();
         });
	    return;
	}

	var getCategorys=function(data){
		var  dist=[],ids=[];//;[];
		data.forEach(function(elem) {
		  if (ids.indexOf(elem.type) === -1) {
		    dist.push({category:elem.type,categoryName:elem.typeName,categoryCode:elem.typeCode});
		    ids.push(elem.type);
		  }
		});
		return dist;
	}
	
	$scope.purchase=function(item,e,index){ 
				// var ele=document.getElementById("tabsBadge");
		// var position=ele&&findPosition(ele);
		// var en=e;
		item.purchase=!item.purchase;
		//animate(e,index,item.purchase);
		MenusDbService.update(item);
		if(item.purchase){
			$scope.purchaseTotal+=parseFloat(item.originalPrice);
			$scope.purchaseCount++;
			//$scope.purchases.push(item);
		}else{
			$scope.purchaseTotal-=parseFloat(item.originalPrice);
			$scope.purchaseCount--;
		}

	}
	var animate=function(e,index,easeIn){
		//$scope.purchaseCount=1;
		var position=[];
		var target=document.getElementById("tabsBadge");
		
		
		if(!target){
			position=[73,531,97,553];
		}else{
			position=findPosition(target);
		}
		//var position=findPosition(target);
		
		//var button=document.getElementById("button"+index);
		var badge=document.getElementById("badge"+index);
		badge.style.display="block";
		badge.style.transition="-webkit-transform 400ms ease-in-out";
		if(easeIn){
			badge.style.webkitTransform="translate({0}px, {1}px)".format(position[0]-e.x,position[1]-e.y-10);
			$scope.purchaseCount++;
			//start.style.display="none";
		}else{
			//badge.style.webkitTransform="translate({0}px, {1}px)".format((e.x-position[0])/3,(e.y-position[1])/5);
			$scope.purchaseCount--;

		}
		badge.style.display="none";
		var s=badge.style;

	}
	$scope.doRefresh(true);
	

})
.controller('PurchaseCtrl', function($scope, $stateParams,MenusDbService) {
	$scope.shouldShowDelete = false;
	$scope.shouldShowReorder = false;
	$scope.closePurchaseModal=function(){
	   //$scope.purchases=null;
	   $scope.purchaseModal.hide();
	}
	$scope.check=function(item){
		item.ignore=!item.ignore;
		MenusDbService.update(item);
		if(!item.ignore){
			$scope.purchaseTotal+=parseFloat(item.originalPrice);
			//$scope.purchases.push(item);
		}else{
			$scope.purchaseTotal-=parseFloat(item.originalPrice);
		}
	}
	$scope.del=function(item,index){
		item.purchase=false;
		MenusDbService.update(item);
		$scope.purchases.splice(index, 1);
		$scope.purchaseTotal>1&&($scope.purchaseTotal-=parseFloat(item.originalPrice));
	}
})
.controller('SetupCtrl', function($scope,$stateParams,MenuService) {
	// $ionicConfigProvider.scrolling.jsScrolling(true);
	$scope.setup={};
	$scope.closeSetupModal=function(){
	   //$scope.purchases=null;
	   $scope.setupModal.hide();
	}
	MenuService.getSetup($stateParams.tag).success(function(res){
	    	$scope.setup=res;
	    	$scope.setup.minor=JSON.parse(res.minor);
	    	$scope.setup.setup=JSON.parse(res.step);
	    	//$scope.setupModal.show();
	    })
	    .error(function (data, status) {
            alert("网络连接失败");
            console.log("Error occurred.  Status:" + status);
        })
        .finally(function() {
          	$scope.loadingHide();
    });
});

angular.module('app.controllers', [])
.controller('appCtrl',['$scope', function ($scope) {
	$scope.routeTo=function (index,title) {
		// body...
		$scope.pageIndex=index;
		$scope.title=title;
	}
}])
//angular.module('home', [])
.controller('homeCtrl',['$scope', function ($scope, $http) {
	$scope.count1=493;
	$scope.count2=203;
	$scope.count3=10031;
	$scope.count4=6002822;
}])
.controller('shopCtrl',['$scope','$resource', function ($scope,$resource) {
    $(".dropzone").dropzone();
    $scope.tabIndex=0;
    var Shop=$resource('/menu/index.php/admin/shop/shop/id/:id',{id:'@id'});
    $scope.shop=Shop.get({id:2001});
    $scope.previous=function(){
    	$scope.tabIndex>0&&$scope.tabIndex--;
    }
    $scope.next=function(){
    	$scope.tabIndex++;
    }
    $scope.save=function(){
    	$scope.shop.$save();
    }
}])
.controller('runCtrl',['$scope', function ($scope, $http) {


}])
.controller('menuCtrl',['$scope', function ($scope) {
    $(".dropzone").dropzone();
    $('.modal-with-form').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#name',
		modal: true,

		// When elemened is focused, some mobile browsers in some cases zoom in
		// It looks not nice, so we disable it:
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#name';
				}
			}
		}
	});
	$scope.closeMenuModal= function (e) {
		//e.preventDefault();
		$.magnificPopup.close();
	};
	$scope.menuType='分类';
}]);
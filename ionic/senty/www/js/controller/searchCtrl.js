angular.module('controllers')
.controller('SearchCtrl', function($scope,$location,$ionicModal,localStorageService) {
  var historyKeys=localStorageService.get('keys');
  $scope.items=historyKeys?historyKeys:[];
  $scope.key='';
  $scope.goResult=function(key){
    if(key){
      $scope.searchModal.hide().then(function(){
        $location.path('/tab/result/{0}/{0}'.format(key));
      });
      ($scope.items&&$scope.items.indexOf(key))<0||$scope.items.splice($scope.items.indexOf(key), 1);
      $scope.items.unshift(key);
      $scope.items.length>10&&$scope.items.pop();
      localStorageService.update('keys',$scope.items);
      
    }
  }
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
    localStorageService.update('keys',$scope.items);
  };
  $scope.onItemsClear = function() {
    $scope.items=[];
    localStorageService.remove('keys');
  };
  $scope.clear = function() {
    $scope.key='';
  };
  $scope.blur = function() {
    $scope.goResult($scope.key);
  };
  $scope.keyup = function(e) {
    e.keyCode==13&&$scope.goResult($scope.key);
  };
  $scope.closeModal = function(modal) {
    $scope[modal].hide();
  };
})
.controller('SearchModalCtrl', function($scope,$ionicModal,localStorageService) {
  $ionicModal.fromTemplateUrl('templates/search.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.searchModal = modal;
  });
  $scope.$on('$destroy', function() {
    $scope.searchModal.remove();
  });
  $scope.openModal = function() {
    $scope.searchModal.show();
    //$scope.items=localStorageService.get('keys');
  };
})

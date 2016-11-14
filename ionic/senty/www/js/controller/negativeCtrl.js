angular.module('controllers')
.controller('NegativesCtrl', function($scope,$rootScope,Solr,AUTH_EVENTS,AuthService,dateService,$ionicScrollDelegate,$ionicSlideBoxDelegate) {
  // if(!AuthService.isAuthenticated()){
  //   return;
  // }
  $scope.$on(AUTH_EVENTS.loginSuccess, function(event) {
    event.preventDefault();
    $scope.loginModal.hide().then(function(){
      $scope.data[$scope.pageIndex].doRefresh();
    });
  });
  $scope.slideHasChanged=function(index) {
    //$scope.getScrollPosition('scroll'+index);
    $scope.pageIndex=index;
    if(!$scope.data[index].items.length){
      $scope.data[index].doRefresh(true);
      //$rootScope.getScrollPosition('scroll'+index);
    }
  };
  $scope.slide = function(index) {
    $scope.pageIndex=index;
    index==$ionicSlideBoxDelegate.currentIndex()||
    $ionicSlideBoxDelegate.slide(index);
  };
  var page=function(code,title){
      this.code=code,
      this.interval=0,
      this.items=[],
      this.title=title,
      this.message=$scope.appName,
      this.doRefresh=function(animation) {
        var cpage=this;
        var parasDate=dateService.getDateFormat(cpage.interval);
        Solr.results({code:cpage.code,date:parasDate},animation)
        //.success(function(res){
        .then(function(res){
            //res.mess="isfbvw";
            if (res&&res.mess) {
              cpage.message=res.mess;
              return;
            }
            if(res.errorCode==-1)
            {
              cpage.interval--;
              cpage.doRefresh(false);
              return;
            }
            var re={};
            re.data=res;
            var date=dateService.getNowDate(cpage.interval);
            re.date='{0} {1}'.format(dateService.getDateFormat(cpage.interval,'yyyy年MM月dd日'),date.dayString);
            cpage.interval--;
            cpage.items.unshift(re);
            $ionicScrollDelegate.resize();
            cpage.yesterday=dateService.getNowDate(cpage.interval).dayString;

        })
        // .error(function (data, status) {
        //     cpage.message="网络连接失败";
        //     console.log("Error occurred.  Status:" + status);
        // })
        .then(function() {
           // 停止广播ion-refresher
          $scope.$broadcast('scroll.refreshComplete');
          $scope.loadingHide();
         });
    };
  }
    $scope.data=[new page(0,'负面聚焦'),new page(52,'论坛聚焦'),new page(53,'博客聚焦')];
    $scope.pageIndex=0;
});
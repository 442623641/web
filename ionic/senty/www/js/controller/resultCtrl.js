angular.module('controllers')
.controller('ResultCtrl', function($scope,Solr,$stateParams,$ionicModal,$ionicScrollDelegate,$ionicScrollDelegate,Session,dateService) {
  $scope.negatives=[];
  //$scope.key=$stateParams.Key;
  $scope.title=$stateParams.Title;
  $scope.key=$stateParams.Key
  $scope.material={};
  $scope.units=Session.relation;
  $scope.loadMore = function() {
      Solr.getData($scope.search.param,$scope.search.fqs,false)
     .success(function(res){
        $scope.moredata=!!res.results.length;
        $scope.search.param.start+=$scope.search.param.rows;
        $scope.negatives=$scope.negatives.concat(res.results);
     })
     .error(function (data,status) {
         console.log("Error occurred.  Status:" + status);
     })
     .finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.loadingHide();
      });
  }
  $scope.doRefresh = function(animation) {
     $scope.search.param.start=0;
      Solr.getData($scope.search.param,$scope.search.fqs,animation)
     .success(function(res){
        $scope.negatives=res.results;
        $ionicScrollDelegate.resize();
        $scope.moredata=!!res.results.length;
     })
     .error(function (data,status) {
         console.log("Error occurred.  Status:" + status);
     })
     .finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
        $scope.loadingHide();
      });
  }
  
  $ionicModal.fromTemplateUrl('templates/senty-delivery.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.sDeliveryModal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/senty-operate.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.sOperateModal = modal;
  });
  $scope.$on('$destroy', function() {
    $scope.sDeliveryModal.remove();
    $scope.sOperateModal.remove();
    delete $scope.search;
  });
  $scope.openDeliveryModal = function(item) {
    event.preventDefault();
    $scope.$broadcast("openDeliveryModal",item);
  };
  $scope.openOperateModal = function(item) {
    event.preventDefault();
    $scope.$broadcast("openOperateModal",item);
  };
  //fliter
  $scope.search={};
  $scope.search.fqs={};
  $scope.search.param={
    start:0,rows:10,q:$stateParams.Key
  }
  $scope.showFliter=function(index){
    event.preventDefault();
    $scope.fliter=index==$scope.fliter?false:index;
    $ionicScrollDelegate.freezeAllScrolls(!!$scope.fliter);
  };
  $scope.search.location=function(area){

    $scope.fliter=false;
    $ionicScrollDelegate.freezeAllScrolls($scope.fliter);
    this.param.start=0;
    this.fqs.country_code==undefined||(delete this.fqs.country_code);
    this.fqs.location_code==undefined||(delete this.fqs.location_code);
    this.fqs['-location_code']==undefined||(delete this.fqs['-location_code']); 
    this.fqs['-province_code']==undefined||(delete this.fqs['-province_code']);
    switch (area){
      case 1:
        this.locationName="本地";
        this.fqs.location_code="[{0}0000 TO {1}9999] OR province_code:{0}".format(Session.relationID.substr(0,2));
        break;
      case 2:
        this.locationName="外地";
        this.fqs['-location_code']="[{0}0000 TO {0}9999]".format(Session.relationID.substr(0,2));
        this.fqs['-province_code']=Session.relationID.substr(0,2);
        break;
      case 3:
        this.locationName="境外";
        this.fqs.country_code=0;
        break;
      default:
        this.locationName="全部";
        break;
    }

    $scope.doRefresh(true);
  }
  $scope.search.q=function(title,text){
    this.qName=text;
    $scope.fliter=false;
    $ionicScrollDelegate.freezeAllScrolls($scope.fliter);
    this.param.start=0;
    if(title!==''){
      this.param.q="{0}:({1})".format(title,$stateParams.Key);
    }else{
      this.param.q="({0})".format($stateParams.Key);
    }
    $scope.doRefresh();
  }
  $scope.search.fq=function(name,value){
    $scope.fliter=false;
    $ionicScrollDelegate.freezeAllScrolls($scope.fliter);
    this.param.start=0;
    this.fqs[name]==undefined||(delete this.fqs[name]);
    if(value!==''){
      this.fqs[name]=value;
    }
    $scope.doRefresh();
  }
  $scope.search.time=function(days,text){
    this.timeName=text;
    $scope.fliter=false;
    $ionicScrollDelegate.freezeAllScrolls($scope.fliter);
    this.param.start=0;
    this.fqs.timestamp==undefined||(delete this.fqs.timestamp);
    if(days!==''){
      this.fqs.timestamp="[{0} TO {1}]".format(dateService.getDateFormat(days,'yyyy-MM-ddThh:mm:ssZ'),dateService.getDateFormat(0,'yyyy-MM-ddThh:mm:ssZ'));
    }
    $scope.doRefresh();
  }
  $scope.doRefresh();
})

angular.module('controllers')
.controller('SentyCtrl', function($scope,Solr,dateService,$ionicModal,$ionicSlideBoxDelegate,$ionicScrollDelegate,Session) {
   $scope.pageChange=function(name) {
    $scope.page=name;
    $scope.pages[name].isInit||$scope.pages[name].doRefresh();
  };
  var page=function(key,title){
      this.start=0,
      this.rows=10,
      this.items=[],
      this.title=title,
      this.moredata=true;
      this.key=key,
      this.isInit=false,
      this.message=$scope.appName,
      this.doRefresh=function(animation) {
          this.start=0;
          var cpage=this;
          Solr.getData({q:cpage.key,start:cpage.start,rows:cpage.rows,length:100},false,animation)
          //.success(function(res){
          .then(function(res){
            if(res.mess||res.results.length==undefined){
              cpage.message=res.mess;
              return;
            }
            cpage.moredata=!!res.results.length;
            cpage.start+=cpage.rows;
            cpage.items=res.results;
            cpage.isInit=true;
            $ionicScrollDelegate.resize();
          })
          // .error(function (data,status) {
          //   cpage.message="网络异常";
          // })
          .then(function() {
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loadingHide();
          });
      },
      this.loadMore=function() {
        var cpage=this;
        Solr.getData({q:cpage.key,start:cpage.start,rows:cpage.rows,length:70},false,false)
        //.success(function(res){
          .then(function(res){
            if(res.mess||res.results.length==undefined){
              cpage.message=res.mess;
              return;
            }
            cpage.start+=cpage.rows;
            cpage.moredata=!!res.results.length;
            cpage.items=cpage.items.concat(res.results);
            $ionicScrollDelegate.resize();

        })
        // .error(function (data, status) {
        //     cpage.message="网络异常";
        // })
        .then(function() {
           // 停止广播ion-refresher
           $scope.$broadcast('scroll.infiniteScrollComplete');
           $scope.loadingHide();
         });
      }
  }
  $scope.pages={yq:new page(Session.yqKey,'舆情信息'),yh:new page(Session.yhKey,'有害信息')};
  $scope.pageChange('yq');
  $scope.material={};
  $scope.units=Session.relation;

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
  });
  $scope.openDeliveryModal = function(item) {
    event.preventDefault();
    $scope.$broadcast("openDeliveryModal",item);
  };
  $scope.openOperateModal = function(item,key) {
    event.preventDefault();
    item.key=key;
    $scope.$broadcast("openOperateModal",item);
  };
})
.controller('NegativeCtrl', function($scope,Negatives) {
    //$scope.negative = Negatives.get($stateParams.id);
    // $scope.negative={};
    $scope.$on('$destroy', function() {
      $scope.negativeModal.remove();
    });
})

.controller('PersonCtrl', function($scope,Session,$ionicModal) {
  $scope.user=Session;
  $scope.user.messageCount=3;
  $ionicModal.fromTemplateUrl('templates/about.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.aboutModal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/setting.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.settingModal = modal;
  });
  $scope.$on('$destroy', function() {
    $scope.aboutModal.remove();
    $scope.settingModal.remove();
  });
})
.controller('SdeliveryCtrl', function($scope,$ionicModal, $ionicPopover,Material,Session) {
  $scope.hideModal = function() {
    $scope.sDeliveryModal.hide();
  };
  $scope.save=function(){
    $scope.SXZS+="2,";
    Material.submit($scope.material).then(function(res){
      $scope.loadingHide();
      $scope.showToast(res.data.mess);
      $scope.sDeliveryModal.hide();
    })
  };
  $scope.$on('openDeliveryModal' ,function(event,item) {
    event.preventDefault();
    $scope.content=item.content;
    //$scope.location="安徽省";
    //$scope.materialType="境内外热点";
    $scope.material={
          SCBT:item.title,
          URL:item.url,
          YMLX:item.source_type,
          LY:item.source_name,
          SCLX:"5",
          XGZZ:item.nickname,
          JCSJ:item.timestamp||'2016-07-28 12:33:',
          SXZS:item.isharmful?"2":"4",
          LRZY:'',
          SGQY:"340000",
          SBGS:$scope.units[0].DQDM+"",
          CJDW:Session.relationID,
          JSDW:$scope.units[0].DQDM+"",
          ISYH:item.isharmful?1:0,
          CJZID:Session.userID,
          GJCFL:"1",
          SourceID:item.id,
    }
    $scope.sDeliveryModal.show();
  });
  // $ionicPopover.fromTemplateUrl('address-popover.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.addressPopover = popover;
  // });
  // $scope.closeAddressPopover=function(location){
  //   $scope.location=location;
  //   $scope.addressPopover.hide();
  // }
  // $ionicPopover.fromTemplateUrl('materialType-popover.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.materialTypePopover = popover;
  // });

  // $scope.closeMaterialTypePopover=function(materialType){
  //   $scope.materialType=materialType;
  //   $scope.materialTypePopover.hide();
  // }

  // $scope.$on('$destroy', function() {
  //   $scope.addressPopover.remove();
  //   $scope.materialTypePopover.remove();
  // });
})
.controller('SoperateCtrl', function($scope,$ionicModal, $ionicPopover,Material,Session) {
  $scope.hideModal = function() {
    $scope.sOperateModal.hide();
  };
  $scope.save=function(){
    Material.operate($scope.material).then(function(res){
      $scope.loadingHide();
      $scope.showToast(res.data.mess);
      $scope.sOperateModal.hide();
    })
  };
  $scope.$on('openOperateModal' ,function(event,item) {
    event.preventDefault();
    $scope.content=item.content;
    $scope.sentyTypeText="选择信息分类";
    $scope.keyType="涉政";
    $scope.pageType="默认";
    $scope.material={
      URL:item.url,
      SCBT:item.title,
      LY:item.source_name,
      RWFL:-1,
      SZDQ:item.location,
      IPDZ:item.ip,
      HDXS:1,
      CGJC:item.key,
      SZLM:"",
      ZGJC:6,
      XXBBA:"",
      GABBA:"",
      JCSJ:item.timestamp,
      XGZZ:item.nickname,
      SZD:"",
      FLYJ:1,
      XXSM:"",
      SourceID:item.id,
      YMLX:item.source_type,
    }
    $scope.sOperateModal.show();
  });
  //信息分类
  $scope.$on('closeSentyTypeModal' ,function(event,item) {
    $scope.sentyTypeText=item.LBMC;
    $scope.material.RWFL=item.ID;
    $scope.sentyTypeModal.hide();

  });
  //页面类型分类Modal
  $ionicModal.fromTemplateUrl('templates/pageType-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.pageTypeModal = modal;
  });
  $scope.closePageTypeModal=function(pageType){
    $scope.pageType=pageType;
    $scope.pageTypeModal.hide();
  }
  $scope.$on('$destroy', function() {
    $scope.pageTypeModal.remove();
    $scope.keyTypeModal.remove();
    $scope.sentyTypeModal.remove();
  });
  //Modal关键词类型
  $ionicModal.fromTemplateUrl('templates/key-type.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.keyTypeModal = modal;
  });
  $scope.closeKeyTypeModal=function(keyType){
    $scope.keyType=keyType;
    $scope.keyTypeModal.hide();
  }
  //Modal关键词类型
  $ionicModal.fromTemplateUrl('templates/senty-type.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.sentyTypeModal = modal;
  });
})
//modal信息分类
.controller('SentyTypeCtrl', function($scope,Material) {
  Material.getSentyType().then(function(res){
    $scope.loadingHide();
    if(res.data.mess){
        $scope.message=res.data.mess;
        return;
    }
    $scope.sentyTypes=res.data;
  }); 
  $scope.closeSentyTypeModal=function(item){
    event.preventDefault();
    $scope.$emit('closeSentyTypeModal',item);
  };
})
angular.module('controllers', [])
.controller('AppCtrl', function($scope, $state,$ionicLoading,$ionicPopup,$ionicModal,$window,Solr,Session,localStorageService, $ionicScrollDelegate,AUTH_EVENTS,USER_ROLES,AuthService,$ionicLoading,Negatives,Keys) {
  $scope.appName="嗅探狗";
  $scope.showAlert = function(msg) {
    $scope.alertPopup = $ionicPopup.alert({
/*      title: '',*/
      template: msg,
      okText:"确认",
      okType:"button-clear button-positive"
    });
  };
 $scope.showToast=function(msg,time){
    time||(time=2500);
    $ionicLoading.show({ template: msg,noBackdrop:true,duration: time });
 }
  // A confirm dialog
  $scope.showConfirm = function(msg,callback) {
   var confirmPopup = $ionicPopup.confirm({
     template: msg,
     okText:"确认",
     cancelText:"取消",
     okType:"border-left button-clear button-positive",
     cancelType:"button-clear button-positive"
   }).then(function(res) {
     if(res) {
       callback();
     } else {
       return false;
     }
   });
  }
  $scope.openLink=function(url,type){
    // var target = "_blank";
    // var options = "location=yes,hidden=yes";
    // inAppBrowserRef = cordova.InAppBrowser.open('https://www.baidu.com', target, options);
    event.preventDefault();
    type=type?type:'_system';
    cordova.InAppBrowser.open(url, type, 'location=yes');
  }
  $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.loginModal = modal;
      //本地存储免登录
      //$scope.setSession();
      AuthService.isAuthenticated()||$scope.$broadcast(AUTH_EVENTS.notAuthenticated);
  });
  $ionicModal.fromTemplateUrl('templates/negative.html', {
    scope: $scope,
    animation: 'slide-in-right'
    }).then(function(modal) {
    $scope.negativeModal = modal;
  });
  $scope.loadingHide=function(){
    $ionicLoading.hide();
  }
  $scope.openNegativeModal = function(id) {
    //$scope.showToast("努力加载中...",3000);
    event.preventDefault();
    Solr.getData({},{id:id}).success(function(res){
      if(res.mess){
        $scope.showToast(res.mess);
        return;
      }
      $scope.negative=res.results[0];
    })
    .error(function (data,status) {
      $scope.showToast("网络异常");
      $scope.loadingHide();
    })
    .finally(function() {
      $scope.loadingHide();
      $scope.negativeModal.show(); 
    });
  };
  // $scope.$on('$stateChangeStart', function (event, next) {
  //   var authorizedRoles = next.data.authorizedRoles;
  //   if (!AuthService.isAuthorized(authorizedRoles)) {
  //      event.preventDefault();
  //     if (AuthService.isAuthenticated()) {
  //         // user is not allowed
  //       $scope.$broadcast(AUTH_EVENTS.notAuthorized);
  //     } else {
  //         // user is not logged in
  //         $scope.$broadcast(AUTH_EVENTS.notAuthenticated);
  //     }
  //   }
  // });
  $scope.$on(AUTH_EVENTS.notAuthenticated, function() {
      event.preventDefault();
       //初始化用户信息
      $scope.loginModal.show();
      var lastKeys=localStorageService.get("lastKeys");
      lastKeys&&Session.setKeys(lastKeys);
      var user=localStorageService.get("user");
      if(!!user&&user.token){
        Session.create(user);
        Keys.getLast(user.userID).then(function(){
          $scope.$broadcast(AUTH_EVENTS.loginSuccess);
        });
      }
    }
  );
  
  $scope.$on(AUTH_EVENTS.logoutSuccess, function() {
      event.preventDefault();
      $scope.loginModal.show();
  });

  $scope.userRoles = USER_ROLES;

  $scope.isAuthorized = AuthService.isAuthorized();
})
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
          Solr.getData({q:cpage.key,start:cpage.start,rows:cpage.rows,length:100},false,animation).success(function(res){
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
          .error(function (data,status) {
            cpage.message="网络异常";
          })
          .finally(function() {
            // 停止广播ion-refresher
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loadingHide();
          });
      },
      this.loadMore=function() {
        var cpage=this;
        Solr.getData({q:cpage.key,start:cpage.start,rows:cpage.rows,length:70},false,false)
        .success(function(res){
            if(res.mess||res.results.length==undefined){
              cpage.message=res.mess;
              return;
            }
            cpage.start+=cpage.rows;
            cpage.moredata=!!res.results.length;
            cpage.items=cpage.items.concat(res.results);
            $ionicScrollDelegate.resize();

        })
        .error(function (data, status) {
            cpage.message="网络异常";
        })
        .finally(function() {
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
  $scope.$on('$destroy', function() {
    $scope.aboutModal.remove();
  });
})
.controller('LoginCtrl', function($scope, $state,$ionicModal, $stateParams,Session,localStorageService,USER_ROLES,AuthService,AUTH_EVENTS) {

    $scope.message = "";

    var reuser=localStorageService.get("rememberUser");
    //alert(JSON.stringify(reuser));
    $scope.user = {};
    if(reuser){
      $scope.user.username=reuser.username;
      $scope.user.password=reuser.password;
    }
    $scope.login = function() {
      AuthService.login($scope.user);
    };
    $scope.logout = function() {
      AuthService.logout();
    };

    $scope.$on(AUTH_EVENTS.loginFailed, function(e, mess) {
      $scope.message=mess;
    });
    
})
.controller('LogoutCtrl', function($scope,AuthService) {
   $scope.logout = function() {
      AuthService.logout();
    };
})
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
          JCSJ:item.timestamp,
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
angular.module('controllers')
.controller('KeysCtrl', function($scope,$location,$ionicModal,$ionicScrollDelegate,Keys,Session) {
  $scope.keys = {};
  $scope.keysFilter={};
  $scope.key_options=[
    {title:'情报',code:'QB'},
    {title:'有害',code:'YH'}
  ];
  $scope.keysFilter={};
  $scope.activity={
    themeIndex:"-1",
    theme:{
      KeyType:"QB",
    },
    item:null
  };
  $scope.doRefresh = function(animation) {

    Keys.getAll(Session.userID,animation).success(function(res){
        $scope.keys =res;
        $ionicScrollDelegate.resize();
    })
    .error(function (data, status) {
        console.log("Error occurred.  Status:" + status);
    })
    .finally(function() {
       // 停止广播ion-refresher
       $scope.$broadcast('scroll.refreshComplete');
       $scope.loadingHide();
     });
  };
  $scope.add=function(index,group)
  {
    event.preventDefault();
    $scope.activity.themeIndex=index+'';
    $scope.activity.themeIndex==-1&&($scope.themeText="新建分组");
    $scope.activity.theme={};
    $scope.activity.theme.KeyType="QB";
    group&&($scope.activity.theme=group);
    $scope.activity.item=null;
    $scope.m=new $scope.master();
    $scope.editModal.show();
  }
  $scope.edit=function(index,group,item){
    event.preventDefault();
    $scope.activity.themeIndex=index+'';
    $scope.activity.theme=group;
    $scope.themeText=group.ThemeName;
    $scope.activity.item=item;
    $scope.m=new $scope.master($scope.activity.theme.themeName,
      $scope.activity.item.Title,
      $scope.activity.item.Text,
      $scope.activity.item.Public,
      $scope.activity.theme.KeyType
    );
    $scope.editModal.show();
  }
  $ionicModal.fromTemplateUrl('templates/key-edit.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.editModal = modal;
  });
  $scope.openModal = function() {
    $scope.editModal.show();
  };
  $scope.closeModal = function(modal) {
    $scope[modal].hide();
  };
  $scope.$on('$destroy', function() {
    $scope.editModal.remove();
  });
  $scope.doRefresh();
  $scope.master=function(themeName,title,text,public,keyType){
      this.themeName=themeName;
      this.itemName=title;
      this.text=text;
      this.public=public;
      this.keyType=keyType;
  };
  $scope.master.prototype.switchTheme = function(theme) {
    if(!theme){
      this.themeName=null;
      return;
    }
    this.themeName=theme.ThemeName;
    this.keyType=theme.KeyType;
    this.itemName=null;
    this.text=null;
    this.public=null; 
  };
  $scope.master.prototype.switchItem = function(item) {
    if(!item){
      this.itemName=null;
      return;
    }
    this.itemName=item.Title;
    this.public=item.Public;
    this.text=null;
  };
})
.controller('KeysEditCtrl', function($scope,$ionicModal,$ionicPopover,$ionicActionSheet,$ionicPopup,Keys,Session) {
  // $ionicPopover.fromTemplateUrl('theme-popover.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.themePopover = popover;
  // });

  $scope.themeChange=function(){
    $scope.activity.theme={};
    $scope.activity.theme.KeyType="QB";
    $scope.activity.item=null;
    var index=parseInt($scope.activity.themeIndex);
    if(index<0){
      $scope.m.switchTheme(null);
      $scope.themePopover.hide();
      return;
    }
    var keys=$scope.keys.myKeys;
    $scope.activity.theme=keys[index];
    $scope.m.switchTheme($scope.activity.theme);
    $scope.themePopover.hide();
  }

  $scope.$on('$destroy', function() {
    $scope.themePopover.remove();
  });
  $scope.onSuffix=function(val){
    !!$scope.activity.item.Text&&($scope.activity.item.Text+=' '+val+' ');
  }
  
  $scope.itemChose = function() {
     // Show the action sheet
    var items=$scope.activity.theme.Items;
    var itemButtons=[];
    for(var i in items){
      itemButtons.push({text:items[i].Title});
    }
    var hideSheet = $ionicActionSheet.show({
      buttons: itemButtons,
      cancelText: '关闭',
      destructiveText: '新建主题',
      destructiveButtonClicked:function() {
        $scope.activity.theme.KeyType="QB";
        $scope.activity.item=null;
        $scope.m.switchItem(null);
        return true;
      },
      cancel: function() {
        // add cancel code..
        return false;
      },
      buttonClicked: function(index) {
        $scope.activity.item=$scope.activity.theme.Items[index];
        $scope.m.switchTheme($scope.activity.item);
        return true;
      }
    });
  };
  $scope.delSheet = function() {
     // Show the action sheet
    var buttons=[{text:"删除分组【"+$scope.activity.theme.ThemeName+"】",param:{themeID:$scope.activity.theme.ThemeID}}];
    if (!!!$scope.activity.theme.Items.length) {
       $scope.showConfirm('确认'+buttons[0].text+'?',function(){
          $scope.del(buttons[0].param);
          return true;
        });
        return true;
    }
    buttons.push({text:"删除主题["+$scope.activity.item.Title+"]",param:{itemID:$scope.activity.item.ItemID}});
   
    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      // titleText: '主题',
      cancelText: '取消',
      cancel: function() {
        // add cancel code..
        return false;
      },
      buttonClicked: function(index) {
        $scope.showConfirm('确认'+buttons[index].text+'?',function(){
          $scope.del(buttons[index].param);
          return true;
        });
        return true;
      }
    });
  };
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
    localStorageService.update('keys',$scope.items);
  };
 
  $scope.clear = function() {
    $scope.key='';
  };
  $scope.blur = function() {
    goResult($scope.key);
  };
  $scope.keyup = function(e) {
    e.keyCode==13&&$scope.goResult($scope.key);
  };
  $scope.save = function() {
    //delete $scope.activity.theme.Items;
    Keys.add(action.getParams())
    .then(function(res){
      console.log("message:" + res.data.mess);
      $scope.closeModal('editModal');
      $scope.showToast(res.data.mess);
      $scope.doRefresh();
    });
  };

  $scope.del = function(param) {
    //delete $scope.activity.theme.Items;
    Keys.del(action.del(param))
    .then(function(res){
      console.log("message:" + res.data.mess);
      $scope.closeModal('editModal');
      $scope.showToast(res.data.mess);
      $scope.doRefresh();
    });
  };
  
  var action={
    params:{
      userID:Session.userID,
      cls:'Senty'
    },
    createItem:function(activity){
      this.params.fun="CreateItem";
      this.params.themeID=activity.theme.ThemeID;
      this.params.keyType=activity.theme.KeyType;
      this.params.itemName=activity.item.Title;
      this.params.text=activity.item.Text;
      this.params.isPublic=Number(activity.item.Public);
      return this.params;
    },

   create:function(activity){
      this.params.fun="Create";
      this.params.themeName=activity.theme.ThemeName;
      this.params.keyType=activity.theme.KeyType;
      this.params.itemName=activity.item.Title;
      this.params.text=activity.item.Text;
      this.params.isPublic=Number(activity.item.Public);
      return this.params;
    },

    update:function(activity,master){
      this.params.fun="Update";
      this.params.themeID=activity.theme.ThemeID;
      this.params.itemID=activity.item.ItemID;

      master.itemName==activity.item.Title&&
      (master.public==Number(activity.item.Public))||
      (this.params.itemName=activity.item.Title);

      master.text==activity.item.Text||
      (this.params.text=activity.item.Text);

      this.params.isPublic=Number(activity.item.Public);
      return this.params;
    },
    del:function(param){
      this.params.fun="Delete";
      for(var key in param){
        this.params[key]=param[key];
      }
      return this.params;
    },
    getParams:function(){
      if($scope.activity.themeIndex==-1){
        return this.create($scope.activity);
      }
      if(!!!$scope.m.itemName&&$scope.activity.themeIndex!=-1){
        return this.createItem($scope.activity);
      }
      return this.update($scope.activity,$scope.m);
    }
  }
})
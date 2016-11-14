angular.module('services', [])
.service('Session', function () {
  this.create = function (user) {
    this.nickname=user.YHMC;
    this.username=user.YHZH; 
    this.password=user.YHMM; 
    this.unit=user.DWMC;
    this.rolename=user.CZR;
    this.invalidDate=user.DQSJ; 
    this.userRole=user.userRole;
    this.position=user.JSMC;
    this.token=user.token;
    this.role=user.role;
    this.userID=user.userID;
    this.relation=user.relation;
    this.yqKey="状元 AND (合肥 AND 地铁) OR (合肥 AND 房价) OR (北斗卫星)";
    this.yhKey="抢劫 OR 色狼 OR 猥亵 OR 受贿 OR 腐败 OR 贪污 OR 城管 OR 走私 OR 赔偿 OR 骚扰";
    this.relationID=user.DWDQ;
  };
  this.setKeys=function(object){
    this.yqKey=object.yqKey.key;
    this.yhKey=object.yhKey.key;

  }
  this.destroy = function () {
    delete this.nickname;
    delete this.username; 
    delete this.password; 
    delete this.unit;
    delete this.rolename;
    delete this.invalidDate; 
    delete this.userRole;
    delete this.position;
    delete this.token;
    delete this.role;
    delete this.userID;
    delete this.relation;
    delete this.relationID;
    delete this.yhKey;  
    delete this.yqKey;
    };
  return this;
})
.factory("Keys", function($http,url,$ionicLoading,Session,localStorageService) {
    return {
        getAll: function(userID,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            var p={fun:"List",cls:"Senty",userID:userID}
            return $http.get(url.senty,{params:p}).then(function(){
                return json.keys;
            });
        },
        getLast: function(userID) {
            var p={fun:"LastKeys",cls:"Senty",userID:userID}
            return $http.get(url.senty,{params:p}).then(
                function(res){
                    res.data={yqKey:{key:'合肥 AND 地铁'},yhKey:{key:'抢劫 OR 色狼 OR 猥亵'}}
                    if(res&&res.data){
                        localStorageService.update('lastKeys',res.data);
                        Session.setKeys(res.data);
                    };
                }
            );
        },
        add:function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            $ionicLoading.show();
            return $http.get(url.senty,{params:item});
        },
        update:function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            return $http.get(url.senty,{params:item});
        },
        del:function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            return $http.get(url.senty,{params:item});
        }
        // get: function(id) {
        //     return negativesData[id];
        // },
    };
})
//负面信息
.factory("Negatives", function($http,url,$ionicLoading) {
    return {
        getAll: function(code,date) {
            $ionicLoading.show();
            return $http.get(url.negative.format(code,date)).then(function(){
                return {}
            });
        },
        get: function(id) {
            $ionicLoading.show();
            return $http.get(url.detail.format(id));
        },
    };
})

.factory('localStorageService', ['$window',function($window){
        return {
            get: function localStorageServiceGet(key, defaultValue) {
                var stored = $window.localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function localStorageServiceUpdate(key, value) {
                if (value) {
                    $window.localStorage.setItem(key, angular.toJson(value));
                }
            },
            remove: function localStorageServiceRemove(key) {
                $window.localStorage.removeItem(key);
            }
        };
    }])
.factory('dateService', function() {
  return {
    getNowDate: function(days) {
        var nowDate = {};
        var date = new Date();
        days=days?days:0;
        date.setDate(date.getDate()+parseInt(days));
        nowDate.day = date.getDate();
        nowDate.year = date.getFullYear();
        nowDate.month = date.getMonth()+1;
        
        if(days==0){
            nowDate.dayString='今天';
        }
        else if(days==-1){
            nowDate.dayString='昨天';
        }
        else if(days==-2){
            nowDate.dayString='前天';
        }
        else{
            nowDate.dayString=Math.abs(days)+'天前';
        }
        return nowDate;
    },
    getDateFormat:function(days,reg){
        var date = new Date();
        reg=reg?reg:'yyyy-MM-dd';
        days=days?days:0;
        date.day = date.setDate(date.getDate()+parseInt(days));
        return date.format(reg);
    }

  };
})
.factory('AuthService', function ($http,$rootScope, AUTH_EVENTS,Session,url,localStorageService) {
    var authService = {};
    authService.logout = function () {
        //$http.post(url.logout);
        Session.destroy();
        //root.userInfo=null;
        localStorageService.remove('user');
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    };
    authService.login=function(param){
        param.cls="User";
        param.fun="Login";
        var user={username:"Leo0908",password:"123456"}
        setTimeout(()=>{
             if(param.username!=user.username||param.password!=user.password){
                 $rootScope.$broadcast(AUTH_EVENTS.loginFailed,'用户名或密码错误');
                 return;
             }
             Session.create(json.user);
             localStorageService.update("rememberUser",{username:Session.username,password:Session.password});
             localStorageService.update('user',json.user); 
              $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        },1500);
       
        // $http.get(url.senty,{params:param}).success(function (data) {
        //     if(!!data.mess){
        //         $rootScope.$broadcast(AUTH_EVENTS.loginFailed,data.mess);
        //         return;
        //     }
        //     Session.create(data);
        //     localStorageService.update("rememberUser",{username:Session.username,password:Session.password});
        //     localStorageService.update('user',data); 
        //     $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        // }).error(function(){
        //     $rootScope.$broadcast(AUTH_EVENTS.loginFailed,'网络连接错误');
        // });
    };

    authService.isAuthenticated = function () {
        return !!Session.token;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
          authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated() &&
          authorizedRoles.indexOf(Session.role) !== -1);
    };
    return authService;
})
//关键词搜索
.factory("Solr", function($http,url,localStorageService,$ionicLoading,dateService,Session) {
    
    return {
        getData: function(param,fqs,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            param.userID=Session.userID;
            param.cls="Solr";
            param.fun="request";
            //param.length=85;
            if(!!fqs){
                var myFqs=[];
                for (var key in fqs) {
                    myFqs.push("{0}:{1}".format(key,fqs[key]));
                }
                param.fq=myFqs.join(";");
            }
            return $http.get(url.senty,{params:param}).then(function(){
                return {results:json.senty};
            });
        },
        results: function(param,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            param.userID=Session.userID;
            param.cls="Solr";
            param.length=50;
            param.fun="result";
            //return $http.get(url.senty,{params:param});
            return $http.get(url.senty,{params:param}).then(function(){
                return json.senty;
            });
        }
        // show:function () {
        //     $rootScope.$broadcast('SEARCH-SHOW');
        // },
        // hide:function () {
        //     $rootScope.$broadcast('SEARCH-HIDE');
        // };
    };
})
//
.factory("Material", function($http,url,$ionicLoading,Session) {
    return {
        submit: function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            param={};
            param.userID=Session.userID;
            param.cls="Material";
            param.fun="Submit";
            param.material=JSON.stringify(item);
            return $http.get(url.senty,{params:param});
        },
        operate: function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            param={};
            param.userID=Session.userID;
            param.cls="Material";
            param.fun="Operate";
            param.material=JSON.stringify(item);
            return $http.get(url.senty,{params:param});
        },
        getSentyType: function(item,loading) {
            (loading==undefined||loading)&&$ionicLoading.show();
            param={};
            param.userID=Session.userID;
            param.cls="Material";
            param.fun="GetSentyType";
            return $http.get(url.senty,{params:param});
        }
        // show:function () {
        //     $rootScope.$broadcast('SEARCH-SHOW');
        // },
        // hide:function () {
        //     $rootScope.$broadcast('SEARCH-HIDE');
        // };
    };
})

.factory('Push', function() {
    var push;
    return {
      setBadge: function(badge) {
        if (push) {
          console.log('jpush: set badge', badge);
          plugins.jPushPlugin.setBadge(badge);
        }
      },
      setAlias: function(alias) {
        if (push) {
          console.log('jpush: set alias', alias);
          plugins.jPushPlugin.setAlias(alias);
        }
      },
      check: function() {
        if (window.jpush && push) {
          plugins.jPushPlugin.receiveNotificationIniOSCallback(window.jpush);
          window.jpush = null;
        }
      },
      init: function(notificationCallback) {
        console.log('jpush: start init-----------------------');
        push = window.plugins && window.plugins.jPushPlugin;
        if (push) {
          console.log('jpush: init');
          plugins.jPushPlugin.init();
          plugins.jPushPlugin.setDebugMode(true);
          plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
          plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
        }
      }
    };
  });


// .FACTORY('HTTPINTERCEPTOR',FUNCTION ($Q, $LOCATION, $ROOTSCOPE,SESSION,AUTH_EVENTS) {
//       RETURN {
//         'REQUEST': FUNCTION (CONFIG) {
//             CONFIG.HEADERS = CONFIG.HEADERS || {};
//             IF (!!SESSION.TOKEN) {
//                 RETURN $ROOTSCOPE.$BROADCAST(AUTH_EVENTS.NOTAUTHENTICATED);
//                 CONFIG.HEADERS.AUTHORIZATION = 'BEARER ' + SESSION.TOKEN;
//             }
//             RETURN CONFIG;
//         },
//         'RESPONSEERROR': FUNCTION (RESPONSE) {
//             IF (RESPONSE.STATUS === 401 || RESPONSE.STATUS === 403) {
//                     //如果之前登陆过
//                 IF (!!SESSION.TOKEN) {
//                     $ROOTSCOPE.$BROADCAST(AUTH_EVENTS.NOTAUTHENTICATED);
//                 }
//             }
//             RETURN $Q.REJECT(RESPONSE);
//         }
//     };
// });

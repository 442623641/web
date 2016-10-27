angular.module('services', [])
.factory("MenuService", function($http,url,$ionicLoading) {
    return {
        getSetup: function(value) {
            $ionicLoading.show();
            return $http.get(url.menu.format('Stack','menu','tag',value));
        }
    }
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
    }]).

factory('MenusDbService', ['$q', 'Loki', '$http','url',function MenusDbService($q, Loki,$http,url) {  
    var _db;
    var _menus;
    //var LokiCordovaFSAdapter = require("./cordova-file-system-adapter");
    function initDB() {          
        var adapter = new LokiCordovaFSAdapter({"prefix": "loki"});  
        _db = new Loki('db',
                {
                    //autosave: true,
                    //autoload:true,
                    //autosaveInterval: 1000, // 1 second
                    autoload: true,
        			autoloadCallback : loadHandler,
                    persistenceAdapter: adapter
                });
    };
    function loadHandler(){
    	var options = {};
        _db.loadDatabase(options, function () {
            _menus = _db.getCollection('menus');

             if (!_menus) {
                _menus = _db.addCollection('menus');
            }
            _menus.clear();
   		 });
    }

    function loadData(value) {
        return $http.get(url.menu.format('Menu','menu','shopID',value));//.then(function(res){
    };
    function getAll() {        
        return $q(function (resolve, reject) {
            var options = {};
            _db.loadDatabase(options, function () {
                _menus = _db.getCollection('menus');
                if (!_menus) {
                    _menus = _db.addCollection('menus');
                }
                resolve(_menus.data);
            });
        });
    };
    function get(op) {  
        if(_menus)  {   
            return _menus.find(op);

        } 
        return false;
    };
    function add(menu) {  
        if(_menus)  { 
    	   _menus.insert(menu);
           return true;
        }
	};

	function update(menu) {  
        if(_menus)  { 
	       _menus.update(menu);
           return true;
        }
	};

	function del(menu) {  
	    _menus.remove(menu);
	};
    return {
        initDB: initDB,
        getAll: getAll,
        get:get,
        add: add,
        update: update,
        del: del,
        loadData:loadData
    };
}])
;

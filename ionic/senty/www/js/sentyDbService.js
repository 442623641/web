angular.module('services', [])
.service('SentyDbService', ['$q', 'Loki', '$http','url',function SentyDbService($q, Loki,$http,url) {  
    var _db;
    var _senty;
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
            _senty = _db.getCollection('senty');

             if (!_senty) {
                _senty = _db.addCollection('senty');
            }
            _senty.clear();
         });
    }

    function loadData(value) {
        return $http.get(url.menu.format('Senty',value));//.then(function(res){
    };
    function getAll() {        
        return $q(function (resolve, reject) {
            var options = {};
            _db.loadDatabase(options, function () {
                _senty = _db.getCollection('senty');
                if (!_senty) {
                    _senty = _db.addCollection('senty');
                }
                resolve(_senty.data);
            });
        });
    };
    function get(op) {  
        if(_senty)  {   
            return _senty.find(op);

        } 
        return false;
    };
    function add(data) {  
        if(_senty)  { 
           _senty.insert(data);
           return true;
        }
    };

    function update(data) {  
        if(_senty)  { 
           _senty.update(data);
           return true;
        }
    };

    function del(data) {  
        _senty.remove(data);
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
    }]);
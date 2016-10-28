angular.module('app.route', [])

.config(['$provide', '$routeProvider', '$httpProvider', function ($provide, $routeProvider, $httpProvider) {
    
    //================================================
    // Ignore Template Request errors if a page that was requested was not found or unauthorized.  The GET operation could still show up in the browser debugger, but it shouldn't show a $compile:tpload error.
    //================================================
    $provide.decorator('$templateRequest', ['$delegate', function ($delegate) {
        var mySilentProvider = function (tpl, ignoreRequestError) {
            return $delegate(tpl, true);
        }
        return mySilentProvider;
    }]);

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
        return {            
            'responseError': function (response) {
              alert(angular.toJson(response));
                // if (response.status === 401)
                //     $location.url('/signin');
                // return $q.reject(response);
            }
        };
    }]);

        
    //================================================
    // Routes
    //================================================
    $routeProvider.when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
    });
    $routeProvider.when('/shop', {
        templateUrl: 'templates/shop.html',
        controller: 'shopCtrl'
    });
    $routeProvider.when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    });
    $routeProvider.when('/menu', {
        templateUrl: 'templates/menu.html',
        controller: 'menuCtrl'
    });
    $routeProvider.when('/running', {
        templateUrl: 'templates/running.html',
        controller: 'runCtrl'
    });
    $routeProvider.when('/signin/:message?', {
        templateUrl: 'App/SignIn',
        controller: 'signInCtrl'
    });
    $routeProvider.when('/todomanager', {
        templateUrl: 'App/TodoManager',
        controller: 'todoManagerCtrl'
    });
    
    $routeProvider.otherwise({
        redirectTo: '/home'
    });    
}])

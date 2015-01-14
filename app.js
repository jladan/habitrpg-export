'use strict';

angular.module('habitApp', [])
.controller('habitExportCtrl', ['$scope', '$http', function ($scope,$http) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';

    var processFetch = function (data) {
        $scope.msgEcho = data;
    };

    $scope.checkServer = function () {
        $http.get(rooturl + 'status').success(function(){$scope.msgEcho="server is there";})
    };

    $scope.fetchData = function () {
        var req = {
                method: 'GET',
                url: rooturl + 'user/tasks',
                headers: {
                'x-api-key': $scope.apiKey,
                'x-api-user': $scope.userId
                },
                data: {},
        };

        $http(req).success(processFetch).error(processFetch);
    }
}]);

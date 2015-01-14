'use strict';

angular.module('habitApp', ['ngSanitize'])
.controller('habitExportCtrl', ['$scope', '$http', '$sce', function ($scope,$http,$sce) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';

    var processFetch = function (data) {
        // The data returned is already parsed as JSON!
        $scope.todos = [];
        $scope.habits = [];
        $scope.dailies = [];
        var csv = '"type","text","completed"\n';
        for (var i=0; i<data.length; i++) {
            var task = data[i]
            if (task.type === "habit") $scope.habits.push(task);
            if (task.type === "daily") $scope.dailies.push(task);
            if (task.type === "todo") $scope.todos.push(task);
            csv += '"'+task.type +'","'+ task.text +'","'+ task.completed +'"\n';
        }
        $scope.csv = csv;
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
    };
    
    $scope.trust = function(s) {
        return $sce.trustAsHtml(s);
    };
}]);

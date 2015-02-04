'use strict';

angular.module('habitApp', ['ngSanitize'])
.config(['$compileProvider', function ($compileProvider) {
    //allow blob data in URLs
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
}])

.factory('taskFormatter', function() {
    var tf = {};

    tf.csv = function(tasks, fields) {
        var csvHeaders = new Array();
        var csvFields = new Array();
        fields.forEach( function(field) {
            if (field.include) {
                csvHeaders.push(field.name);
                csvFields.push(field.header);
            }
        });

        var csv = '"' + csvHeaders.join('","') + '"\n';

        for (var i=0; i<tasks.length; i++) {
            var t = tasks[i];
            var row = [];
            csvFields.forEach( function(header) {
                row.push(t[header]);
            });
            csv += '"'+row.join('","') + '"\n';
        }

        return csv;
    };

    return tf;
})

.factory('habitAPI', ['$http', function($http) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';

    var api = {};
    api.checkServer = function (callback) {
        $http.get(rooturl + 'status').success(callback);
    };

    api.fetchData = function (user, key, success, error) {
        var req = {
                method: 'GET',
                url: rooturl + 'user/tasks',
                headers: {
                'x-api-key': key, 
                'x-api-user': user
                },
                data: {},
        };

        $http(req).success(success).error(error || success);
    };

    return api;
}])

.controller('habitExportCtrl', ['$scope', '$sce', 'taskFormatter', 'habitAPI',
        function ($scope, $sce, formatter, habitrpg) {

    var processFetch = function (tasks) {
        $scope.tasks = tasks;
        // The data returned is already parsed as JSON!
        $scope.csv = formatter.csv(tasks, $scope.fields);
        
        //create download link
        var blob = new Blob([$scope.csv], { type: 'text/csv' });
        // clean up the old object
        if ($scope.csvURL) {
            window.URL.revokeObjectURL($scope.csvURL);
        }
        $scope.csvURL = (window.URL || window.webkitURL).createObjectURL(blob);
    };

    $scope.fields = [
        {
            name:       "Type",
            header:     "type",
            include:    true
        }, {
            name:       "Description",
            header:     "text",
            include:    true
        }, {
            name:       "Completed",
            header:     "completed",
            include:    true
        }, {
            name:       "Notes",
            header:     "notes",
            include:    true
        }, {
            name:       "Date Created",
            header:     "dateCreated",
            include:    false
        }, {
            name:       "Attribute",
            header:     "attribute",
            include:    false
        }, {
            name:       "Up button",
            header:     "up",
            include:    false
        }, {
            name:       "Down button",
            header:     "down",
            include:    false
        }, {
            name:       "ID",
            header:     "id",
            include:    false
        }, {
            name:       "Streak",
            header:     "streak",
            include:    false
        }, {
            name:       "Repeat",
            header:     "repeat",
            include:    false
        }, {
            name:       "Value",
            header:     "value",
            include:    false
    }];

    $scope.userId = localStorage.getItem("userId");
    $scope.apiKey = localStorage.getItem("apiKey");

    $scope.checkServer = function () {
        habitrpg.checkServer(function() {
            $scope.csv = "server is there";
        });
    };

    $scope.fetchData = function () {
        localStorage.setItem("userId", $scope.userId);
        localStorage.setItem("apiKey", $scope.apiKey);
        habitrpg.fetchData($scope.userId, $scope.apiKey, processFetch);
    };
    
    $scope.trust = function(s) {
        return $sce.trustAsHtml(s);
    };
}]);

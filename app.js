'use strict';

angular.module('habitApp', ['ngSanitize'])
.config(['$compileProvider', function ($compileProvider) {
    //allow blob data in URLs
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
}])

.factory('taskFormatter', function() {
    var tf = {};

    var csvComponents = ['type', 'text', 'completed'];


    tf.csv = function(tasks) {
        var csv = '"' + csvComponents.join('","') + '"\n';

        for (var i=0; i<tasks.length; i++) {
            var t = tasks[i];
            var row = [];
            csvComponents.forEach( function(header) {
                row.push(t[header]);
            });
            csv += '"'+row.join('","') + '"\n';
        }

        return csv;
    };

    return tf;
})

.controller('habitExportCtrl', ['$scope', '$http', '$sce', 'taskFormatter', function ($scope,$http,$sce, formatter) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';
    var MIME_TYPE = 'text/csv';

    var processFetch = function (tasks) {
        // The data returned is already parsed as JSON!
        $scope.csv = formatter.csv(tasks);
        
        //create download link
        var blob = new Blob([$scope.csv], { type: 'text/csv' });
        // clean up the old object
        if ($scope.csvURL) {
            window.URL.revokeObjectURL($scope.csvURL);
        }
        $scope.csvURL = (window.URL || window.webkitURL).createObjectURL(blob);
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

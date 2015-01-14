'use strict';

angular.module('habitApp', ['ngSanitize'])
.controller('habitExportCtrl', ['$scope', '$http', '$sce', function ($scope,$http,$sce) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';
    var MIME_TYPE = 'text/csv/';

    // File creation from 
    // html5-demos.appspot.com/static/a.download.html
    var cleanUp = function(a) {
      a.textContent = 'Downloaded';
      a.dataset.disabled = true;

      // Need a small delay for the revokeObjectURL to work properly.
      setTimeout(function() {
        window.URL.revokeObjectURL(a.href);
      }, 1500);
    };
    var makeDownload = function () {
        window.URL = window.webkitURL || window.URL;

        var output = document.getElementById('buttons');
        var prevLink = output.querySelector('a');
        if (prevLink) {
            window.URL.revokeObjectURL(prevLink.href);
            prevLink.outerHTML = '';
        }

        var bb = new Blob([$scope.csv], {type: MIME_TYPE});

        var a = document.createElement('a');
        a.download = 'habit-data.csv';
        a.href = window.URL.createObjectURL(bb);
        a.textContent = 'Download ready';

        a.dataset.downloadurl = [MIME_TYPE, a.download, a.href].join(':');
        a.draggable = true;
        a.classList.add('dragout');

        output.appendChild(a);
        a.onclick = function(e) {
            if ('disabled' in this.dataset) {
                return false;
            }

            cleanUp(this);
        };
    };


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
        makeDownload()
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

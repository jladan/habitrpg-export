'use strict';

angular.module('pseudoInnApp', ['habitService'])

.controller('pseudoInnCtrl', ['$scope', 'habitAPI',
        function ($scope, habitrpg) {

    // because it's nice to have access to the controller
    $scope.mv = this;
    var _this = this;

    // this dailies is for the scopes of the directives
    // while the $scope's dailies is for the actual tasks
    this.dailies = [];
    var enterInnFetch = function (tasks) {
        // The data returned is already parsed as JSON
        $scope.dailies = tasks.filter(function (t) {
            return t.type === "daily";
        });

        // TODO Reduce it to dailies which have no days selected
        $scope.prompt = "Which dailies do you want to disable?";

        $scope.entering = true;
    };

    var leaveInnFetch = function (tasks) {
        // The data returned is already parsed as JSON
        $scope.dailies = tasks.filter(function (t) {
            return t.type === "daily";
        });

        // TODO Reduce it to dailies which have no days selected
        $scope.prompt = "Which dailies do you want to reactivate, and for what days?";

        $scope.leaving = true;
    };

    var clearDailies = function () {
        $scope.dailies = [];
        _this.dailies = [];
    };



    $scope.userId = habitrpg.getSavedId();
    $scope.apiKey = habitrpg.getSavedKey();

    $scope.enterInn = function () {
        habitrpg.saveId($scope.userId);
        habitrpg.saveKey($scope.apiKey);
        clearDailies();
        habitrpg.fetchData($scope.userId, $scope.apiKey, enterInnFetch);
    };

    $scope.leaveInn = function () {
        habitrpg.saveId($scope.userId);
        habitrpg.saveKey($scope.apiKey);
        clearDailies();
        habitrpg.fetchData($scope.userId, $scope.apiKey, leaveInnFetch);
    };

    $scope.confirm = function () {
        if ($scope.entering) {
            // TODO Disable all checked off dailies
        }
        else if ($scope.leaving) {
            // TODO Set the days of all checked off dailies
        }
        else
            console.error('This should only be used after things have been fetched');
    };

    this.addDaily = function (scope) {
        this.dailies.push(scope);
    };
    
}])

.directive('daily', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            task: '='
        },
        controller: ['$scope', function ($scope) {
        }],
        link: function(scope, element, attrs, innCtrl) {
            scope.$parent.mv.addDaily(scope);
            //innCtrl.addDaily(scope);
        },
        template: '<div>{{task.text}}</div>',
        // templateUrl: 'templates/daily.html'
    };
})

;

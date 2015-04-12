'use strict';

angular.module('pseudoInnApp', ['habitService'])

.controller('pseudoInnCtrl', ['$scope', 'habitAPI',
        function ($scope, habitrpg) {

    // because it's nice to have access to the controller
    $scope.mv = this;
    var _this = this;

    var enterInnFetch = function (tasks) {
        // The data returned is already parsed as JSON
        $scope.dailies = tasks.filter(function (t) {
            return t.type === "daily";
        });

        for (var i in $scope.dailies)
            $scope.dailies.days = $scope.dailies.repeat;

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
}])

.directive('daily', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            task: '=',
            selected: '=',
            days: '=',
        },
        controller: ['$scope', function ($scope) {
            $scope.keys = ['su','m','t','w','th','f','s'];

            $scope.days = {};
            for (var i in $scope.keys)
                $scope.days[$scope.keys[i]] = $scope.task.repeat[$scope.keys[i]] || false;
        }],
        template: '<div><input type="checkbox" id="{{task.id}}" ng-model="selected"></input><label for="{{task.id}}"></label>{{task.text}}<span class="day-checks"><span ng-repeat="day in keys"><input type="checkbox" id="{{task.id + day}} ng-model="days[day]"></input><label for="{{task.id+day}}"></label></span></span></div>',
        // templateUrl: 'templates/daily.html'
    };
})

;

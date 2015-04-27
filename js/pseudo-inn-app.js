'use strict';

var storage = {};
storage.saveTasks = function (tasks) {
    localStorage.setItem("savedTasks", JSON.stringify(tasks));
};
storage.loadTasks = function () {
    return JSON.parse(localStorage.getItem("savedTasks")) || [];
};

angular.module('pseudoInnApp', ['habitService'])

.controller('pseudoInnCtrl', ['$scope', 'habitAPI',
        function ($scope, habitrpg) {

    // because it's nice to have access to the controller
    $scope.mv = this;
    var _this = this;
    this.keys = ['su','m','t','w','th','f','s'];

    var enterInnFetch = function (tasks) {
        // The data returned is already parsed as JSON
        $scope.dailies = tasks.filter(function (t) {
            return t.type === "daily";
        });
        $scope.sDailies = new Array($scope.dailies.length);

        $scope.prompt = "Which dailies do you want to disable?";

        $scope.entering = true;
    };

    var leaveInnFetch = function (tasks) {
        // The data returned is already parsed as JSON
        $scope.dailies = tasks.filter(function (t) {
            return t.type === "daily";
        });
        // TODO Reduce it to dailies which have no days selected
        $scope.sDailies = new Array($scope.dailies.length);

        $scope.prompt = "Which dailies do you want to reactivate, and for what days?";

        $scope.leaving = true;
    };

    $scope.userId = habitrpg.getSavedId();
    $scope.apiKey = habitrpg.getSavedKey();

    $scope.enterInn = function () {
        habitrpg.saveId($scope.userId);
        habitrpg.saveKey($scope.apiKey);
        habitrpg.fetchData($scope.userId, $scope.apiKey, enterInnFetch);
    };

    $scope.leaveInn = function () {
        habitrpg.saveId($scope.userId);
        habitrpg.saveKey($scope.apiKey);
        leaveInnFetch(storage.loadTasks())
        //habitrpg.fetchData($scope.userId, $scope.apiKey, leaveInnFetch);
    };

    $scope.cancel = function () {
        $scope.entering = false;
        $scope.leaving = false;
    };
    $scope.confirm = function () {
        if ($scope.entering) {
            $scope.entering = false;
            _this.deactivateDailies();
        }
        else if ($scope.leaving) {
            $scope.leaving = false;
            _this.reactivateDailies();
        }
        else
            console.error('This should only be used after things have been fetched');
    };

    this.deactivateDailies = function () {
        var i,j;
        var toSave = []
        for (i in $scope.sDailies) {
            if ($scope.sDailies[i])
                toSave.push($scope.dailies[i]);
        }
        storage.saveTasks(toSave);
        for (i in toSave) {
            for (j in toSave[i].repeat)
                toSave[i].repeat[j] = false;
            // XXX The functions are created here, so that the closure works
            var task = $scope.dailies[i];
            task.err = function(data, s) {
                console.log(data, s);
                this.working = false;
                this.error = true;
            };
            task.suc = function(data, s) {
                console.log(data, s);
                this.working = false;
                this.success = true;
            };
            task.working = true;
            habitrpg.updateTask($scope.userId, $scope.apiKey, toSave[i], 
                    task.suc.bind(task),
                    task.err.bind(task));
        }

    }

    this.reactivateDailies = function () {
        var i,j;
        var toSave = []
        for (i in $scope.sDailies) {
            if ($scope.sDailies[i])
                toSave.push($scope.dailies[i]);
        }
        storage.saveTasks(toSave);
        for (i in toSave) {
            for (j in _this.keys)
                toSave[i].repeat[_this.keys[j]] = toSave[i].days[j];
            // XXX The functions are created here, so that the closure works
            var task = $scope.dailies[i];
            task.err = function(data, s) {
                console.log(data, s);
                this.working = false;
                this.error = true;
            };
            task.suc = function(data, s) {
                console.log(data, s);
                this.working = false;
                this.success = true;
            };
            task.working = true;
            habitrpg.updateTask($scope.userId, $scope.apiKey, toSave[i], 
                    task.suc.bind(task),
                    task.err.bind(task));
        }
    }
}])

.directive('daily', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            task: '=',
            val: '=',
            days: '=',
        },
        controller: ['$scope', function ($scope) {
            this.keys = ['su','m','t','w','th','f','s'];
            $scope.days = [];
            for (var i in this.keys)
                $scope.days[i] = $scope.task.repeat[this.keys[i]] || false;
        }],
        template: '<div ng-class="{selected: val,success: task.success,error: task.error, working:task.working}"><span class="main-check"><input type="checkbox" id="{{task.id}}" ng-model="val"></input><label for="{{task.id}}"></label></span><div>{{task.text}}</div><span class="day-checks"><span ng-repeat="day in days track by $index"><input type="checkbox" id="{{task.id + $index}}" ng-model="days[$index]"></input><label for="{{task.id+$index}}"></label></span></span></div>',
        // templateUrl: 'templates/daily.html'
    };
})

;

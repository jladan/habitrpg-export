'use strict';

angular.module('habitService', [])
.factory('habitAPI', ['$http', function($http) {
    var rooturl = 'https://habitrpg.com:443/api/v2/';

    var api = {};
    api.checkServer = function (callback) {
        $http.get(rooturl + 'status').success(callback);
    };

    /** Fetch all the tasks for a user
     */
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
    api.fetchTasks = api.fetchData;

    api.updateTask = function (user, key, task, success, error) {
        console.log("updating " + task.text);
        console.log(task);
        var req = {
                method: 'PUT',
                url: rooturl + 'user/tasks/'+task.id,
                headers: {
                'x-api-key': key, 
                'x-api-user': user
                },
                data: task,
        };
        $http(req).success(success).error(error || success);
    };

    /** Tools to save and retrieve the userID and Key from localstorage
     */
    api.saveId = function (id) {
        return localStorage.setItem("userId", id);
    }
    api.getSavedId = function () {
        return localStorage.getItem("userId");
    }
    api.saveKey = function (key) {
        return localStorage.setItem("apiKey",key);
    }
    api.getSavedKey = function () {
        return localStorage.getItem("apiKey");
    }

    return api;
}])

;

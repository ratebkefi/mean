angular.module('app').factory('mvAuth', function($http, mvIdentity, $q, mvUser) {
    return {
        authenticateUser: function(user) {
            var dfd = $q.defer();
            $http.post("/login", user)
                .then(
                    function(response)
                    {
                        var user = new mvUser();
                        angular.extend(user, response.data);
                        mvIdentity.currentUser = user;
                        dfd.resolve(true);
                    },
                    function(err) {
                        dfd.resolve(false);
                    }
                );
            return dfd.promise;
        },

        createUser: function(newUserData) {
            console.log(newUserData);

            var newUser = new mvUser(newUserData);
            var dfd = $q.defer();

            newUser.$save().then(function() {

                mvIdentity.currentUser = newUser;
                dfd.resolve();

            }, function(response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;
        },

        updateCurrentUser: function(newUserData) {
            var dfd = $q.defer();

            var clone = angular.copy(mvIdentity.currentUser);
            angular.extend(clone, newUserData);
            clone.$update().then(function() {
                mvIdentity.currentUser = clone;
                dfd.resolve();
            }, function(response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },
        logoutUser: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout:true}).then(function() {
                mvIdentity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function(role) {
        if(mvIdentity.isAuthorized(role)) {

            return true;
        } else {

            return $q.reject('notauthorized');
        }

    },
        authorizeAuthenticatedUserForRoute: function() {
            if(mvIdentity.isAuthenticated()) {
                return true;
            } else {
                return $q.reject('not authorized');
            }
        }
    }
});
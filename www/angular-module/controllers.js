angular.module('controllers', ['btford.socket-io','ui.bootstrap'], function($locationProvider) {
$locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
})
.factory('mySocket', function (socketFactory) {
  return socketFactory();
});


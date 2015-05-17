(function(){
	var app = angular.module("store",[]);
	
	app.controller("TicketSystemController",["$scope",function($scope) {
		$scope.tickets = ccg.tickets;
		$scope.resolveTicket = ccg.resolveTicket;
		$scope.reopenTicket = ccg.reopenTicket;
	}]);

	app.controller("TicketPanel",function() {
	});
})();
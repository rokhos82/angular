(function(){
	var app = angular.module("store",[]);
	
	app.controller("TicketSystemController",function() {
		this.tickets = ccg.tickets;
	});

	app.controller("TicketPanel",function() {
	});
})();
(function(){
	var app = angular.module("store",[]);
	
	app.controller("TicketSystemController",function() {
		this.tickets = ccg.tickets;
	});

	app.controller("TicketPanel",function() {
		this.isResolved = function(ticket) {
			return ticket.resolved;
		};
	});
})();
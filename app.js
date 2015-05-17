(function(){
	var app = angular.module("store",[]);

	this.test = "Hello World!";
	
	app.controller("TicketSystemController",function() {
		this.tickets = ccg.tickets;
	});

	app.controller("TicketPanel",function() {
		this.isResolved = function(ticket) {
			return ticket.resolved;
		};
	});
})();
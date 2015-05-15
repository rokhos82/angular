(function(){
	var tickets = [{
		user: "Janeen Morvee",
		department: "Clerk\'s Office",
		issue: "WyoREG will not scan.  Again!",
		createdOn: Date.now(),
		resolved: true,
		resolvedOn: Date.now() + 1000*60*3 + 1000*37,
	},{
		user: "Kim Hiser",
		department: "Treasurer\'s Office",
		issue: "ATM is showing error code.",
		createdOn: Date.now() - 1000*60*60,
		resolved: true,
		resolvedOn: null
	},{
		user: "Jim Willox",
		department: "Commission Board",
		issue: "Notification of virus in email from spam filter.",
		createdOn: Date.now(),
		resolved: true,
		resolvedOn: null
	},{
		user: "Vere Cooper",
		department: "Sheriff\'s Office - Dispatch",
		issue: "Unable to open report in Justice!",
		createdOn: Date.now() + 1000*60*60*48,
		resolved: true,
		resolvedOn: Date.now()
	}];
	
	var app = angular.module("store",[]);
	
	app.controller("TicketSystemController",function() {
		this.tickets = tickets;
	});

	app.controller("TicketPanel",function() {
		this.isResolved = function(ticket) {
			return ticket.resolved;
		};
	});
})();
var ccg = {};

ccg.ticket = function(user,dept,desc) {
	this.user = user;
	this.department = dept;
	this.description = desc;
	this.createdOn = Date.now();
	this.resolved = false;
	this.resolvedOn = null;
};

ccg.resolveTicket = function(ticket) {
	ticket.resolved = true;
	ticket.resolvedOn = Date.now();
};

ccg.tickets = [];
with (ccg) {
	tickets.push(new ticket("Janeen Morvee","Clerk Office","Unable to scan into WyoREG on the front counter computer."));
	tickets.push(new ticket("Kim Hiser","Treasuer Office","ATM is show error codde 0047."));
	tickets.push(new ticket("Jim Willox","Commission Board","Notification of virus in email from spam filter."));
	tickets.push(new ticket("Vere Cooper","Sheriff Office","Unable to open reports in Justice!"));
	tickets.push(new ticket("Ben Peach","Sheriff Office","Unable to use logic in any meaningful manner.  Even more text in this line to see if the text wrapping.  One if by land; two of by sea."));
}

ccg.tickets[4].resolved = true;
ccg.tickets[4].resolvedOn = Date.now();
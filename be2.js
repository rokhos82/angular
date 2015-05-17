(function() {
	var app = angular.module("battleengine2");

	app.factory("unitParser",function(){
		var parseFromString = function(str) {
			// Setup the regex pattern to use.
			var nameRegex = /^(.+)\[/ig;

			var starshipRegex = /\[starship.+\]/ig;
			var gunboatRegex = /\[gunboat.+\]/ig;
			var fighterRegex = /\[fighter.+\]/ig;
			var baseRegex = /\[base.+\]/ig;
			var groundRegex = /\[ground.+\]/ig;

			var hullRegex = /\[hull.+\]/ig;
			var shieldRegex = /\[shield.+\]/ig;
			var beamRegex = /\[beam.+\]/ig;
			var missileRegex = /\[missile.+\]/ig;

			var targetRegex = /target (\+|-|)\d+/ig;
		};

		return {
			parseFromString: parseFromString
		};
	});

	app.factory("fleetParser",function(){
	});
});
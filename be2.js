(function(){
	var app = angular.module("battleEngine2",[]);

	app.factory("unitParser",function(){
		var regExp = {
			name: "^(.+?)\\[",
			starship: "\\[(starship.+?)\\]",
			gunboat: "\\[(gunboat.+?)\\]",
			fighter: "\\[(fighter.+?)\\]",
			base: "\\[(base.+?)\\]",
			ground: "\\[(ground.+?)\\]",
			hull: "\\[(hull.+?)\\]",
			shield: "\\[(shield.+?)\\]",
 			beam: "\\[(beam.+?)\\]",
			missile: "\\[(missile.+?)\\]",
			target: "target (\\+|-|)\\d+"
		};
		
		var parseFromString = function(str,regexp) {
		};

		var checkForTag = function(str,regex) {
			var rx = new RegExp(regex,"ig");
			return rx.test(str);
		};

		var getTags = function(str,regex) {
			console.log("getTags: " + str + "," + regex);
			var rx = new RegExp(regex,"ig");
			var tags = []
			var tag;
			while(tag = rx.exec(str)) {
				tags.push(tag[1]);
			}
			return tags;
		};

		var parseName = function(str) {
			console.log("parseName");
			return getTags(str,regExp.name)[0];
		};

		var parseHull = function(str) {
			console.log("parseHull: " + str);
			var hull = {
				base: 0,
				final: 0,
				defense: 0,
				resist: 0,
				flicker: 0
			};

			var hullTag = getTags(str,regExp.hull)[0];

			var regex = /^hull\s+(\d+)\s+(\d+)\s*(.*)/ig;

			console.log("hullTag: " + hullTag);
			
			var match;
			if(match = regex.exec(hullTag)) {
				console.log("match: " + match.toString());
				hull.base = match[1];
				hull.final = match[2];
			} else {
				console.log("unitParser: parseHull - Invalid hull tag: " + hullTag);
			}
			
			return hull;
		};

		var parseType = function(str) {
			console.log("parseType: " + str);
		};

		var parseUnit = function(str) {
			console.log("parseUnit");
			var unit = {
				name: "",
				hull: {}
			};

			unit.name = parseName(str);
			console.log("Unit Name: " + unit.name);
			unit.hull = parseHull(str);

			return unit;
		};

		return {
			parseFromString: parseFromString,
			regExp: regExp,
			parseUnit: parseUnit
		};
	});

	app.factory("fleetParser",function(){
	});

	app.controller("be2Main",["$scope","unitParser",function($scope,unitParser) {
		$scope.udl = "Pillar of Fire [starship target 5][hull 6 9][shield 2][beam 6 target 15][missile 4 ammo 6]";
		$scope.unit = unitParser.parseUnit($scope.udl);
		$scope.states = {
			combat: "combat",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.units;
		$scope.parseUnit = unitParser.parseUnit;
	}]);
})();
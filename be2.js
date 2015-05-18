(function(){
	var app = angular.module("battleEngine2",[]);

	///////////////////////////////////////////////////////////////////////////
	// unitParser
	///////////////////////////////////////////////////////////////////////////
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
			commmand: "\\[(command.+?)\\]",
			target: "target\\s(\\d+)",
			eccm: "eccm\\s(\\d+)",
			defense: "defense\\s(\\d+)",
			ecm: "ecm\\s(\\d+)",
			resist: "resist\\s(\\d+)",
			absorb: "absorb\\s(\\d+)"
		};
		
		var checkForTag = function(str,regex) {
			var rx = new RegExp(regex,"ig");
			return rx.test(str);
		};

		var getTags = function(str,regex) {
			var rx = new RegExp(regex,"ig");
			var tags = []
			var tag;
			while(tag = rx.exec(str)) {
				tags.push(tag[1]);
			}
			return tags;
		};

		var parseOptionalTags = function(component,optionalTags) {
		};

		var parseName = function(str) {
			rokhos.log("parseName: " + str,rokhos.debug.levels.verbose);
			return getTags(str,regExp.name)[0];
		};

		var parseHull = function(str) {
			rokhos.log("parseHull: " + str,rokhos.debug.levels.verbose);

			// Create the basic hull object
			var hull = {
				base: 0,
				final: 0,
			};

			// Match just the hull component of the UDL string
			var hullTag = getTags(str,regExp.hull)[0];
			rokhos.log("hullTag: " + hullTag,rokhos.debug.levels.verbose);

			// Build the regex that describes the basics of the hull:
			//		hull A B
			//		A := base hull
			//		B := final hull
			var regex = /^hull\s+(\d+)\s+(\d+)/ig;
			var match;
			if(match = regex.exec(hullTag)) {
				rokhos.log("hull info: " + match.toString(),rokhos.debug.levels.verbose);
				hull.base = parseInt(match[1]);
				hull.final = parseInt(match[2]);
			} else {
				// Throw a message to the console that the hull component is not properly constructed.
				rokhos.log("unitParser:parseHull - Hull Component not properly constructed (" + hullTag + ")",rokhos.debug.levels.warning);
			}

			var optionalTags = ["defense","resist","absorb"];
			for(var i in optionalTags) {
				var tag = optionalTags[i];
				var regex = new RegExp(regExp[tag],"ig");
				var match;
				if(match = regex.exec(hullTag)) {
					rokhos.log(tag + ": " + match.toString(),rokhos.debug.levels.verbose);
					hull[tag] = parseInt(match[1]);
				}
			};
			
			return hull;
		};

		// parseType ----------------------------------------------------------
		var parseType = function(str) {
			console.log("parseType: " + str);
			var typeObj = {
				class: ""
			}

			// Get the vist valid type component
			var types = ["starship","fighter","gunboat","base"];
			var typeStr = "";
			for(var i in types) {
				var type = types[i];
				if(typeStr = getTags(str,regExp[type])) {
					typeObj.class = type;
					break;
				}
			}

			// Get the optional data from the type component
			var optionalTags = ["target","defense","flicker","resist","ecm","eccm"];
			for(var i in optionalTags) {
				var tag = optionalTags[i];
				var regex = new RegExp(regExp[tag],"ig");
				var match;
				if(match = regex.exec(typeStr)) {
					typeObj[tag] = parseInt(match[1]);
				}
			}

			return typeObj;
		};

		var parseShield = function(str) {
			console.log("parseShield: " + str);
			var shield = {
				max: 0
			};

			var shieldTag = getTags(str,regExp.shield)[0];

			var regex = /^shield\s+(\d+)/ig;

			console.log("shieldTag: " + shieldTag);
			var match;
			if(match = regex.exec(shieldTag)) {
				console.log("match: " + match.toString());
				shield.max = parseInt(match[1]);
			}

			var optionalTags = ["defense","resist","absorb","flicker"];
			for(var i in optionalTags) {
				var tag = optionalTags[i];
				var regex = new RegExp(regExp[tag],"ig");
				var match;
				if(match = regex.exec(shieldTag)) {
					shield[tag] = parseInt(match[1]);
				}
			}

			return shield;
		};

		var parseBeams = function(str) {

		};

		// parseUnit ----------------------------------------------------------
		var parseUnit = function(str) {
			console.log("parseUnit: " + str);
			var unit = {
				name: "",
				total: {}
			};

			unit.name = parseName(str);
			unit.type = parseType(str);
			unit.hull = parseHull(str);
			unit.shield = parseShield(str);

			return unit;
		};

		return {
			parseUnit: parseUnit
		};
	});

	///////////////////////////////////////////////////////////////////////////
	// fleetParser
	///////////////////////////////////////////////////////////////////////////
	app.factory("fleetParser",function(){
	});

	///////////////////////////////////////////////////////////////////////////
	// mainCtrl
	///////////////////////////////////////////////////////////////////////////
	app.controller("mainCtrl",["$scope","unitParser",function($scope,unitParser) {
		$scope.states = {
			combat: "combat",
			fleets: "fleets", 
			units: "units"
		};
		$scope.state = $scope.states.units;
	}]);

	///////////////////////////////////////////////////////////////////////////
	// unitPanel
	///////////////////////////////////////////////////////////////////////////
	app.controller("unitPanel",["$scope","unitParser",function($scope,unitParser) {
		$scope.udl = "Pillar of Fire [starship target 15 eccm 10 defense 20][hull 6 9][shield 2][beam 6 target 15][missile 4 ammo 6]";

		this.unitTotalDefense = function(unit) {
			var defense = 0;
			for(var key in unit) {
				if(key !== "total") {
					var component = unit[key];
					defense += component.defense ? component.defense : 0;
					defense += component.ecm ? component.ecm : 0;
				}
			}
			unit.total.defense = defense;
		}

		this.unitTotalTarget = function(unit) {
			var target = 0;
			for(var key in unit) {
				if(key !== "total") {
					var component = unit[key];
					target += component.target ? component.target : 0;
					target += component.eccm ? component.eccm : 0;
				}
			}
			unit.total.target = target;
		};

		this.parseUnit = function(udl) {
			var unit = unitParser.parseUnit(udl);
			this.unitTotalDefense(unit);
			this.unitTotalTarget(unit);

			$scope.unit = unit;
		}
		this.parseUnit($scope.udl);
	}]);
})();
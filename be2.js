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
			command: "\\[(command.+?)\\]",
			target: "target\\s(\\d+)",
			eccm: "eccm\\s(\\d+)",
			defense: "defense\\s(\\d+)",
			ecm: "ecm\\s(\\d+)",
			resist: "resist\\s(\\d+)",
			absorb: "absorb\\s(\\d+)",
			yield: "yield\\s(\\d+)",
			dis: "(dis)",
			pen: "(pen)"
		};
		
		// --------------------------------------------------------------------
		var checkForTag = function(str,regex) {
			var rx = new RegExp(regex,"ig");
			return rx.test(str);
		};

		// --------------------------------------------------------------------
		var getTags = function(str,regex) {
			rokhos.log("getTags: " + regex + ", " + str,rokhos.debug.levels.verbose);
			var rx = new RegExp(regex,"ig");
			var tags = []
			var tag = rx.exec(str);
			while(tag !== null) {
				tags.push(tag[1]);
				tag = rx.exec(str);
			}
			return tags;
		};

		// --------------------------------------------------------------------
		var parseOptionalTags = function(component,optionalTags,str) {
			rokhos.log("parseOptionalTags: " + str);
			for(var i in optionalTags) {
				var tag = optionalTags[i];
				var regex = new RegExp(regExp[tag],"ig");
				var match;
				if(match = regex.exec(str)) {
					component[tag] = parseInt(match[1]);
					if(isNaN(component[tag])) {
						component[tag] = true;
					}
				}
			}
		};

		// --------------------------------------------------------------------
		var parseName = function(str) {
			rokhos.log("parseName: " + str,rokhos.debug.levels.verbose);
			return getTags(str,regExp.name)[0];
		};

		// --------------------------------------------------------------------
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

			parseOptionalTags(hull,["defense","resist","absorb"],hullTag);
			
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
			parseOptionalTags(typeObj,["target","defense","flicker","resist","ecm","eccm"],typeStr);
			
			return typeObj;
		};

		// --------------------------------------------------------------------
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

			parseOptionalTags(shield,["defense","resist","absorb","flicker"],shieldTag);

			return shield;
		};

		// parseCommand -------------------------------------------------------
		var parseCommand = function(str) {
			rokhos.log("parseCommand: " + str,rokhos.debug.levels.info);
			var command = {
			};

			var commandTag = getTags(str,regExp.command)[0];
			rokhos.log("parseCommand: " + commandTag,rokhos.debug.levels.verbose);

			parseOptionalTags(command,["target","defense","yield"],commandTag);

			return command;
		};

		// parseBeams ---------------------------------------------------------
		var parseBeams = function(str) {
			rokhos.log("parseBeams: " + str,rokhos.debug.levels.info);
			var beams = [];

			var beamTags = getTags(str,regExp.beam);

			for(var i in beamTags) {
				var tag = beamTags[i];
				rokhos.log("parseBeams: " + tag,rokhos.debug.levels.verbose);
				var beam = {
					volley: 0
				};

				var regex = /^beam\s(\d+)/ig;
				var match = regex.exec(tag);
				if(match) {
					beam.volley = parseInt(match[1]);
				}

				parseOptionalTags(beam,["target","yield","dis","pen"],tag);

				beams.push(beam);
			}

			return beams;
		};

		// --------------------------------------------------------------------
		// parseUnit ----------------------------------------------------------
		var parseUnit = function(str) {
			console.log("parseUnit: " + str);
			var unit = {
				name: "",
			};

			unit.name = parseName(str);
			unit.type = parseType(str);
			unit.hull = parseHull(str);
			unit.shield = parseShield(str);
			unit.command = parseCommand(str);
			unit.beams = parseBeams(str);

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
		$scope.udl = "Pillar of Fire [starship target 15 eccm 10 defense 20][hull 6 9][shield 2][beam 6 target 15][missile 4 ammo 6][command target 5 defense 3]";

		// --------------------------------------------------------------------
		var unitTotalDefense = function(unit) {
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

		// --------------------------------------------------------------------
		var unitTotalTarget = function(unit) {
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

		// --------------------------------------------------------------------
		this.parseUnit = function(udl) {
			var unit = unitParser.parseUnit(udl);
			unit.total = {};
			//unitTotalDefense(unit);
			//unitTotalTarget(unit);

			$scope.unit = unit;
		}
		this.parseUnit($scope.udl);
	}]);
})();
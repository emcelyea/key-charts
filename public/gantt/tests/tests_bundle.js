/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Gantt 	   = __webpack_require__(2);


	var status = document.getElementById('status-elem');
	status.innerHTML = 'Starting Tests<br>';
	var tests = [];

	/*globals*/
	var gantt;
	function ganttTests (cb){
		status.fontcolor = "black";
		status.innerHTML += 'Running gantt chart tests<br>';
		
		gantt = new Gantt();
		status.innerHTML += "Constructor completed<br>";

		gantt.create('test chart', function(err, resp){
			if(err){
				status.innerHTML   += errorReturn(JSON.stringify(err));
				return cb(false)
			}else{
				status.innerHTML   += successReturn(JSON.stringify(resp));
				return cb(true);
			}
		});
	}


	/*  $$$$$  TIME PERIOD TEST  $$$$$*/
	function timeperiodTestCreate (cb){
		status.innerHTML += "Running time period create<br>";
		gantt.addTimePeriod(new Date().getTime(), function(err, tp){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{

				status.innerHTML += successReturn(JSON.stringify(tp));
				return cb(true);
			}
		});
	}

	function timeperiodTestUpdate (cb){
		status.innerHTML += "Running time period update<br>";
		gantt.updateTimePeriod(new Date().getTime(), new Date().getTime()+1000, function(err,tp){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				if(tp.nModified === 1){
					status.innerHTML += successReturn(JSON.stringify(tp));
					return cb(true);
				}else{
					status.innerHTML += errorReturn(JSON.stringify(tp));
					return cb(false);
				}
			}			
		});
	}

	function timeperiodTestDelete (cb){
		status.innerHTML += "Running time period delete<br>";
		gantt.deleteTimePeriod(function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}
		});
	}

	function timeperiodTestFind (cb){
		status.innerHTML += "Running time period find<br>";
		gantt.findTimePeriod(function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}
		});
	}


	/*  $$$$$  TEAM TESTS  $$$$$*/
	function teamTestCreate (cb){
		status.innerHTML += "Running team create<br>";
		gantt.addTeam('team one', '#43AA65', function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}		
		});
	}

	function teamTestCreateTwo(cb){
		status.innerHTML += "Running Team Create two<br>";
		gantt.addTeam('team twos', '#43BBCD', function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}
		});
	}

	function teamTestFind (cb){
		status.innerHTML += "Running team find<br>";
		gantt.findTeams(function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(gantt.teams));
				return cb(true);
			}
		});
	}

	function teamTestUpdate (cb){
		status.innerHTML += "Running team update<br>";
		var team = gantt.teams[0];
		team.name = "team 3";
		team.update(function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}
		});
	}

	function teamTestDelete(cb){
		status.innerHTML += "Running team delete<br>";
		var team = gantt.teams[0];
		team.delete(function(err, success){
			if(err){
				status.innerHTML += errorReturn(JSON.stringify(err));
				return cb(false);
			}else{
				status.innerHTML += successReturn(JSON.stringify(success));
				return cb(true);
			}
		});
	}



	tests.push(ganttTests);
	tests.push(timeperiodTestCreate);
	tests.push(timeperiodTestUpdate);
	tests.push(timeperiodTestDelete);
	tests.push(teamTestCreate);
	tests.push(teamTestCreateTwo);
	tests.push(teamTestFind);
	tests.push(teamTestUpdate);
	tests.push(teamTestDelete);
	tests.push(teamTestFind);


	function runTests(tests, index){
		if(tests[index] && typeof tests[index] === 'function'){
			tests[index](function(cont){
				if(cont){
					runTests(tests, ++index);
				}
			});
		}
	}

	function successReturn(str){
		return '<span style="color:green">'+str+'</span><br>';
	}
	function errorReturn(str){
		return '<span style="color:red">'+str+'</span><br>';
	}

	runTests(tests, 0);

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				GANTT FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

	var error      = "Gantt Chart Errors: ";

	function Gantt(){
		//init other class variables to false
		this.timeperiod = false;
		this.team  		= false;
		this.task 		= false;
		this.milestone  = false;
	}

	Gantt.prototype.find = function(id){
		if(typeof id === 'string'){
			var http = new XMLHttpRequest();
			http.open('GET', '/api/gantt/' + gantt._id);
			http.onreadystatechange = function(){
				if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
					var response = JSON.parse(http.responseText);
					return cb(null, response);
				}				
			}
			http.onerror = function(){
				console.error(error, 'finding tasks for chart', http);
				return cb(http.responseText);
			}
			http.send();			
		}else{
			console.error('Id parameter error', id);		
		}
	}

	Gantt.prototype.create = function(title, cb){
		this.title = title;
		if(this.title){
			var that = this;
			var http = new XMLHttpRequest();
			http.open('POST', '/api/gantt');
			http.setRequestHeader("Content-Type", "application/json");

			http.onreadystatechange = function(){
				if(http.readyState === XMLHttpRequest.DONE && http.status === 200){
					var response = JSON.parse(http.responseText);
					that._id = response._id;
					return cb(null, response);
				}
			}
			http.onerror = function(){
				console.error(error, 'posting data', http);
				return cb(http.responseText);
			}

			http.send(JSON.stringify({title:this.title}));		
		}else{
			console.error(error, ' missing field to create chart');
		}
	}



	/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				TIMEPERIOD FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

	Gantt.prototype.addTimePeriod = function(startTime, cb){
		var that = this;
		var timeperiod = new TimePeriod();
		timeperiod.create(this, startTime, function(err, success){
			if(!err){
				that.timeperiod = success;
				return cb(null,success);
			}
		});
	}

	Gantt.prototype.findTimePeriod = function(cb){
		var that = this;
		this.timeperiod = new TimePeriod();
		this.timeperiod.find(this, function(err, success){
			if(!err){
				that.timeperiod = success;
			}
			if(cb){
				return cb(err, success);
			}
		});
	}

	Gantt.prototype.updateTimePeriod = function(startTime, endTime, cb){
		this.timeperiod.update(startTime, endTime, cb);
	}

	Gantt.prototype.deleteTimePeriod = function(cb){
		this.timeperiod.delete(cb);
	}



	/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				TEAM FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

	Gantt.prototype.addTeam = function(name, color, cb){
		var team = new Team();
		var that = this;
		team.create(this, name, color, function(err, success){
			team._id = success._id;
			if(that.teams && Array.isArray('teams')){
				that.teams.push(team);
			}else{
				that.teams = [team];
			}
			return cb(err, team);
		});
	}

	Gantt.prototype.findTeams  = function(cb){
		var that = this;
		Team.find(this, function(err, teams){
			if(Array.isArray(teams)){
				that.teams = [];
				var team;
				for(var i = 0; i < teams.length; i++){
					team = new Team(teams[i]);
					that.teams.push(team);
				}
				cb(err, that.teams);
			}else{
				cb(err);
			}
		});
	}

	Gantt.prototype.updateTeam = function(team, cb){
		team.update(function(err, success){
			return cb(err, success);
		});
	}

	Gantt.prototype.deleteTeam = function(team, cb){
		team.delete(cb);
	}

	/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				TASK FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

	Gantt.prototype.addTask = function(){

	}



	/* 	$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
				MILESTONE FUNCTIONALITY
		$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ */

	Gantt.prototype.addMilestone = function(name, color, date){
		var mStone = new Milestone(name, color, date);
		mStone.create(this, function(err, success){
			if(err){
				alert('erro adding milestone', err);
			}else{
				if(Array.isArray(this.milestones)){
					this.milestones.push(success);
				}else{
					this.milestones = [success];
				}
			}
		});
	}

	Gantt.prototype.deleteMilestone = function(index){
		if(Array.isArray(this.milestones) && this.milestones[index] && this.milestones[index].hasOwnProperty('delete')){
			this.milestones[index].delete();
		}else{
			console.error('delete milestone index error', index, this.milestones);
		}
	}

	Gantt.prototype.updateMilestone = function(index, updated){

	}







/***/ }
/******/ ]);
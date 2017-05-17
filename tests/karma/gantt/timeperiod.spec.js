/*
    TEST STEPS
----------------
- Create new gantt object
- Add timeperiod to gantt
- Update timeperiod on gantt
- null and populate timeperiod from database
- Delete timeperiod
- Try to find timeperiod in database
*/
var gantt;
describe("Gantt Timeperiod functions", function(){
 

  describe("Gantt Create prototype function", function(){
    
    it("should create a new Gantt data object", function() {
  		gantt = new Gantt();
    	expect(gantt.hasOwnProperty('timeperiod')).toBe(true);
  	});
    var error, success;
    
    beforeEach(function(done){
      gantt.create('Team Goals', function(err, success){
        error = err;
        if(success && typeof success === 'object'){
          done();
        }
      });
    });

    it("should create a Gantt object in the database", function(done){
      expect(typeof gantt._id).toBe('string');
      expect(error).toBe(null);
      done();
    });
  });


  describe("Gantt Add timeperiod function", function(){
  	var error, success;

  	beforeEach(function(done){
  		var start = new Date().getTime();
  		gantt.addTimeperiod(start, function(err, succ){
  			error = err;
  			success = succ;
  			done();
  		});
  	});
  	
  	it("Should add an instance of timeperiod to your gantt object", function(){
  		expect(typeof gantt.timeperiod).toBe('object');
  		expect(gantt.timeperiod._id).toBeDefined();
  		expect(error).toBe(null);
  	});
  
  });


  describe("Gantt update timeperiod function", function(){
  	var error, success;
		var newStart = new Date().getTime();
		var newEnd   = new Date().getTime() + 60 * 1000 * 60;

  	beforeEach(function(done){
  		gantt.updateTimeperiod(newStart, newEnd, function(err, succ){
  			error = err;
  			success = succ;
  			done();
  		});
   	});
  
  	it("Should update the fields in the gantt objects timeperiod", function () {
  		expect(gantt.timeperiod.startTime).toEqual(newStart);
  		expect(gantt.timeperiod.endTime).toEqual(newEnd);
  		expect(error).toBe(null);
  	});

  });

  describe("Gantt find timeperiod function", function(){
   	var error, success;

  	beforeEach(function(done){
  	 	gantt.timeperiod = null;
  		gantt.findTimeperiod(function(err, succ){
  			error = err;
  			success = succ;
  			done();
  		});
  	});

  	it("Should replace the removed timeperiod on gantt object", function(){
  		expect(gantt.timeperiod.startTime).toBeDefined();
  		expect(gantt.timeperiod.endTime).toBeDefined();
  		expect(error).toBe(null);
  	});

  });

  describe("Gantt delete timepriod function", function(){
  	var error, success;
  	beforeEach(function(done){
          console.log('Hitting route')

  		gantt.deleteTimeperiod(function(err, succ){
  			error = err;
  			success = succ;
  			done();
  		});
  	});

  	it("Should remove timeperiod from gantt", function(){
  		expect(gantt.timeperiod).toBe(false);
  		expect(error).toBe(null);
  	});
  	
  });

  describe("Gantt attempt to find timeperiod after it has been deleted", function(){
    var error, success;

    beforeEach(function(done){
      gantt.findTimeperiod(function(err, succ){
        error = err;
        success = succ;
        done();
      });
    });

    it("Should replace the removed timeperiod on gantt object", function(){
      expect(gantt.timeperiod).toBe(null);
      expect(error).toBe(null);
    });

  });

});
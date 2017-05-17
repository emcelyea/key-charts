/*
    TEST STEPS
-----------------
- Create new gantt Object
- Update gantt Object
- Delete gantt object
*/
var gantt;
describe("Create a new Gantt object", function() {
  

  it("should create a new Gantt data object", function() {
  	gantt = new Gantt();
    expect(gantt.hasOwnProperty('timeperiod')).toBe(true);
  });

});

describe("Gantt create, update, delete functions", function(){
 
  describe("Gantt Create prototype function", function(){
    
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

  describe("Gantt Update prototype function", function(){
    
    var error;
    
    beforeEach(function(done){
      gantt.update('Team Goalss2', function(err, success){
        error = err;
        if(success && typeof success === 'object'){
          done();
        }
      });
    });

    it("should update gantt object", function(done){
      expect(gantt.title).toBe('Team Goalss2');
      expect(error).toBe(null);
      done();
    });
  });

  describe("Gantt delete prototype function", function(){
    var error;
    beforeEach(function(done){
      gantt.delete(function(err, success){
        error = err;
        if(!gantt._id){
          done();
        }
      });
    });

    it("should delete gantt object", function(done){
      expect(gantt._id).toBe(null);
      expect(error).toBe(null);
      done();
    });
  });

});
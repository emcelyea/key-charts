/*
    TEST STEPS
------------------  
- Create new Gantt
- Create a team
- Create a second team
- Update first team
- null teams and repopulate from database
- Delete first team
- null teams and repopulate from database
- Delete second team

*/
var gantt;
describe("Create a new Gantt object", function() {
  

  it("should create a new Gantt data object", function() {
  	gantt = new Gantt();
    expect(gantt.hasOwnProperty('timeperiod')).toBe(true);
  });

});

describe("Team create, update, read, delete functions", function(){
 
  describe("Gantt Create prototype function", function(){
    
    var error, success;
    
    beforeEach(function(done){
      gantt.create('Task Stuff', function(err, success){
        error = err;
        if(success && typeof success === 'object'){
          done();
        }
      });
    });

    it("Should create a Gantt object in the database", function(done){
      expect(typeof gantt._id).toBe('string');
      expect(error).toBe(null);
      done();
    });
  });

  describe('Team create protoype function', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.addTeam('Design Team', '#4affbb', (err, succ) =>{
        error = err;
        success = succ;
                console.log('got did', this);

        done();
      });
    });
    
    it("Should create a design team", function(done){
      expect(Array.isArray(gantt.teams)).toBe(true);
      expect(gantt.teams.length).toEqual(1);
      expect(error).toBe(null);
      done();
    });

  });

  describe('Create a second team', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.addTeam('Software Team', '#5ccab', (err, succ) =>{
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a design team", function(done){
      expect(gantt.teams.length).toEqual(2);
      expect(error).toBe(null);
      done();    
    });

  });

  describe('update the first team', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.teams[0].name = "Pro Design Team";
      gantt.updateTeam(gantt.teams[0], (err, succ) =>{
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a design team", function(done){
      expect(typeof success).toBe('object');
      expect(gantt.teams[0].name).toEqual("Pro Design Team");
      expect(error).toBe(null);
      done();    
    });

  });

  describe('Reset teams on gantt chart and find them again', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.teams = false;
      gantt.findTeams( (err, succ) => {
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a repopulate the teams field", function(done){
      expect(gantt.teams.length).toBeDefined();
      expect(gantt.teams.length).toEqual(2);
      expect(error).toBe(null);
      done();    
    });

  });


  describe('Delete one team from gantt', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.deleteTeam(gantt.teams[0], (err, succ) => {
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a repopulate the teams field", function(done){
      expect(gantt.teams.length).toEqual(1);
      expect(error).toBe(null);
      done();    
    });

  });
  
  describe('Find teams again after deleting one', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.teams = false;
      gantt.findTeams( (err, succ) => {
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a repopulate the teams field", function(done){
      expect(gantt.teams.length).toBeDefined();
      expect(gantt.teams.length).toEqual(1);
      expect(error).toBe(null);
      done();    
    });

  });

  describe('Delete other team from gantt', function(){
    var error, success;
   
    beforeEach(function(done){
      gantt.deleteTeam(gantt.teams[0], (err, succ) => {
        error = err;
        success = succ;
        done();
      });
    });
    
    it("Should create a repopulate the teams field", function(done){
      expect(gantt.teams.length).toEqual(0);
      expect(error).toBe(null);
      done();    
    });

  });
});
/*
    TEST STEPS
-----------------
- Create new flowchart object
*/
var flowchart;
describe("Test Flowchart HTTP", function() {
  

  it("should create a new flowchart data object", function() {
  	flowchart = new FlowChart();
    expect(typeof flowchart).toBe('object');
  });

  describe("Flowchart create function", function(){
    beforeEach(function(done){
      flowchart.create('System Run Steps').then( success =>{ done(); }, err => { Error(err); });
    });

    it("should create a flowchart in the DB", done => {
      expect(typeof flowchart._id).toBe('string');
      done();
    });    
  });

  describe("Flowchart update function", function(){
    var retValue;
    beforeEach(function(done){
      flowchart.name = 'System Runnin Steps';
      flowchart.update().then( success => { 
        retValue = success;
        done(); 
      });
    });

    it("should update gantt object", function(done){
      expect(retValue.name).toBe(flowchart.name);
      done();
    });
  });

  describe("Flowchart read function", function(){

    beforeEach(function(done){
      var id = flowchart._id;
      delete flowchart.name;
      flowchart.get(id).then( success => {
        done();
      });
    });

    it("should delete and repopulate name field from database", function(done){
      expect(flowchart.name).toBe('System Runnin Steps');
      done();
    });
  });

  describe("Flowchart delete function", function(){

    beforeEach(function(done){
      flowchart.delete().then( success => {
        done();
      });
    });

    it("should delete flowchart", function(done){
      expect(flowchart.name).toBe(undefined);
      done();
    });
  });  
});

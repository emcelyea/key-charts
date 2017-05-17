/*
	Gantt POST function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		var gantt = {title:req.body.title.toString()};
		Schema.create(gantt, function(err, success){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.send(success);
			}
		});
	}
}
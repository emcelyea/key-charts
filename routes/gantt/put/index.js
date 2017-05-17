/*
 *	Gantt POST function
 */
module.exports = function(Schema){
	
	return function(req,res,next){

		if(req.params.gantt && (req.body.title) ){
			Schema.find({_id:req.params.gantt}, function(err, gantt){
				if(err){
					res.status(400);
					res.send(err);
				}else{
					if(gantt.length > 1){
						console.error('WEIRD GANTT ERROR');
					}else{
						gantt = gantt[0];
					}
					gantt.title = req.body.title;
					gantt.save(function(err, success){
						if(err){
							res.status(400);
							res.send(err);
						}else{
							res.status(200);
							res.send(success);
						}
					});	
				}
			});
		}else{
			res.status(400);
			res.send('Missing parameters to update team');
		}
	}
}
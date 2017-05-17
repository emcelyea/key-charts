/*
	Gantt PUT function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.task && req.body.task){
			Schema.find({_id:req.params.task.toString()},function(err, task){
				if(err){
					res.status(400);
					res.send(err);
				}else{
					
					var newTask= req.body.task;
					var setProperties = {$set:{}};	
					
					timeperiod = timeperiod[0];
					
					if(task['startTime'] !== newTask['startTime']){
						setProperties['$set']['startTime'] = newTask['startTime'];
					}
					if(task['endTime'] !== newTask['endTime']){
						setProperties['$set']['endTime'] = newTask['endTime'];
					}
					if(task['team'] !== newTask['team']){
						setProperties['$set']['team'] = newTask['team'];
					}
					if(task['name'] !== newTask['name']){
						setProperties['$set']['name'] = newTask['name'];
					}

					Schema.update({_id:task._id}, setProperties, function(err, success){
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
			res.send('Invalid Parameters');
		}
	}
}
/*
	Gantt PUT function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.timeperiod && req.body.timeperiod){
			Schema.find({_id:req.params.timeperiod.toString()},function(err, timeperiod){
				if(err){
					res.status(400);
					res.send(err);
				}else{
					
					var newTimePeriod = req.body.timeperiod;
					var setProperties = {$set:{}};	
					
					timeperiod = timeperiod[0];
					
					if(timeperiod['startTime'] !== newTimePeriod['startTime']){
						setProperties['$set']['startTime'] = newTimePeriod['startTime'];
					}
					if(timeperiod['endTime'] !== newTimePeriod['endTime']){
						setProperties['$set']['endTime'] = newTimePeriod['endTime'];
					}
					
					Schema.update({_id:timeperiod._id}, setProperties, function(err, success){
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
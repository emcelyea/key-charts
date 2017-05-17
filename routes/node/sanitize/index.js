
var sanitize = function(req){
	var requiredFields = ['positionX', 'positionY', 'type', 'flowchart'];
	var errs = '';
	if(!req.body){
		errs += 'Missing request body';
	}else{
		if(!Number.isInteger(Number(req.body.positionX))){
			errs += 'Missing or invalid positionX';
		}
		if(!Number.isInteger(Number(req.body.positionY))){
			errs += 'Missing or invalid positionY';
		}
		if(!req.body.type ){
			errs += 'Missing or invalid type';
		}
		if(!req.body.flowchart){
			errs += 'Missing or invalid flowchart';
		}
	}
	return errs;
}

module.exports = sanitize; 
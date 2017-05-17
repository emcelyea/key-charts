var express = require('express');
var router  = express.Router();
var schema  = require('../../models/gantt/gantt');

router.get( '/',   			 require('./get')(schema));
router.post('/',  		   require('./post')(schema));
router.put('/:gantt', 	 require('./put')(schema));
router.delete('/:gantt', require('./delete')(schema));
//console.log(router);
module.exports = router;


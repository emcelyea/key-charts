var express    = require('express');
var router     = express.Router();
var schema  	 = require('../../models/flow/flowchart.js');
var controller = require('../../controllers/flow/flowchart.js');

router.get( '/:flowchart', require('./get')(schema, controller));
router.post('/', require('./post')(schema, controller));
router.put('/:flowchart', require('./put')(schema, controller));
router.delete('/:flowchart', require('./delete')(schema, controller));
//console.log(router);
module.exports = router;


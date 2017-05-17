var express = require('express');
var router  = express.Router();
var schema  = require('../../models/flow/node.js');
var controller = require('../../controllers/flow/node.js');
var sanitize = require('./sanitize');

router.get( '/:node', require('./get')(schema, controller));
router.get('/byNodelist/:nodelist', require('./get-by-nodelist')(schema, controller));
router.put('/:node', require('./put')(schema, controller, sanitize));
router.post('/', require('./post')(schema, controller, sanitize));
router.delete('/:node', require('./delete')(schema, controller));
//console.log(router);
module.exports = router;


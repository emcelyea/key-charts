var express = require('express');
var router  = express.Router();
var schema  = require('../../models/flow/nodelist.js');
var controller = require('../../controllers/flow/nodelist.js');

router.get( '/:nodelist', require('./get')(schema, controller));
router.get( '/byFlow/:flowchart', require('./get-by-flow')(schema, controller));
router.post('/', require('./post')(schema, controller));
router.delete('/:nodelist', require('./delete')(schema, controller));
//console.log(router);
module.exports = router;


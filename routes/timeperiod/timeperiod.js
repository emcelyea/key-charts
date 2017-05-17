var express = require('express');
var router  = express.Router();
var schema  = require('../../models/gantt/timeperiod');

router.get( '/',   require('./get')(schema));

router.post('/',   require('./post')(schema));

router.put('/:timeperiod', require('./put')(schema));

router.delete('/:timeperiod', require('./delete')(schema));


module.exports = router;
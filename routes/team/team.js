var express = require('express');
var router  = express.Router();
var schema  = require('../../models/gantt/team');

router.post('/',   		require('./post')(schema));
router.put ('/:team',   require('./put')(schema));
router.delete('/:team', require('./delete')(schema));
router.get( '/',  		require('./get')(schema));

module.exports = router;
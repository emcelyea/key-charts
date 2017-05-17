/* Dependencies */
var morgan 	   = require('morgan'); //Logging
var express    = require('express');
var path 	   = require('path');
var bodyParser = require('body-parser');

/* Routes */
var gantt 			= require('./routes/gantt/gantt.js');
var timeperiod  = require('./routes/timeperiod/timeperiod');
var team        = require('./routes/team/team');
var task        = require('./routes/task/task');

var flowchart   = require('./routes/flowchart/flowchart');
var nodelist    = require('./routes/nodelist/nodelist');
var node        = require('./routes/node/node');

var PORT  = 63340;

var server = express();

//init loggin
server.use(morgan(':method :url :status'));

//parse request bodies
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

//static files, replace with nginx in prod env
server.use('/', express.static(path.join(__dirname, 'public')));

//API routes Gantt
server.use('/api/gantt', gantt);
server.use('/api/timeperiod', timeperiod);
server.use('/api/team', team);
server.use('/api/task', task);

//API routes flow
server.use('/api/flowchart', flowchart)
server.use('/api/nodelist', nodelist);
server.use('/api/node', node);

//connect to Database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/charts', function(err){
  if(err){
    throw err;
  }else{
    console.log('DB connection started');
  }
});

//init server
console.log('Launching server, listening on ', PORT);
server.listen(PORT);

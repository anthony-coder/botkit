var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection to db refused"));

db.once('open', function() {


var client_schema = new mongoose.Schema({

client_name : String,
client_email: String,
client_limit: Number,
oustanding_tasks : [String],
inprogress_tasks : [String],
finished_tasks : [String]

});


//creates client model from scheme defined above
var client = mongoose.model('Client', client_schema);

var test_client = new client({client_name: "Test Client"});
console.log(test_client.client_name);

test_client.save(function (err, test_client) {

if (err) return console.error(err);


console.log("Reached last if statement");
});


/*

var test_client = new client({name: 'Silence'});

console.log(test_client.client_name);



var task_schema = new mongoose.Schema({
task_title: String,
task_description: String,
verb_list : [String],
tech_nouns: [String],
client : String, 
contractor : String
});

//creates task model from task_schema
var task = new mongoose.model('Task', task_schema);


var contractor_schema = new mongoose.Schema({

contractor_name : String,
contractor_email : String, 
contractor_balance: Number,
outstanding_tasks : [String],
inprogress_tasks : [String],
finished_tasks : [String]
});

var contractor = mongoose.model('contractor', contractor_schema);
*/

});

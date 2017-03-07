var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection to db refused"));

db.once('open', function() {


var client_schema = new mongoose.Schema({

client_uid: Number,
client_name : String,
client_email: String,
client_limit: Number,
oustanding_tasks : [String],
inprogress_tasks : [String],
finished_tasks : [String],
tentative_finished_tasks: [String]

});

var coonsultant_schema = new mongoose.Schema({

	consul_uid: Number,
	consul_name: String,
	consul_email: String,
	oustanding_tasks : [String],
	inprogress_tasks: [String],
	to_be_confirmed: [String],
	skill_list: [String]

});

var task = new mongoose.Schema({
	client_uid: Number, 
	consul_uid: Number,
	task_id: Number,
	skill_list: [String]

});

var client = mongoose.model('Client', client_schema);

var test_client = new client({client_name: 'Test_client'});

test_client.save(function (err) {
	if (err) {
		return console.error(err)
	}else{
		console.log('added to database succesfully');

	}

	});


});	


//Creating Qiery helper functiosn to query data fields by user id

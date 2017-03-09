/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/
asdf

This is a sample Slack Button application that adds a bot to one or many slack teams.

# RUN THE APP:
  Create a Slack app. Make sure to configure the bot user!
q    -> https://api.slack.com/applications/new   -> Add the Redirect URI: http://localhost:3000/oauth
  Run your bot from the command line:
    clientId=<my client id> clientSecret=<my client secret> port=3000 node slackbutton_bot_interactivemsg.js
# USE THE APP
  Add the app to your Slack by visiting the login page:
    -> http://localhost:3000/login
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


//New code to add routes for slash commands and incoming webhooks
/*
var Request = require('request')
var slack = require('../controllers/botkit

/* Uses the slack button feature to offer a real time bot to multiple teams */

var mongoose = require('mongoose');


var Botkit = require('../lib/Botkit.js'),
	mongoStorage = require('botkit-storage-mongo')({mongoUri:'mongodb://admin:password@localhost:27017/test'}),
	controller = Botkit.slackbot({
		storage: mongoStorage
});
var controller = Botkit.slackbot({
		storage: mongoStorage
 }).configureSlackApp({
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	scopes: ['bot', 'commands'],
});


if (!process.env.clientId || !process.env.clientSecret || !process.env.port) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}
//SET UP WEB SERVER
controller.setupWebserver(process.env.port,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver);

  controller.createOauthEndpoints(controller.webserver,function(err,req,res) {
    if (err) {
      res.status(500).send('ERROR: ' + err);
    } else {
      res.send('Success!');
    }
  });
});


// just a simple way to make sure we don't
// connect to the RTM twice for the same team
var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

//This method is for interactive message_callback functionality. All button message interactions are passed back to this function 
controller.on('interactive_message_callback', function(bot, message) {

    var ids = message.callback_id.split(/\-/);
 
    var user_id = ids[0];
    var item_id = ids[1];
	console.log("************************************************************");
	console.log(ids);
    controller.storage.users.get(user_id, function(err, user) {

        if (!user) {
            user = {
                id: user_id,
		
                list: []
            }
        }
	
	//Switch statement for interactive message call_back
	//
	switch(message.callback_id)
	{
		//This case is for setting a users account 
		case 'set_account':
		console.log("**********message.actions*************************" + message.actions[0].value);
		
		//Statemente executed when thte result of espression matches set_account
		if(message.actions[0].value == 'client')
		{	controller.storage.users.save({id: message.user, account:'client'}, function(err) {});
	
		}	
		else
		{	
			controller.storage.users.save({id:message.user, account:'consultant'}, function(err) {});
		}
		//Respond back with the changed account type
		bot.replyInteractive(message, "Changed account type to: " + message.actions[0].value);
		break;
		
		//This case is for a new task created. The user will select buttons relevant to consulting project
	case 'new_task':
/*			
	  if (!user.task_list || !user.task_list.length) {
	      user.task_list = [
		  {
		      'id': 1,
		      'text': 'Docker'
		  },
		  {
		      'id': 2,
		      'text': 'Containerization'
		  },
		      {
			 'id': 3,
			  'text':'AWS'
		      },
		  {
		      'id': 4,
		      'text': 'Azure'
		  },
		      {
		      'id': 5,
		      'text' : 'Cloud Platforms'
		      }
		  ]
	    }			
		
	
*/	console.log("***********Within new_task case *****" + message.actions[0].value + "********");

	
	var reply = { title: 'A New task has been created', attachments: [ {title: message.actions[0].value}, { title: 'Summary', text: 'We are creating a match with a consultant with relevant skills related to ' + message.actions[0].value } ] }  
		
	bot.replyInteractive(message, reply);	

	
		
	/*
	for(var x = 0; x < user.task_list.length; x++) {
		
			if(message.actions[0].value=='flag'){
				if(message.actions[0].value=='flag'){
			
					user.task_list[x].flagged = !user.task_list[x].flagged;
			
				}
			}

		}
	     var reply = {text: 'Services', attachments: []}
	    for(var x = 0; x < user.task_list.length; x++)
	    {
	      reply.attachments.push({
		title: user.task_list[x].text + (user.task_list[x].flagged? ' * SELECTED *': ''), callback_id: 'new_task',
		attachment_type: 'default',
		actions: [
		  {
		   'name':user.task_list[x].text,
		    'text':":waving_black_flag:" + user.task_list[x].text,
		    'value' : 'flag'
		    //'type': 'button'

		  }
		]


	      })
	    }

		bot.replyInteractive(message, reply);

		*/


			controller.storage.users.save(user);
			break;
		}


 
	});


}); //end of main controller method
/*Create Bot function


*/
//This method is triggered when a bot is first added to a team
controller.on('create_bot',function(bot,config) {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
      }

      bot.startPrivateConversation({user: config.createdBy},function(err,convo) {
        if (err) {
          console.log(err);
        } else {
          convo.say('I am a bot that has just joined your team');
          convo.say('You must now /invite me to a channel so that I can be of use!');
        }
      });

    });
  }

});

// Handle events related to the websocket connection to Slack
controller.on('rtm_open',function(bot) {
  console.log('** The RTM api just connected!');
});

controller.on('rtm_close',function(bot) {
  console.log('** The RTM api just closed');
  // you may want to attempt to re-open
});
/*
Edited: Anthony
B E G I N ~ C O N T R O L L E R . H E A R S ~ M E T H O D S
Begin creation of controller.hears(function)

controller.hears(['keyword','^pattern$'],['message_received'],function(bot,message) {

*/
/**************************************************************************

USER SETS ACCOUNT TYPE 


User has the option to choose between a client or contractor accuont, but cannot be both at the same time. 
***************************************************************************/
//This controller method allows users to change account type from client to consultant and back
//functional as of 3/7
controller.hears(['set account', 'login'], 'message_received,direct_mention,direct_message', function(bot,message) {
	
	//var user = {id: message.user, account: message.match[1], oustanding_tasks: [] };
	//controller.storage.users.save(user);

	user = controller.storage.users.get(message.user);
	
	
	

	controller.storage.users.get(message.user, function(err, user) {
	
		if(!user) {
			user =  {
				id: message.user, 
				list: [],
//				accountType: "",
			}
		}

	console.log("***********REACHED SAVED USERS***********************");
	controller.storage.users.save(user);
	console.log("***********AFTER SAVED USERS*************************");

bot.reply(message, {

    "attachments":[
        {
            "text": "Select the account type",
            "fallback": "You are unable to choose an account type",
            "callback_id": "set_account",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "account",
                    "text": "Client",
                    "type": "button",
                    "value": "client"
                },
                {
                    "name" : "account",
                    "text": "Consultant",
                    "type": "button",
                    "value": "consultant"
                }
            ]
        }
    ]
});








/*
	controller.storage.users.get(message.user, function(err,user) {
	if(!user) {
		console.log("*******************************************************If !User*************************");	
		user = { id : message.user, 
			 list:[]
 			}
		 	} 
		});	


*/
		//Testing the User Id response
//	        bot.replyInteractive(message, reply);

}); //end of main controller
	
});

/*********************************************************************
Retrieve profile information 
************************************************************************/
controller.hears(['get account information', 'account', 'account info'],'message_received,direct_mention,direct_message', function(bot, message){

console.log("**************** within get account info controller****");

	//begin controller storage query
	controller.storage.users.get(message.user, function(err, user) {
	
		if(!user) {
				
		console.log("There is currently no account information- enter login to set an account type");
		}


		var reply = { text: 'Here is your current account information', 
				attachments: [ {
						

						'title': 'Account Information',
						'fields' : [{'title': 'User ID',
								'value': message.user,
								'short': true
								},
							    	{ 
								'title': 'Account Type',
								'value': user.account,
								'short' : true
								}
						
							]			
					      }]
					
				} 

		bot.reply(message, reply);
	     });
	
});//end controller storage query


/**********************************************************************
* User creates a New Task. They bot will reply with a series of buttons that the user can use to define the 
scope and services/tools they want to use
Currently incuding: Docker, AWS, Google Cloud Platform, Azure, Contanerization

*HOW TO USE: <------(must add to help in order for users to add message appropriately
*
*********************************************************************/
controller.hears(['new task','add <item>'],'message_received, direct_mention,direct_message',function(bot,message) {
console.log("*******Made it within new task********************");
	


	controller.storage.users.get(message.user, function(err, user){

	if (!user.task_list || !user.task_list.length) {
  	user.task_list = [
          {
              'id': 1,
              'text': 'Docker'
          },
          {
              'id': 2,
              'text': 'Containerization'
          },
              {
                 'id': 3,
                  'text':'AWS'
              },
          {
              'id': 4,
              'text': 'Azure'
          },
              {
              'id': 5,
              'text' : 'Cloud Platforms'
              }
	      ]
	}

	var reply = {text: 'Here are the services offered. Enter `create task <service>` to create a task.', attachments: []}
	for(var x = 0; x < user.task_list.length; x++)
	{
	  reply.attachments.push({
	    title: user.task_list[x].text + (user.task_list[x].flagged? ' * SELECTED *': ''), callback_id: 'new_task',
	    attachment_type: 'default',
	    actions: [
		  {
		   'name':user.task_list[x].text,
		    'text':":waving_black_flag:" + user.task_list[x].text,
		    'value' : user.task_list[x].text,
		    'type': 'button'
		  
		  }
	    ]

	  
	  })
	}

/*
	var services = ["Docker", "AWS", "Azure", "Containerization"];

	var reply = {
		text: "Select items from this list that are relevant to your task. (currently only supporting tooling shown)",
		attachments: [],
	}

	//Display all tooling services supported by Chatops, all button interactions are sent to interactive message callback
	for(var x = 0; x < services.length; x++)
	{
		reply.attachments.push({
		
		title: services[x] + (services[x].flagged? '*Flagged*': ' '),
		callback_id: 'new_task',
		attachmentType: 'default',
		actions: [{ "name":"service",
				  "text": services[x],
				  "value" : services[x],
			          "type" : "button",
				
			  }] 
		})
	}
*/	bot.reply(message, reply);
	controller.storage.users.save(user);
	});
});

/* 
* This controller method handles help requests
*
****************************************************************/
controller.hears(['help', 'nwi help'], 'message_received, direct_mention, direct_message', function(bot, message) {

	controller.storage.users.get(message.user, function(err, user) {

	
	});

});

/*
hears for list and tasks to display current tasks

*/
controller.hears(['list','tasks'],'direct_mention,direct_message',function(bot,message) {

    controller.storage.users.get(message.user, function(err, user) {

        if (!user) {
            user = {
                id: message.user,
                list: []
            }
        }

var services = ['Docker', 'AWS', 'Azure', 'Containerization'];	

        var reply = {
            text: 'Select relevant services that your task is relatd to.',
           attachments: [],
        }

		for (var x = 0; x < services.length; x++) {
            	reply.attachments.push({
		title: services[x],
                callback_id: message.user + '-' + user.list[x].id,
                attachment_type: 'default',
                 actions: [
                   
                    {
                       "text":services[x],
                        "name": services[x],
                        "value": services[x],
                        "type": "button",
                        "confirm": {
                          "title": "Are you sure?",
                          "text": "This will do something!",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                        }
                    }
               	    ]
            	   })

		console.log("Within For Loop" + x);
		console.log(reply.attachments[x]);
        	}


        bot.reply(message, reply);

        controller.storage.users.save(user);

    });

});

controller.hears('interactive', 'direct_message', function(bot, message) {

    bot.reply(message, {
        attachments:[
            {
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                        "name":"no",
                        "text": "No",
                        "value": "no",
                        "type": "button",
                    }
                ]
            }
        ]
    });
});


controller.hears('^stop','direct_message',function(bot,message) {
  bot.reply(message,'Goodbye');
  bot.rtm.close();
});

controller.on(['direct_message','mention','direct_mention'],function(bot,message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  },function(err) {
    if (err) { console.log(err) }
    bot.reply(message,'Hello, RTM API is listening.');
  });
});

controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
          trackBot(bot);
        }
      });
    }
  }

});





/***********************************************************************************************


Mongoose schema definitions

****************************************/
var client_schema = new mongoose.Schema({

id: Number,
client_name : String,
client_email: String,
client_limit: Number,
oustanding_tasks : [String],
inprogress_tasks : [String],
finished_tasks : [String],
tentative_finished_tasks: [String]

});

var consultant_schema = new mongoose.Schema({

   id : Number,
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
    skill_list: [String],
	id: Number
});




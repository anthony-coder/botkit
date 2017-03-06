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
var Botkit = require('../lib/Botkit.js'),
	mongoStorage = require('botkit-storage-mongo')({mongoUri:'localhost:27017'}),
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



/*
.configureSlackApp( {
	clientId: process.env.clientId,
	clientSecret: process.env.clientSecret,
	scopes: ['bot','commands'],
	})
);
*/
if (!process.env.clientId || !process.env.clientSecret || !process.env.port) {
  console.log('Error: Specify clientId clientSecret and port in environment');
  process.exit(1);
}

/*
var config = {}
if(process.env.MONGOLAB_URI) {
	var BotkitStorage = require('botkit-storage-mongo');
	config = {
		storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
	};	
}else {
	config = {
		json_file_store: './db_slackbutton_bot/',
	};
}
*/
/*
var controller = Botkit.slackbot({
  // interactive_replies: true, // tells botkit to send button clicks into conversations
  json_file_store: './db_slackbutton_bot/',
  // rtm_receive_messages: false, // disable rtm_receive_messages if you enable events api
}).configureSlackApp(
  {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    scopes: ['bot', 'commands'],
  }
);
*/


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

/*
controller.on('slash_command', function(slashCommand,message){
	switch(command, message) {
	case "/nwi": //handle /echo slash commands, if message is empty assume querying for help
			//verify tokens match
		//if(message.token !== process.env.VERIFICATION_TOKEN) return;
		
		if(message.text === "" || message.text == "help") {
	 	slashCommand.replyPrivate(message, "Try Typing '/nwi help'");
	}

	//logic to perform queries against mongodb

	slashCommand.replyPublic(message, "Hello", function() {
		slashCommand.replyPublicDelayed(message, "Yo").then(slashCommand.replyPublicDelayed(message,"Message Three"));
	});

	break;
	default:
	slashCommand.replyPublic(message, "I'm afraid I don't know how to " + message.command+ "yet. ");
  }
});
*/

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

	console.log("************************* Before for loop **************");
        for (var x = 0; x < user.list.length; x++) {
            if (user.list[x].id == item_id) {
                if (message.actions[0].value=='flag') {
                    user.list[x].flagged = !user.list[x].flagged;
                }
                if (message.actions[0].value=='delete') {
                    user.list.splice(x,1);
                }
            }
        }

        var reply = {
            text: 'Here is <@' + user_id + '>s list of tasks:',
            attachments: [],
        
	}
		
        for (var x = 0; x < user.list.length; x++) {
            reply.attachments.push({
                title: user.list[x].text,
                callback_id: user_id + '-' + user.list[x].id,
                attachment_type: 'default',
                actions: [
                    {
                       "text": "Delete",
                        "name": "delete",
                        "value": "delete",
                        "style": "danger",
                        "type": "button",
                        "confirm": {
                          "title": "Are you sure?",
                          "text": "This will delete the task!",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                        }
                    },
			

		    
                ]
            })
        }

        bot.replyInteractive(message, reply);
        controller.storage.users.save(user);
    });

});
/*Create Bot function


*/

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


/*
controller.ong('slash_command', function(slashCOmmand, message) {
	switch(message.commmand){
	case /echo: //handle the '/echo' slash command,.. We might have o

}

*/

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


controller.hears(['set account', 'login'], 'message_received,direct_mention,direct_message', function(bot,message) {
	
	controller.storage.users.get(message.user, function(err,user) {
 		if(!user) {
			
		user = { id : message.user, 
			 list:[]
 			}
		 	} 
		});


bot.replyInteractive(message, {
    
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
                    "text": "Contractor",
                    "type": "button",
                    "value": "contractor"
                }
            ]
        }
    ]
});


		//Testing the User Id response
//	        bot.replyInteractive(message, reply);


		
});


/**********************************************************************
* User creates a New Task. They bot will reply with a series of buttons that the user can use to define the 
scope and services/tools they want to use
Currently incuding: Docker, AWS, Google Cloud Platform, Azure, Contanerization

*HOW TO USE: <------(must add to help in order for users to add message appropriately
*
*********************************************************************/
controller.hears(['new task (.*)','add <item>'],'message_received, direct_mention,direct_message',function(bot,message) {


	var services = ["Docker", "AWS", "Azure", "Containerization"];


/*controller.storage.users.get(user_id, function(err, user) {

        if (!user) {
            user = {
                id: user_id,
                list: []
            }
        }
*/
    controller.storage.users.get(message.user, function(err, user) {

        if (!user) {
            user = {
                id: message.user,
                list: []
            }
        }
/*
        user.list.push({
            id:   message.ts,
            text: message.match[1],
        });
*/
	/*When Task is created, query node-express-service-1 which also has access to MongoDB running locally in container

	1. Set up node-express-service-1
	2. Connect node-1 to mongoDB
	3. when an update happens in mongoDB 
								

	*/
	         var reply = {
			
			text: "Please select relevant services",
			attachments:[],
		}	
	

		for(var x = 0; x < services.length; x++) {
                reply.attachments.push({
                title: services[x],
                callback_id: message.user + '-' + user.id,
                attachment_type: 'default',
                 actions: [

                    {
                       "text": "docker",
                        "name": "docker",
                        "style": "danger",
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


		console.log("WIthin for Loop " + x);
                }

	bot.replyInteractive(message,reply)

  //      controller.storage.users.save(user);

    });
});


/*controller.hears for help with commands usable with nwi chatops bot




*/

/*************************************************************
* User enters help with a direct message or a direct mention
* 
*
*
*****************************************************************/

controller.hears(['help', 'nwi help'], 'message_received, direct_mention, direct_message', function(bot, message) {

	controller.storage.users.get(message.user, function(err, user) {

	
	});


	//bot.reply(message, '

	
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
/*
	var service = new function() {
	
	
	}

*/	//var service = { name='Docker', flagged=0 };



var services = ['Docker', 'AWS', 'Azure', 'Containerization'];	
/*	
	var services = {
		

	}
*/
	/*
        if (!user.list || !user.list.length) {
            user.list = [
                {
                    'id': 1,
                    'text': 'Test Item 1'
                },
                {
                    'id': 2,
                    'text': 'Test Item 2'
                },
                {
                    'id': 3,
                    'text': 'Test Item 3'
                }
            ]
        }
	*/

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
//	console.log(reply.attachments

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

/* controller.hears('interactive', 'direct_message, function(bot, message){
 *
 *
 *
 * }
 *
 *
 * */
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






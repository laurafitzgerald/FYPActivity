var nats = require('nats');
var servers = ['nats://nats.default:4222'];
var nc = nats.connect({'servers': servers});
console.log("Connected to " + nc.currentServer);


var activitytable = '{ "columns": { "timestamp": "text", "type": "text" ,"time": "decimal", "distance": "decimal", "speed": "decimal", "username": "text"  },"primary": ["timestamp","username"],"indexes": ["username"]}';
nc.request('data.register.activity', activitytable, function(response){});

nc.subscribe('activity.read.byuser', function(msg, reply, sub){
		console.log("received read by user request");
		nc.request('data.query.activity',msg, function(response){
			//read records from the activity table using the user id
			console.log(response);
			//results = JSON.parse(response);
			//result = JSON.stringify(results);
			nc.publish(reply,response);
		});
});

//msg = data
nc.subscribe('activity.create', function(msg, reply, sub){
		console.log("Activity.create");
		console.log("Message.username: " + msg);
			console.log("valid user found in activity.create");
			nc.request('data.write.activity', msg, function(response){
				//will need to do error handling/other stuff here
				//making sure that user names are correctly formatted etc.
				//passwords are okay etc. 
				nc.publish(reply,response);
			});
	
});

nc.subscribe('activity.delete', function(msg,reply,sub){
	//delete by username and timestamp
	//needs to be the composite key
	var uuid = "'" + msg + "'";
	var filter = '"uuid='+uuid + '"';
	var msg = '{ "filters" : [ ' + filter + ']}';
	nc.request('data.delete.activity', msg, function(response){
		nc.publish(reply, response);
	});

});

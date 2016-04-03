var nats = require('nats');
var servers = ['nats://nats.default:4222'];
var nc = nats.connect({'servers': servers});
console.log("Connected to " + nc.currentServer);


var activitytable = '{ "columns": { "id": "text", "name": "text","timestamp": "text", "type": "text" ,"location": "text" ," time": "decimal", "distance": "decimal", "speed": "decimal", "username": "text"  },"primary": ["id"], "indexes": ["username"]}';
nc.request('data.register.activity', activitytable, function(response){});




nc.subscribe('activity.read.byuser', function(msg, reply, sub){
		var username = "'" +msg + "'";
		var filter = '"username='+username+ '"';
		var msg = '{ "filters" : [ ' + filter + ']}';
		nc.request('data.query.activity', msg, function(response){
			console.log(response);
			nc.publish(reply,response);
		});
});

//msg = data
nc.subscribe('activity.create', function(msg, reply, sub){
	console.log("Activity.create");
	//console.log("Message.username: " + msg);	
	var obj = JSON.parse(msg);
	var d = new Date();
	var currentdate = d.toLocaleString();
	console.log("Current Date: "+ currentdate);
	obj.timestamp = currentdate;
	obj.id = (new Date).getTime().toString();


	nc.request('data.write.activity', JSON.stringify(obj), function(response){
		//will need to do error handling/other stuff here
		//making sure that user names are correctly formatted etc.
		//passwords are okay etc. 
		console.log("Response : " + response)
		console.log("Reply : " + reply);
		nc.publish(reply,response);
	});
	
});

nc.subscribe('activity.delete', function(msg,reply,sub){
	//delete by username and timestamp
	//needs to be the composite key
	//var uuid = "'" + msg + "'";
	//var filter = '"uuid='+uuid + '"';
	//var msg = '{ "filters" : [ ' + filter + ']}';

	var query = {};
	var msg = msg.replace(/"/g, '');
	

	query.filters = ["id='" + msg +"'"];

	console.log(" query : " + JSON.stringify(query));
	nc.request('data.delete.activity', JSON.stringify(query) , function(response){
		console.log("delete response" + response);
		nc.publish(reply, response);
	});

});

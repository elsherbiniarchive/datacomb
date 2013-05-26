Meteor.publish("datastream", function(){
	return BEEDATA.find({},{});
 });
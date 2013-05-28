Meteor.startup( function () {

	//get the date field of the latest entry in the database


	Meteor.setInterval(function(){
		var nextDate;
		var modelDoc = BEEDATA.find({},{sort: {date: -1}, skip: 287, limit: 1}).fetch()[0];

		modelDate = {
			year: +modelDoc.date.slice(0,4),
			month: +modelDoc.date.slice(5,7),
			day: +modelDoc.date.slice(8,10),
			hour: +modelDoc.date.slice(11,13),
			minute: +modelDoc.date.slice(14,16)
		};

		nextDate = modelDate;

		if (modelDate.minute === 55){
			if (modelDate.hour === 23){
				if ((modelDate.day === 28 && modelDate.month === 2) || (modelDate.day === 30 && (modelDate.month === 4 || modelDate.month === 6 || modelDate.month === 9 || modelDate.month === 11)) || modelDate.day === 31){
					if(modelDate.month === 12){
						nextDate.year = 1;
						nextDate.month = 0;
						nextDate.day = 1;
						nextDate.hour = 0;
						nextDate.minute = 0;

					} else {
						nextDate.month += 1;
						nextDate.day = 1;
						nextDate.hour = 0;
						nextDate.minute = 0;
					}
				} else {
					nextDate.day += 2;
					nextDate.hour = 0;
					nextDate.minute =0;
				}
			}else {
				nextDate.day += 1
				nextDate.hour += 1
				nextDate.minute = 0;
			}
		}else {
			nextDate.day += 1
			nextDate.minute += 5;
		}

		nextDate = {
			year: "" + nextDate.year,
			month: nextDate.month < 10 ? "0" + nextDate.month : "" + nextDate.month,
			day: nextDate.day < 10 ? "0" + nextDate.day : "" + nextDate.day,
			hour: nextDate.hour < 10 ? "0" + nextDate.hour : "" + nextDate.hour,
			minute: nextDate.minute < 10 ? "0" + nextDate.minute : "" + nextDate.minute
		};

		var nextDateString = "" + nextDate.year + "/" + nextDate.month + "/" + nextDate.day + " " + nextDate.hour + ":" + nextDate.minute;


		var doc = {
			"date": nextDateString,
			"weight": +modelDoc.weight + 7.5 + Math.random()*.1,
			"hiveTemp": +modelDoc.hiveTemp + Math.random()*.5,
			"ambientTemp": +modelDoc.ambientTemp + Math.random()*.5,
			"windDirection": modelDoc.windDirection,
			"windSpeed": +modelDoc.windSpeed,
			"windGustSpeed": +modelDoc.windGustSpeed,
			"dewpointFahrenheit": +modelDoc.dewpointFahrenheit,
			"relativeHumidity": +modelDoc.relativeHumidity,
			"pressure": +modelDoc.pressure,
			"pressureTrend": modelDoc.pressureTrend

		}

		doc.ambientFahrenheit = doc.ambientTemp *(9/5) + 32
		
		BEEDATA.insert(doc)



	}, 10000);


});
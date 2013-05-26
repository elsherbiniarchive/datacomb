var tempWeightChart = dc.compositeChart("#tempWeight-chart");

Meteor.subscribe("datastream", function(){
	var data = BEEDATA.find().fetch();

	var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

	data.forEach(function(d){
		d.date = parseDate(d.date);
		});

	var beeData = crossfilter(data);
	var all = beeData.groupAll();

	var dataByTimepoint = beeData.dimension(function(d){
		return d.date;
	})

	//BEEDATA fields
	//"date","weight","hiveTemp","ambientTemp","ambientFahrenheit","windDirection","windSpeed"
	//"windGustSpeed","dewpointFahrenheit","relativeHumidity","pressure","pressureTrend"

	var timepointGroup = dataByTimepoint.group().reduce(
		//add
		function (p,v){
			++p.count;
			p.weight += +v.weight;
			p.hiveTemp += +v.hiveTemp;
			p.ambientTemp += +v.ambientTemp;
			return p;
		},
		//remove
		function (p,v){
			--p.count;
			p.weight -= +v.weight;
			p.hiveTemp -= +v.hiveTemp;
			p.ambientTemp -= +v.ambientTemp;
			return p;
		},
		//initial
		function(){
			return {count: 0, weight: 0, hiveTemp: 0, ambientTemp: 0};
		}
	);

	tempWeightChart.width(990)
		.height(180)
		.transitionDuration(1000)
		.margins({top:10, right:50, bottom: 25, left: 40})
		.dimension(dataByTimepoint)
		.group(timepointGroup)
		.x(d3.time.scale().domain([new Date(2012,10,23,16,25), new Date(2012,10,31,0,5) ]))
		.xUnits(d3.time.minutes)
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.brushOn(false)
		.compose([
			dc.lineChart(tempWeightChart).group(timepointGroup)
				.valueAccessor(function (d) {
					return d.value.weight;
				})
			])
		.xAxis();

	console.log(tempWeightChart.x());

	dc.renderAll();
	});
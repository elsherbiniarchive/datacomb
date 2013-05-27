Meteor.subscribe("datastream", function initializeDashboard() {

	var tempWeightChart = dc.compositeChart("#tempWeight-chart");
	var volumeChart = dc.barChart("#volume-chart");

	var data = BEEDATA.find().fetch();
	var dateFormat = d3.time.format("%Y/%m/%d %H:%M")
	var parseDate = dateFormat.parse;

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
			p.count += 1;
			p.weight += +v.weight;
			p.hiveTemp += +v.hiveTemp;
			p.ambientTemp += +v.ambientTemp;
			return p;
		},
		//remove
		function (p,v){
			p.count -= 1;
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
		.x(d3.time.scale().domain([new Date(2012,9,23,16,25), new Date(2012,9,31,0,5) ]))
		.xUnits(d3.time.minutes)
		.elasticY(true)
		.renderHorizontalGridLines(true)
		.brushOn(false)
		.compose([
			dc.lineChart(tempWeightChart).group(timepointGroup)
				.valueAccessor(function (d) {
					return d.value.hiveTemp;
				})
				.stack(timepointGroup, function (d) {
					return d.value.ambientTemp;
				})
				.title(function (d) {
					var value = d.value.hiveTemp;
					if (isNaN(value)) value = 0;
						return dateFormat(d.key) + "\n" + value;
				})
			])
		.xAxis();

	volumeChart.width(990)
		.height(40)
		.margins({top: 0, right: 50, bottom: 20, left: 40})
		.dimension(dataByTimepoint)
		.group(timepointGroup)
		.centerBar(true)
		.gap(0)
		.x(d3.time.scale().domain([new Date(2012,9,23,16,25), new Date(2012,9,31,0,5) ]))
		.round(d3.time.minute.round)
		.xUnits(d3.time.minutes)
		.renderlet(function (chart) {
			chart.select("g.y").style("display", "none");
			tempWeightChart.filter(chart.filter());
		})
		.on("filtered", function (chart) {
			dc.events.trigger(function () {
				tempWeightChart.focus(chart.filter());
			});
		});

	dc.renderAll();
});


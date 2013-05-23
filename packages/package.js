Package.describe({
  // define a message to describe the package
  summary: "Add dc.js, a dimensional charting tool built to work natively with crossfilter rendered using d3.js. ",

  // for internal dependency packages, set the internal flag true
  internal: false  
});

Package.on_use(function (api) {
	api.use("d3", ["client", "server"]);
	api.add_files("dc.js","cleint");
});






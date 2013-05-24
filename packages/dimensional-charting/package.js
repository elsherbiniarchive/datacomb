Package.describe({
  // define a message to describe the package
  summary: "Add dc.js, a dimensional charting tool built to work natively with crossfilter rendered using d3.js. "
});

Package.on_use(function (api) {
	api.use("d3", ["client", "server"]);
	api.add_files("dc.js","client");
});

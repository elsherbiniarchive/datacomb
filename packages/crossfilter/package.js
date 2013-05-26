Package.describe({
  // define a message to describe the package
  summary: "Add crossfilter, a tool for working with multi-dimensional datasets"
});

Package.on_use(function (api) {
	api.add_files("crossfilter.js","client");
});

// Return server object
serverStart = function() {
	
    /* Global accessor for underscore  */
	_ = require('underscore');

  /* Global accessor for logger  */
  logger = require('winston');
	
	var express = require('express');
	var app = express();

	 // support json encoded bodies
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// Enable view template compilation caching
	app.enable('view cache');

	return app;

};

// Any custom app initialization logic should go here
appStart = function(app) {
	
	var keystone = require('keystone');
	var appServer = keystone.get('appServer');
	var rootDir = require('app-root-path');
	var io = require(rootDir + '/sockets/')(appServer);

};

module.exports = function(frameworkDir, shared) {
	
	// Add main dependencies and EL web framework dependencies if not mounted with EL framework API
	require('app-module-path').addPath(frameworkDir + '/node_modules');
	
	// Obtain app root path and set as keystone's module root
	var appRootPath = require('app-root-path').path;
	var keystoneInst = require('keystone');
	keystoneInst.set('module root', appRootPath);
	keystoneInst.set('wysiwyg additional buttons', 'blockquote');

	  // Enables CORS for play domain on production, for static assets
	if(process.env.NODE_ENV === 'production') {
		keystoneInst.set('static options', {
			'setHeaders': function(res, path) {
		    res.header("Access-Control-Allow-Origin", "https://ecplay.org");
		    res.header('Access-Control-Allow-Methods', 'GET, POST');
		    res.header("Access-Control-Allow-Headers", "X-Requested-With");
		  }
		});
	}

	keystoneInst.set('static', 'public');

	return { 

		keystone: keystoneInst,
		server: serverStart,
		start: appStart	

	}

};
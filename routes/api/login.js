'use strict';

/**
 * Emerging Citizens
 * Developed by Engagement Lab, 2016
 * ==============
 * Home page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class index
 * @static
 * @author Johnny Richardson
 *
 * ==========
 */

var keystone = require('keystone'),
    async = require('async'),
    appRoot = require('app-root-path');
    
var TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    Templates = new TemplateLoader();

/**
 * Open Login Modal
 */
exports.modal = function(req, res) {

    var template = 'partials/platform/loginModal';

    var data = {
        role: req.params.role.replace('-entry', '')
    };

    Templates.Load( template, data, function( html ) {

        res.send({ eventData: html });

    }); 

};


/**
 * Login to the platform
 */
exports.login = function(req, res) {

    // Do login check here --> 


    // <-- 

    res.send( '/platform/' + req.params.role );

};


/**
 * Singnup for the platform
 */
exports.signup = function(req, res) {

    var data = req.params.role;

    Templates.Load( template, data, function( html ) {

        res.send({ eventData: html });

    }); 

};


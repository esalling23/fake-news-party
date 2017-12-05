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
    
var _ = require('underscore'), 
    TemplateLoader = require(appRoot + '/lib/TemplateLoader'),
    Templates = new TemplateLoader(), 
    Profile = keystone.list('Profile'), 
    TimeSpan = keystone.list('TimeSpan');

/**
 * Open Login Modal
 */
exports.extend = function(req, res) {

    var template = 'partials/platform/timespan_ext';

    var data = {};

    var queryProfiles = Profile.model.find({}, {}, {
        sort: {
            'createdAt': -1
        }
    })
    .populate('pros cons neutrals timeSpan missions');

    var queryTimeSpan = TimeSpan.model.find({}, {}, {
        sort: {
            'createdAt': -1
        }
    });

    queryProfiles.exec(function (err, result) {

        var profiles = result;
        
        queryTimeSpan.exec(function (err, result) {

            var timespans = result,
            profileBlocks = [],
            timeBlock;

            _.each(timespans, function (timespan, index) {
                timeBlock = index;

                _.each(profiles, function (profile, index) {

                    if( profile.timeSpan.key === timespan.key ) {

                        if (!profileBlocks[ timeBlock ])
                            profileBlocks[ timeBlock ] = [];

                        profileBlocks[ timeBlock ].push( profile );
                    }

                });

            });

            var data = {
                profiles: profileBlocks, 
                timespans: timespans
            };
            
            Templates.Load( template, data, function( html ) {

                res.send({ eventData: html });

            }); 

        });

    });  

    


};



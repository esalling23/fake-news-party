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

var categorize = function(arr, cat) {
    return arr.filter(function(item) {
        return item.timeSpan.name == cat;
    });
};
/**
 * Open Login Modal
 */
exports.extend = function(req, res) {

    var template = 'partials/platform/timespan_ext', 
        data = {},
        timespan = req.params.block,
        decades = [0, 20, 40, 60, 80];

    var queryProfiles = Profile.model.find({}, {}, {
        sort: {
            'createdAt': -1
        }
    })
    .populate('pros cons neutrals timeSpan missions');

    queryProfiles.exec(function (err, result) {

        var profiles = categorize(result, timespan), 
            profileBlocks = [],
            timeBlock;

        _.each(decades, function (timespan, index) {
            timeBlock = index;

            _.each(profiles, function (profile, index) {

                if( profile.decadeBlock == timespan ) {

                    if (!profileBlocks[ timeBlock ])
                        profileBlocks[ timeBlock ] = [];

                    profileBlocks[ timeBlock ].push( profile );
                }

            });

        });

        var data = {
            profiles: profileBlocks
        };
        
        Templates.Load( template, data, function( html ) {

            res.send({ eventData: html });

        }); 

    });  

};



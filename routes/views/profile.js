'use strict';

/**
 * (Site name here)
 * Developed by Engagement Lab, 2016
 * ==============
 * Index page view controller.
 *
 * Help: http://keystonejs.com/docs/getting-started/#routesviews-firstview
 *
 * @class Index
 * @author 
 *
 * ==========
 */
var keystone = require('keystone'),
    appRoot = require('app-root-path'),
    Profile = keystone.list('Profile'),
    Player = keystone.list('Player'),
    Category = keystone.list('ContentCategory'),
    randomstring = require('randomstring'),
    GameSession = keystone.list('GameSession'),
    GameConfig = keystone.list('GameConfig'),
    _ = require('underscore');

var Game = require(appRoot + '/lib/GameManager'),
    Session = require(appRoot + '/lib/SessionManager');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // locals.viewType = 'group';
    locals.section = 'player';

    locals.gameId = req.params.accesscode;

    view.on('init', function(next) {

        var queryProfile = Profile.model.findOne({ '_id': req.params.profile }, {}, {});

        queryProfile.exec(function (err, profile) {

            locals.profile = profile;
            next(err);
                
        });


    });

    // Render the view
    view.render('game');

};





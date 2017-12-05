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
var _ = require('underscore'), 
    keystone = require('keystone'),
    Profile = keystone.list('Profile'), 
    TimeSpan = keystone.list('TimeSpan');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var role = req.params.role;


    view.on('init', function(next) {

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

        locals.profiles = result;
        
        queryTimeSpan.exec(function (err, result) {

          locals.timespans = result;

          next(err);

        });

      });     

    });

    view.render('platform');

};
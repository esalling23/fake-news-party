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
    Player = keystone.list('Player'), 
    TimeSpan = keystone.list('TimeSpan');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res);
    var locals = res.locals;

    var role = req.params.role;


    view.on('init', function(next) {

      var queryPlayers = Player.model.findOne({}, {}, {
        sort: {
            'createdAt': -1
        }
      });

      var queryTimeSpan = TimeSpan.model.findOne({}, {}, {
        sort: {
            'createdAt': -1
        }
      });

      // If game is enabled, get home page content
      queryPlayers.exec(function (err, result) {
        
        next(err);

      });     

    });

    view.render('platform');

};
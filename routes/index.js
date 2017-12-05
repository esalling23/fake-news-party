/* Emerging Citizens */
/**
 * Route definitions
 *
 * @module routes
 **/
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
// Handle 404 errors
keystone.set('404', function(req, res, next) {
    res.notfound();
});

// Import Route Controllers
var routes = {
    api: importRoutes('./api'),
    views: importRoutes('./views')
};

// Setup Route Bindings
exports = module.exports = function(app) {

    app.all('/*', keystone.middleware.cors);
    
    if(process.env.NODE_ENV === 'production') {
        app.all('/*', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "https://ecplay.org");
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT');
            res.header('Access-Control-Expose-Headers', 'Content-Length');
            res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method");
            
            if(req.method === 'OPTIONS')
                res.send(200);
            else
                next();

        });
    }

    // Views
    app.get('/', routes.views.index);
    app.get('/play/:debug?', routes.views.game.play);
    app.post('/login', routes.views.game.login);


    // Group screen
    app.get('/game/:accesscode/:debug?', routes.views.group.lobby);    
    
    // app.get('/about', routes.views.group.about);
    app.get('/about/:game_type?', routes.views.about);
    app.get('/help', routes.views.group.help);
    app.get('/lessonPlans', routes.views.group.lessonPlans);
    app.get('/new/:game_type', routes.views.group.index);

    // Login Modals
    app.get('/api/welcome/:role', keystone.middleware.api, routes.api.login.modal);

    // User Login and Signup
    app.get('/api/login/:role', keystone.middleware.api, routes.api.login.login);
    app.get('/api/signup/:role', keystone.middleware.api, routes.api.login.signup);

    // Platform Base
    app.get('/platform/:role', routes.views.platform);

    app.get('/api/timespan/:block', keystone.middleware.api, routes.api.timeline.extend);


    app.post('/api/create/:game_type', keystone.middleware.api, routes.api.gamesession.create);
    app.post('/api/load/', keystone.middleware.api, routes.api.templates.load);
    

};

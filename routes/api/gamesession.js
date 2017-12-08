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
    
var Game = require(appRoot + '/lib/GameManager'),
    GameData = keystone.list('GameData'),
    Session = require('learning-games-core').SessionManager,
    GameSession = keystone.list('GameSession'),
    ContentCategory = keystone.list('ContentCategory'), 
    randomstring = require('randomstring'),
    _ = require('underscore');

/**
 * Create a GameSession
 */
exports.create = function(req, res) {

    var sessionType;
    var data = (req.method == 'POST') ? req.body : req.query;
    var gameCode;

    console.log(data, " is the creation data")

    // Prevents generated code from being vulgar
    function checkCode(code, callback) {

        var fourLetter = ['ANUS', 'ARSE', 'CLIT', 'COCK', 'COON', 'CUNT', 'DAGO', 'DAMN', 'DICK', 'DIKE', 'DYKE', 'FUCK', 'GOOK', 'HEEB', 'HECK', 'HELL', 'HOMO', 'JIZZ', 'KIKE', 'KUNT', 'KYKE', 'LICK', 'MICK', 'MUFF', 'PAKI', 'PISS', 'POON', 'PUTO', 'SHIT', 'SHIZ', 'SLUT', 'SMEG', 'SPIC', 'TARD', 'TITS', 'TWAT', 'WANK', 'POOP', 'FUCK', 'FCUK', 'FUKK', 'KILL', 'JERK', 'CRAP', 'FOOK', 'DORK', 'DOPE', 'DUNG', 'FAGS', 'FART', 'GAYS', 'HELL', 'HOAR', 'JAPS', 'NAZI', 'ORGY', 'PORN', 'PUKE', 'RAPE', 'SEXY', 'SPIG', 'SUCK', 'STAB', 'SMUT', 'SPAZ', 'TWIT'];
        var threeLetter = ['ASS','FUC','FUK','FUQ','FUX','FCK','COC','COK','COQ','KOX','KOC','KOK','KOQ','CAC','CAK','CAQ','KAC','KAK','KAQ','DIC','DIK','DIQ','DIX','DCK','PNS','PSY','FAG','FGT','NGR','NIG','CNT','KNT','SHT','DSH','TWT','BCH','CUM','CLT','KUM','KLT','SUC','SUK','SUQ','SCK','LIC','LIK','LIQ','LCK','JIZ','JZZ','GAY','GEY','GEI','GAI','VAG','VGN','SJV','FAP','PRN','LOL','JEW','JOO','GVR','PUS','PIS','PSS','SNM','TIT','FKU','FCU','FQU','HOR','SLT','JAP','WOP','KIK','KYK','KYC','KYQ','DYK','DYQ','DYC','KKK','JYZ','PRK','PRC','PRQ','MIC','MIK','MIQ','MYC','MYK','MYQ','GUC','GUK','GUQ','GIZ','GZZ','SEX','SXX','SXI','SXE','SXY','XXX','WAC','WAK','WAQ','WCK','POT','THC','VAJ','VJN','NUT','STD','LSD','POO','AZN','PCP','DMN','ORL','ANL','ANS','MUF','MFF','PHK','PHC','PHQ','XTC','TOK','TOC','TOQ','MLF','RAC','RAK','RAQ','RCK','SAC','SAK','SAQ','PMS','NAD','NDZ','NDS','WTF','SOL','SOB','FOB','SFU'];

        if (_.contains (fourLetter, code))
            checkCode(generateCode(), callback);
        
        else if(threeLetter.some(function(s) { return code.indexOf(s) >= 0; }))
            checkCode(generateCode(), callback);

        else
            callback(code);

    }

    function generateCode() {
        
        var code = randomstring.generate({ length: 4, charset: 'alphabetic' }).toUpperCase();
        return code;

    }

    var generatedCode = generateCode();

    // Make sure code is not vulgar and then check if not used already
    checkCode(generatedCode, function(code) {

        gameCode = code;

        res.setHeader('Game-Code', code);

        // Check if there's already a game with the generated access code
        GameSession.model.findOne({ accessCode: gameCode }, function (err, session) {

            // There is! A one in 15,000 probability! Make a new one
            if(session !== null)
                gameCode = generateCode();
            else {
                var newSession = new GameSession.model();
                // Save this session to memory for faster retrieval (deleted when game ends)
                Session.Create(gameCode, new Game(newSession));

                res.send({ url: '/game/' + gameCode + '/' + data.profile });
            }


        });

    });


};

/**
 * Join a GameSession
 */
exports.join = function(req, res) {

    var sessionType;
    var data = (req.method == 'POST') ? req.body : req.query;

    var gameCode = data.code;

    res.setHeader('Game-Code', gameCode);

    // Check if there's already a game with the generated access code
    GameSession.model.findOne({accessCode: gameCode}, function (err, session) {

        // No Game?
        if(session == null)
            res.send({ error: "No Game Exists"})
        else {
            res.send({ url: '/game/' + gameCode + '/' + data.profile });
        }

    });

};
"use strict";function showScores(){var a=new TimelineLite({paused:!0,onComplete:function(){nextRound()}});$("#hashtags").remove(),void 0!==hashtagsAnimSlider&&null!==hashtagsAnimSlider&&hashtagsAnimSlider.clear(),a.from($("#scores"),1.5,{autoAlpha:0,ease:Bounce.easeOut}).staggerFrom($("#scores .left .player"),1,{xPercent:-100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut},1).staggerFrom($("#scores .right .player"),1,{xPercent:100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut,delay:.3},1,"players").to($("#scores"),1,{autoAlpha:0,display:"none",delay:3});var b=$(".score-box")[0];$(b).addClass("winner"),void 0!==$("#winners-circle")[0]&&a.from($("#winners-circle"),1.5,{scale:.5,autoAlpha:0,ease:Bounce.easeOut}).staggerTo($(".score-box").get().reverse,1,{xPercent:-100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut,delay:5},.3).staggerFrom($(".score-box").get().reverse(),1.5,{xPercent:100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut},2).to($("#winners-circle"),1,{autoAlpha:0,display:"none",delay:5}),a.to($("#leaderboard"),1.5,{autoAlpha:1,display:"block",ease:Bounce.easeOut}).staggerFrom($("#leaderboard .left .player"),1,{xPercent:-100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut},.5).staggerFrom($("#leaderboard .right .player"),1,{xPercent:100,force3D:!0,autoAlpha:0,ease:Elastic.easeOut,delay:.3},.5).to($("#leaderboard"),1,{autoAlpha:0,yPercent:100,display:"none",delay:5}),$("#slider-gsap").length&&(hashtagsAnimSlider=new GSAPTLSlider(a,"slider-gsap",{width:600})),a.play()}function nextRound(){$("#scores, #winners-circle, #leaderboard").remove(),TweenLite.from($("#next-round, #game-ended"),1,{autoAlpha:0,scale:0})}var hashtagsAnimSlider,openAnim=new TimelineLite;openAnim.from($(".room-container"),1,{scale:0,autoAlpha:0,delay:1,ease:Elastic.easeOut}).staggerFrom($(".players.left .player-background"),2,{xPercent:-200,force3D:!0,autoAlpha:0,ease:Elastic.easeOut},.1).staggerFrom($(".players.right .player-background"),2,{xPercent:200,force3D:!0,autoAlpha:0,ease:Elastic.easeOut},.1);var gameEvents=function(a,b){switch(a){case"game:countdown":var c=b.duration,d=360/c,e=$("#clock-hand");clockInterval=setInterval(function(){function a(){e.css({transform:"rotateZ("+-(d*c)+"deg)"}),c--}0===e.length&&(e=$("#clock-hand")),a(),0===c&&clearInterval(clockInterval)},1e3);break;case"hashtag:submitted":case"hashtags:received":updateGameContent(b,function(){var a=new TimelineLite({paused:!0});$("#hashtag-submissions-prompt").show(),a.from($("#hashtag-submissions-prompt"),1,{y:-200,autoAlpha:0,ease:Elastic.easeOut}).staggerFrom($("#hashtag-submissions .leftmost .hashtag"),1,{xPercent:-100,autoAlpha:0,ease:Elastic.easeOut},.5).staggerFrom($("#hashtag-submissions .left .hashtag"),1,{yPercent:100,autoAlpha:0,ease:Elastic.easeOut},.5).staggerFrom($("#hashtag-submissions .right .hashtag"),1,{yPercent:100,autoAlpha:0,ease:Elastic.easeOut},.5).staggerFrom($("#hashtag-submissions .rightmost .hashtag"),1,{xPercent:100,autoAlpha:0,ease:Elastic.easeOut,delay:.3},.5),a.play()});break;case"hashtag:success":var f=$(".player-static"),g=_.pluck(_.where(b,{submitted:!0}),"username");_.each(g,function(a,b){var c=a.length<=15?a:a.substring(0,15)+"...";$(f[b]).children(".icon").addClass("active"),$(f[b]).children(".nameplate").addClass("active").text(c)});break;case"hashtag:voted":var f=$(".player-static"),g=_.pluck(_.where(b,{voted:!0}),"username");_.each(g,function(a,b){var c=a.length<=15?a:a.substring(0,15)+"...";$(f[b]).children(".icon").addClass("active"),$(f[b]).children(".nameplate").addClass("active").text(c)});break;case"hashtags:results":updateGameContent(b,function(){var a,b,c,d=new TimelineLite({paused:!0,onComplete:function(){showScores()}}),e=$("#hashtag-results .result.fake"),f=$("#hashtag-results .result.real");d.from($("#hashtags"),1.5,{top:-250,autoAlpha:0,ease:Bounce.easeOut}),_.each(e,function(e,f){a=$(e).find(".creator"),b=$(e).find(".creatorWrapper"),c=a.size(),d.from(e,1,{y:0,autoAlpha:0,ease:Bounce.easeOut}).staggerFrom($(e).find(".voter"),2,{scale:0,opacity:1,ease:Elastic.easeOut,onStart:function(){ion.sound.play("button_tiny")}},2,"+=0.5").fromTo(b,1,{scale:0,opacity:0,autoAlpha:0,delay:1},{scale:1,opacity:1,autoAlpha:1},1,"+=2.5"),c>1&&d.add(function(){$(b).cycle(),$(b).cycle("goto",0),$(b).cycle("pause")},1,"+=0.5").add(function(){$(b).cycle("resume")},"-=0.5"),d.staggerTo($(e).find(".voter .nameplate"),.2,{scale:0,autoAlpha:0,display:"none"},.2,"+=0.5").add(function(){$(e).find(".voterWrapper").cycle(),$(e).find(".voterWrapper").cycle("goto",0)},"+=1.0").to(e,1,{delay:3,y:250,autoAlpha:0,display:"none"})}),d.fromTo($(f),1,{delay:.5,y:-250,autoAlpha:0,ease:Bounce.easeOut},{y:0,autoAlpha:1},"real").fromTo($("#hashtag-results #prompt"),.5,{delay:0,y:0,autoAlpha:1,opacity:1,ease:Elastic.easeOut},{y:0,autoAlpha:1,opacity:1},2,"real +=0.5").from($(f).find(".hashtag"),1,{delay:.5,y:100,autoAlpha:0},"real +=1.0").staggerFrom($(f).find(".voter"),3,{delay:0,scale:0,opacity:1,ease:Elastic.easeOut,onStart:function(){ion.sound.play("button_tiny")}},2).staggerTo($(f).find(".voter .portrait"),1,{scale:0,autoAlpha:0,display:"none",ease:Elastic.easeOut},1,"=0").staggerFromTo($(f).find(".voter .points"),.5,{scale:0,opacity:0,display:"block"},{scale:1,opacity:1,display:"block"},.5,"-=0.5").to($("#hashtags"),1,{delay:2,y:-200,autoAlpha:0,display:"none",ease:Elastic.easeIn}),$("#slider-gsap").length&&(hashtagsAnimSlider=new GSAPTLSlider(d,"slider-gsap",{width:600})),d.play()})}};
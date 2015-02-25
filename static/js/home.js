/* global jQuery, rivets, moment */

(function(global, $, rivets, game) {
    'use strict';
    var scope = {
            title: 'Random Fight',
            today: moment().format('DD-MM-YY'),
            armies: []
        },
        app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover');
    scope.submitFile = function(event) {
        var target = event.target,
            form = target.parentNode.parentNode;
        if (target.files.length) {
            if (target.files[0].name.search(/\.js$/) > 0) {
                form.submit();
                return;
            } 
            alert('Not a javascript file');
        }
    };
    scope.loadState = function() {
        // loadState
        if (scope.armies.length < 2) {
            // alert('Random fight not implemented :(');
            global.scope.armies = [
                $($('.army')[0]).data('army'), $($('.army')[0]).data('army')
            ];
            scope.title = scope.armies[0] + ' -vs- ' + scope.armies[0];
        }
        game.initEngine();
        scope.playing = true;
    };
    scope.selectArmyToBattle = function(e) {
        e.preventDefault();
        var target = e.currentTarget;
        scope.armies.push($(target).attr('data-army'));
        if (scope.armies.length === 3) {
            scope.armies.shift();
        }
        if (scope.armies.length === 2) {
            scope.title = scope.armies[0] + ' -vs- ' + scope.armies[1];
        }
    };
    rivets.binders['play-game'] = function(el, value) {
        if (value) {
            cover.fadeOut(function() {
                stage.animate({height: '600px'}, 300);
                $('html, body').animate({
                    scrollTop: stage.offset().top
                }, 700);
            });
        }
        else {
            stage.animate({height: '300px'}, 300, function() {
                cover.fadeIn(function() {
                    //clearStage();
                });
            });
        }
    };
    rivets.bind(app, scope);

    setTimeout(function() {
        stage.css({'height': '300px'});
        stage.slideDown('slow');
    }, 300);

    global.scope = scope;
}(window, jQuery, rivets, window.game));
/* global _, alert, jQuery, rivets, moment, localStorage */

(function(global, $, rivets, engine) {
    'use strict';
    var app = $('#home'),
        stage = app.find('#cr-stage'),
        cover = stage.find('#frontCover'),
        domArmies = $('#armies li'),
        armyColors = ['blue', 'red'],
        myArmy = localStorage.getItem('myArmy'),
        scope, inPause = false, gameUrl;

    function initApp() {
        if (myArmy) {
            var li = $('#armies li[data-army-id=' + myArmy + ']');
            li.find('a')
                    .addClass('active ' + armyColors[0]);
            li.prependTo('#armies');
        }
        setTimeout(function() {
            stage.css({'height': '300px'});
            stage.slideDown('slow');
        }, 300);

        // If current location points to a battle, lets load it!
        if (window.location.pathname.match(/^\/battle\/[a-z0-9]+\/?$/)) {
            gameUrl = window.location.pathname;
            scope.playing = true;
        }
    }
    function initRivets() {
        rivets.binders['play-game'] = function(el, playing) {
            if (playing) {
                cover.fadeOut(function() {
                    stage.animate({height: '600px'}, 300);
                    $('html, body').animate({
                        scrollTop: stage.offset().top
                    }, 700);
                    if (scope.selectedArmies.length < 2) {
                        scope.selectedArmies = _.sample(scope.armies, 2);
                    }
                    engine.init(gameUrl || '/play/' + scope.selectedArmies[0].id + '/' + scope.selectedArmies[1].id);
                    gameUrl = null;
                });
            }
            else {
                engine.stop();
                scope.result = {};
                scope.gameSpeed = 500;
                scope.selectedArmies = myArmy ? [{id: myArmy, name: myArmy}] : [];
                stage.animate({height: '300px'}, 300, function() {
                    cover.fadeIn(function() {
                    });
                });
            }
        };
        rivets.bind(app, scope);
    }
    scope = {
        view: (function() {
            if (location.pathname === '/') {
                return 'home';
            }
            else if (location.pathname.search('battle') === 1) {
                return 'battle';
            }
        }()),
        locationOrigin: location.origin,
        gameSpeed: 500,
        today: moment().format('DD-MM-YY'),
        selectedArmies: myArmy ? [{id: myArmy, name: myArmy}] : [],

        armies: domArmies.map(function(i,el) {
            return {
                id: el.getAttribute('data-army-id'),
                name: el.getAttribute('data-army-name')
            };
        }),
        result: {},
        player: {
            play: function() {
                scope.gameSpeed = 500;
                if (inPause) {
                    global.nextTurn();
                    inPause = false;
                }
            },
            stop: function() {
                scope.playing = false;
            },
            forward: function() {
                scope.gameSpeed = 100;
                if (inPause) {
                    global.nextTurn();
                    inPause = false;
                }
            },
            pause: function() {
                scope.gameSpeed = 0;
                inPause = true;
            },
            stepForward: function(e) {
                if (!inPause) return;
                global.nextTurn();
                // blink animation
                var t = $(e.target);
                t.addClass('active');
                setTimeout(function() {
                    t.removeClass('active');
                }, 100);
            }
        },
        playGame: function() {
            scope.playing = true;
        },
        debugStep: function(e) {
            if (e.which === 32 && scope.gameSpeed === 0) {
                e.preventDefault();
                global.nextTurn();
            }
        },
        advanceTo: function(e) {
            var values = scope.gameProgress.match(/\d+/g),
                selectedState = Math.round(e.offsetX*values[1]/440);
            engine.goToState(selectedState);

        },
        submitFile: function(event) {
            var target = event.target,
                form = target.parentNode.parentNode;
            if (target.files.length) {
                if (target.files[0].name.search(/\.js$/) > 0) {
                    localStorage.setItem('myArmy', target.files[0]
                                         .name.replace(/\.js$/, ''));
                    form.submit();
                    return;
                }
                alert('Not a javascript file');
            }
        },
        selectArmyToBattle: function(e) {
            var target = e.currentTarget.parentNode,
                armies = scope.selectedArmies;
            e.preventDefault();
            armies.push({
                id: $(target).data('army-id'),
                name: $(target).data('army-name')
            });
            if (armies.length === 3) {
                armies.shift();
            }
            domArmies.each(function(i, el) {
                $(el).find('a').removeClass('active red blue');
            });
            armies.forEach(function(army, i) {
                $('#armies li[data-army-name="' + army.name + '"] a')
                    .addClass('active ' + armyColors[i]);
            });
        }
    };
    global.scope = scope;
    initRivets();
    initApp();
}(window, jQuery, rivets, window.engine));

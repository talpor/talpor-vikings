/* global module */
/* exported Unit, Minon */

var config = require('./config'),
    uuid = require('node-uuid'),
    _ = require('lodash');

function Unit(player, hp, x, y) {
    if (!(typeof x === 'number' && typeof y === 'number' &&
        x < config.worldSize && y < config.worldSize &&
        x >= 0 && y >= 0)) {
        throw new Error('You must specify a valid location');
    }
    this.player = player;
    this.id = uuid.v4();
    this.x = x;
    this.y = y;
    this.hp = hp;
}

Unit.prototype.getStats = function() {
    return {
        x: this.x,
        y: this.y,
        hp: this.hp
    };
};

function Minion(player, x, y) {
    Unit.call(this, player, config.minon.hp, x, y);
    this.range = config.minon.range;
    this.attack = config.minon.attack;
}
Minion.prototype = Object.create(Unit.prototype);
Minion.prototype.constructor = Minion;

Minion.prototype.getStats = function () {
    var self = this;
    return _.extend(Unit.prototype.getStats.call(this), {
        range: self.range,
        attack: self.attack
    });
};

function Tower(player, x, y) {
    Unit.call(this, player, config.tower.hp, x, y);
    this.range = config.tower.range;
    this.attack = config.tower.attack;
}
Tower.prototype = Object.create(Unit.prototype);
Tower.prototype.constructor = Unit;

Tower.prototype.getStats = function () {
    var self = this;
    return _.extend(Unit.prototype.getStats.call(this), {
        range: self.range,
        attack: self.attack
    });
};


module.exports = {
    Minion: Minion,
    Tower: Tower
};

'use strict';

const levelToCPM = require('../data/levelToCPM.json');
const pokemon = require('../data/pokemon.json');
const moves = require('../data/moves.json');
const types = require('../data/types.json');

function getPower(move) {
    return moves[move]["power"];
}

function getBaseStat(name, stat) {
    return pokemon[name]["stats"][stat];
}

function getCPM(level) {
    return CONSTANTS.roundTo(levelToCPM[level.toString()], 3);
}

function getSTAB(move, attacker) {
    var type = moves[move]["type"];
    if (pokemon[attacker]["types"].indexOf(type) >= 0) {
        return 1.2;
    }
    return 1.0;
}

function getEffectiveness(move, defender) {
    var moveInfo = moves[move];
    var moveType = moveInfo["type"];
    var defenderInfo = pokemon[defender];
    var defenderTypes = defenderInfo["types"];
    var multiplier = 1.0;
    for (var i=0; i<defenderTypes.length; i++) {
        var defenderType = defenderTypes[i];
        // check if it's super effective
        if (types[moveType]["se"].indexOf(defenderType) >= 0) {
            multiplier *= 1.4;
        }
        // check if it's not very effective
        else if (types[moveType]["nve"].indexOf(defenderType) >= 0) {
            multiplier *= 0.714;
        }
        // check if defender is "immune"
        else if (types[moveType]["immune"].indexOf(defenderType) >= 0) {
            multiplier *= 0.714 * 0.714;
        }
    }
    return multiplier;
}

// TODO: switch attackIV and move, makes more sense
exports.calcDamage = function(attacker, attackerLevel, move, attackIV, defender, defenderLevel, defenseIV) {
    attacker = attacker.toUpperCase();
    move = move.toUpperCase();
    defender = defender.toUpperCase();
    attackIV = Number.parseInt(attackIV);
    attackerLevel = Number.parseInt(attackerLevel);
    defenseIV = Number.parseInt(defenseIV);
    defenderLevel = Number.parseInt(defenderLevel);
    var power = getPower(move);
    var attack = getBaseStat(attacker, "attack");
    var attackerCPM = getCPM(attackerLevel);
    var defense = getBaseStat(defender, "defense");
    var defenderCPM = getCPM(defenderLevel);
    var STAB = getSTAB(move, attacker);
    var effectiveness = getEffectiveness(move, defender);
    return Math.floor(0.5 * power * ((attack+attackIV) * attackerCPM) / ((defense+defenseIV) * defenderCPM) * STAB * effectiveness) + 1;
}

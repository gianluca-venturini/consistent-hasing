const _ = require('lodash');
const crypto = require('crypto');

// https://www.toptal.com/big-data/consistent-hashing

function hash(str) {
    const hexHash = crypto.createHash('sha256').update(str).digest('hex');
    return parseInt(hexHash.slice(0, 8), 16);
}

function toDegree(n) {
    const result = n / Math.pow(2, 32) * 360;
    if (result === 360) {
        return 0
    }
    return result;
}

function computeValueToServer(value, serverPositions) {
    const valDegree = toDegree(Math.abs(hash(`${value}`)));
    return closestServerId(valDegree, serverPositions);
}

/** Closest in counterclockwise */
function closestServerId(valDegree, serverPositions) {
    let closest = serverPositions[0];
    let distance = Number.POSITIVE_INFINITY;

    let isGreaterThanAnyServer = true;
    let isLowerThanAnyServer = true;

    let minServerPosition = serverPositions[0];
    let maxServerPosition = serverPositions[0];

    for (const serverPosition of serverPositions) {
        if (serverPosition.deg > valDegree) {
            isGreaterThanAnyServer = false;
        }
        if (serverPosition.deg < valDegree) {
            isLowerThanAnyServer = false;
        }

        const newDistance = calculateDistance(serverPosition, valDegree);
        if (newDistance < distance) {
            closest = serverPosition;
            distance = newDistance;
        }

        if (serverPosition.deg < minServerPosition.deg) {
            minServerPosition = serverPosition;
        }

        if (serverPosition.deg > maxServerPosition.deg) {
            maxServerPosition = serverPosition;
        }
    }

    if (isGreaterThanAnyServer || isLowerThanAnyServer) {
        return maxServerPosition.serverId;
    }

    return closest.serverId;
}

function calculateDistance(closest, valDegree) {
    let distance = valDegree - closest.deg;
    if (distance < 0) {
        return Number.POSITIVE_INFINITY;
    }
    return distance;
}

const SERVER_POINTS = 1000;

function assignValuesToServer(values, numServers) {
    const serverPositions = [];
    for (const serverId of _.range(numServers)) {
        for (const pointId of _.range(SERVER_POINTS)) {
            const serverPointId = `${serverId}:${pointId}`;
            serverPositions.push({
                deg: toDegree(Math.abs(hash(serverPointId))),
                serverId
            });
        }
    }

    return values.map((v) => computeValueToServer(v, serverPositions));
}

module.exports = {
    hash,
    toDegree,
    closestServerId,
    assignValuesToServer
};

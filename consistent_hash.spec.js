const _ = require('lodash');
const { hash, toDegree, closestServerId } = require("./consistent_hash");

describe('hash', () => {

    it('produces an integer result', () => {
        const result = hash('test');
        _.isInteger(result);
    });

});

describe('toDegree', () => {

    it('converts 32 bits in degrees', () => {
        expect(toDegree(0)).toBe(0);
        expect(toDegree(Math.pow(2, 31) - 1)).toBeLessThan(180);
        expect(toDegree(Math.pow(2, 31) + 1)).toBeGreaterThan(180);

        expect(toDegree(Math.pow(2, 32) - 1)).toBeGreaterThan(270);
        expect(toDegree(Math.pow(2, 32) - 1)).toBeLessThan(360);
    });

    it('converts max 2**32 to 0', () => {
        expect(toDegree(Math.pow(2, 32))).toBe(0);
    });

});

describe('closestPointId', () => {

    it('find the closest server for a key in the middle', () => {
        const serverPositions = [
            { deg: 10, serverId: 0 },
            { deg: 20, serverId: 1 },
        ];
        expect(closestServerId(15, serverPositions)).toBe(0);
        expect(closestServerId(19.9999, serverPositions)).toBe(0);
        expect(closestServerId(10.0001, serverPositions)).toBe(0);
    });

    it('find the correct server for keys in the middle with 3 servers', () => {
        const serverPositions = [
            { deg: 10, serverId: 0 },
            { deg: 20, serverId: 1 },
            { deg: 30, serverId: 2 },
        ];
        expect(closestServerId(15, serverPositions)).toBe(0);
        expect(closestServerId(25, serverPositions)).toBe(1);
    });

    it('find the correct server for a key above the max server', () => {
        const serverPositions = [
            { deg: 10, serverId: 0 },
            { deg: 20, serverId: 1 },
        ];
        expect(closestServerId(30, serverPositions)).toBe(1);
    });

    it('find the correct server for a key below the min server', () => {
        const serverPositions = [
            { deg: 10, serverId: 0 },
            { deg: 20, serverId: 1 },
        ];
        expect(closestServerId(5, serverPositions)).toBe(1);
    });

});

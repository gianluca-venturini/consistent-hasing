const { assignKeysToServer } = require('./consistent_hash');
const _ = require('lodash');

const NUM_KEYS = 10000;
const keys = _.range(NUM_KEYS);

const beforeNumServers = 4;
const afterNumServer = beforeNumServers + 1;

const assignmentBefore = assignKeysToServer(keys, beforeNumServers);
const assignmentAfter = assignKeysToServer(keys, afterNumServer);

function calculateKey(from, to) {
    return `${from} -> ${to}`;
}

const assignmentChange = {};

for (let i = 0; i < keys.length; i += 1) {
    if (assignmentBefore[i] === assignmentAfter[i]) {
        // we're not interested in the case in which the server doesn't change
        continue;
    }
    key = calculateKey(assignmentBefore[i], assignmentAfter[i]);
    assignmentChange[key] = (assignmentChange[key] || 0) + 1;
}

const pairs = _.orderBy(_.toPairs(assignmentChange), p => p[0]);

console.log(pairs);
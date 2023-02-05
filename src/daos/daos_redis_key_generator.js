const config = require('better-config');
config.set('../../config.json');

// Prefix all keys
let prefix = config.get('dataStores.redis.keyPrefix');

const getKey = key => `${prefix}:${key}`;
const getTSKey = (id, unit) => getKey(`ts:${id}:${unit}`);

module.exports = {
    getTSKey,
};
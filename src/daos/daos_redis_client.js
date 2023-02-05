const redis = require('redis');
const bluebird = require('bluebird');
const config = require('better-config');

redis.addCommand('ts.add');
redis.addCommand('ts.range');
redis.addCommand('ts.get');

bluebird.promisifyAll(redis);

const redisClientConfig = {
    port: config.get('dataStores.redis.port'),
    host: config.get('dataStores.redis.host')
};

if (config.get('dataStores.redis.password')){
    redisClientConfig.password = config.get('dataStores.redis.password')
};

const client = redis.createClient(redisClientConfig);

client.on('connect', () => console.log("Connected"));
client.on('error', () => console.log("Error"));

module.exports = {
    getClient: () => client,
};
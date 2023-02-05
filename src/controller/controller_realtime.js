const {validationResult} = require('express-validator');
const tsRedisDaos = require('../daos/daos_redis_ts.js');
const redis = require('../daos/daos_redis_client.js');
const keyGenerator = require('../daos/daos_redis_key_generator.js');
const helper = require('../helpers/arrayToObject');

const recentKeys = [];
const adUnitasTS = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(404).json({errors: errors.array()});
        };
        console.log(errors.array());

        recentKeys.splice(deleteCount=0);

        // console.log(req.body);
        for (const body of req.body){
            recentKeys.push(keyGenerator.getTSKey(body.id, Object.keys(body)[2]));
            recentKeys.push(keyGenerator.getTSKey(body.id, Object.keys(body)[3]));
        };
        await tsRedisDaos.insert(req.body);
        res.status(201).send(req.body);
    } catch (err) {
        res.json(err);
    }
};


const getTSKey = async (req, res) => {
    try{
        const collections = [];
        const tempCollection = [];
        const humidityCollection = [];
        const client = redis.getClient();
        client.keys('*', async (err, keys) => {
            for (const key of keys){
                for (const recentKey of recentKeys){
                    if (key === recentKey) {
                        // console.log(key);
                        // console.log(recentKey);
                        await tsRedisDaos.getTsData(key);
                        const data = await tsRedisDaos.getTsData(key);
                        collections.push(data);

                        if (recentKey === "IoT:ts:3:temperature") {
                            collections.forEach(collection => {
                                collection.forEach(element => {
                                    if (element[1] >= 50 && element[1] <= 100){
                                        humidityCollection.push(element);
                                    } else if (element[1] >= 0 && element[1] <= 50){
                                        tempCollection.push(element);
                                    }
                                });
                            });
                        };
                    };
                };
            };
            const tempObj = helper.flatArray(tempCollection, "temperature");
            // console.log(tempObj);
            const humidityObj = helper.flatArray(humidityCollection, "humidity");
            res.render('../views/graph', {tempObj, humidityObj});
        });
    } catch(e){
        res.json(e);
    }
};


module.exports = {
    adUnitasTS,
    getTSKey,
}
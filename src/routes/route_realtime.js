const router = require('express').Router();
const {body} = require('express-validator');
const controller = require('../controller/controller_realtime.js');

router.post(
    '/realtime',
    [
        body().isArray(),
        body('*.id').isInt(),
        body('*.dateTime').isInt({ min: 0 }),
        body('*.humidity').isFloat({max: 100}),
        body('*.temperature').isFloat(),
    ],
    controller.adUnitasTS
);

router.get(
    '/realtime',
    controller.getTSKey
);

module.exports = router;
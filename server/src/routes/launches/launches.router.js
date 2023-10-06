const express = require('express');
const {
    getLaunches,
    addLaunch,
    abortLaunch,
} = require('./launches.controller');

const launchRouter = express.Router();

launchRouter.get('/', getLaunches);
launchRouter.post('/', addLaunch);
launchRouter.delete('/:id', abortLaunch);

module.exports = launchRouter;
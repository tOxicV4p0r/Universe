const express = require('express');
const { getLaunches } = require('./launches.controller');

const launchRouter = express.Router();

launchRouter.get('/launches', getLaunches);

module.exports = launchRouter;
const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
const SPACCEX_API_URL = 'https://api.spacexdata.com/v4';

const launch = {
    // flightNumber: 100,               // flight_number
    mission: 'Kepler Exploration X',    // name
    rocket: 'Explorer IS1',             // rocket.name
    launchDate: new Date('December 27, 2030'),  // date_local
    // destination: 'Kepler-442 b',        // 
    target: 'Kepler-442 b',             // not applicable
    customers: ['BTC', 'NASA'],         // payload[0].customer[..]
    upcoming: true,                     // upcoming
    success: true,                      // success
};

// launches.set(launch.flightNumber, launch);
// addNewLaunch(launch);

async function findLaunch(filter) {
    return await launches.findOne(filter);
}

async function existLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function getAllLaunches(skip, limit) {
    return await launches
        .find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function getLastestFlightNumber() {
    const latestLaunch = await launches
        .findOne({})
        .sort('-flightNumber') // decending

    if (!latestLaunch)
        return DEFAULT_FLIGHT_NUMBER;

    return latestLaunch.flightNumber;
}

async function addNewLaunch(launch) {
    try {
        await launches.updateOne({
            flightNumber: launch.flightNumber,
        }, {
            ...launch,
        }, {
            upsert: true
        });
    } catch (err) {
        console.error(err);
    }
}

async function scheduleNewLaunch(launch) {
    if (!(await planets.findOne({ keplerName: launch.target }))) {
        throw new Error('not found planet');
    }

    const number = await getLastestFlightNumber() + 1;
    await addNewLaunch({
        ...launch,
        success: true,
        upcoming: true,
        customers: ['blackboy', 'NASA'],
        flightNumber: number,
    });
}

async function abortLaunchById(launchId) {
    // const aborted = launches.get(launchId);
    const aborted = await launches.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false, success: false
    });
    // aborted.upcoming = false;
    // aborted.success = false;

    return aborted.modifiedCount === 1 && aborted.acknowledged;
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    });

    if (firstLaunch) {
        console.log('SpaceX launch data already loaded')
        return;
    }

    await populateLaunchData();
}

async function populateLaunchData() {
    console.log('Downloading launch data from SpaceX');
    const res = await axios.post(`${SPACCEX_API_URL}/launches/query`, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: { "name": 1 }
                },
                {
                    path: "payloads",
                    select: { "customers": 1 }
                }
            ]
        }
    });

    if (res.status !== 200) {
        console.log('Problem downloading data');
        throw new Error('Download data failed');
    }

    /*
    flightNumber -> flight_number
    mission -> name
    rocket -> rocket.name
    launchDate -> date_local
    target -> not applicable
    customers -> payload[0].customer[..]
    upcoming -> upcoming
    success -> success
    */

    const launchDocs = res.data.docs;
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap(payload => payload.customers);

        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,        // launchDoc['name']
            rocket: launchDoc.rocket.name,  // launchDoc['rocket']['name']
            launchDate: new Date(launchDoc.date_local),
            target: '',
            customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success,
        }
        console.log(launchDoc.flight_number, launch.mission, launch.customers);
        await addNewLaunch(launch);
    }
}

module.exports = {
    // launches,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    loadLaunchData,
}
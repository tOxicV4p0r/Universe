const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();

// let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    // flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'Kepler-442 b',
    target: 'Kepler-442 b',
    customers: ['BTC', 'NASA'],
    upcoming: true,
    success: true,
};

// launches.set(launch.flightNumber, launch);
// addNewLaunch(launch);

async function existLaunchWithId(launchId) {
    return await launches.findOne({ flightNumber: launchId });
}

async function getAllLaunches() {
    return await launches.find({}, { '_id': 0, '__v': 0 });
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
    if (!(await planets.findOne({ keplerName: launch.target }))) {
        throw new Error('not found planet');
    }

    try {
        const number = await getLastestFlightNumber() + 1;
        await launches.updateOne({
            flightNumber: number,
        }, {
            ...launch,
            success: true,
            upcoming: true,
            customers: ['blackboy', 'NASA'],
            flightNumber: number,
        }, {
            upsert: true
        });
    } catch (err) {
        console.error(err);
    }
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

module.exports = {
    // launches,
    existLaunchWithId,
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
}
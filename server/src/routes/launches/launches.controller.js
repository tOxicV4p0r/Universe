const {
    // launches,
    getAllLaunches,
    addNewLaunch,
    existLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

async function getLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function addLaunch(req, res) {

    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property'
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        // isNaN -> not number
        // launch.launchDate.toString() === 'Invalid Date'
        return res.status(400).json({
            error: 'Invalid launch date'
        });
    }

    try {
        await addNewLaunch(launch);
        return res.status(201).json(launch);
    } catch (err) {
        return res.status(400).json({ error: err });
    }
}

async function abortLaunch(req, res) {
    console.log(req.params);
    const launchId = req.params.id * 1;

    // doesn't exist
    if (!(await existLaunchWithId(launchId))) {
        return res.status(404).json({ error: 'Launch not found' });
    }

    // exist
    const aborted = await abortLaunchById(launchId);

    if (!aborted)
        return res.status(400).json({ error: 'Launch can not abort' });

    return res.status(200).json(aborted);
}

module.exports = {
    getLaunches,
    addLaunch,
    abortLaunch,
}
const { parse } = require('csv-parse');
const fs = require('fs');
const planets = require('./planets.mongo')

// const planets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

function loadPlanetData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream('./data/kepler.csv')
            .pipe(parse({
                comment: '#',
                columns: true,
            }))
            .on('data', async (data) => {
                // console.log(data);
                if (isHabitablePlanet(data)) {
                    // planets.push({ ...data, keplerName: data.kepler_name });
                    await savePlanet(data);
                }
            })
            .on('end', async () => {
                const countPlanet = (await getAllPlanets()).length;
                console.log('planet that like earth :', countPlanet);
                // console.log('end');
                resolve();
            })

    });
}

async function getAllPlanets() {
    return await planets.find({}, { '_id': 0, '__v': 0 });
}

async function savePlanet(planet) {
    console.log(planet.kepler_name);
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        }, {
            keplerName: planet.kepler_name,
        }, {
            upsert: true,
        });
    } catch (err) {
        console.error('Could not save planet');
        console.error(err);
    }
}

module.exports = {
    // planets,
    loadPlanetData,
    getAllPlanets,
};
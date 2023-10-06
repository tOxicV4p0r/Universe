const { parse } = require('csv-parse');
const fs = require('fs');

const planets = [];

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
            .on('data', (data) => {
                // console.log(data);
                if (isHabitablePlanet(data))
                    planets.push(data);
            })
            .on('end', () => {
                console.log('planet that like earth :', planets.length);
                // console.log('end');
                resolve();
            })

    });
}

module.exports = {
    planets,
    loadPlanetData,
};
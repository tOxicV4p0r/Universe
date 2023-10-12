// const cluster = require('cluster');
const http = require('http');
require('dotenv').config();
const { mongoConnect } = require('./services/mongo');

const { loadPlanetData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT*1 || 5000;

async function startServer() {
    await mongoConnect();

    const app = require('./app');
    const server = http.createServer(app);

    await loadPlanetData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log('Server running on port :', PORT);
    });
}

// console.log('start server as :', cluster.isMaster ? 'master' : 'worker');
/*
if (cluster.isMaster) {
    startServer();
    console.log('master running')
    cluster.fork();
} else {
    console.log('worker is running');
}
*/

startServer();
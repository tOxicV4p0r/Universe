const cluster = require('cluster');
const http = require('http');
const app = require('./app');

const { loadPlanetData } = require('./models/planets.model');
const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

async function startServer() {
    await loadPlanetData();
    server.listen(PORT, () => {
        console.log('Server running on port :', PORT);
    })
}

console.log('start server as :', cluster.isMaster ? 'master' : 'worker');
if (cluster.isMaster) {
    startServer();
    console.log('master running')
    cluster.fork();
} else {
    console.log('worker is running');
}
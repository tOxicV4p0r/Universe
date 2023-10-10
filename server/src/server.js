// const cluster = require('cluster');
const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const { loadPlanetData } = require('./models/planets.model');
const PORT = process.env.PORT || 4000;
const MONGO_URL = 'mongodb+srv://nasa-api:lHtAIItkMdUEl8xH@cluster0.vuw0lgm.mongodb.net/nasa?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open', () => {
    console.log('connected MongoDB!!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await loadPlanetData();

    await mongoose.connect(MONGO_URL);

    server.listen(PORT, () => {
        console.log('Server running on port :', PORT);
    })
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
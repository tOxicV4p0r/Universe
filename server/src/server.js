// const cluster = require('cluster');
const http = require('http');
const mongoose = require('mongoose');

const { loadPlanetData } = require('./models/planets.model');
const PORT = process.env.PORT || 4000;
const MONGO_URL = 'mongodb+srv://nasa-api:lHtAIItkMdUEl8xH@cluster0.vuw0lgm.mongodb.net/nasa?retryWrites=true&w=majority'



mongoose.connection.once('open', () => {
    console.log('connected MongoDB!!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function startServer() {
    await mongoose.connect(MONGO_URL);
    
    const app = require('./app');
    const server = http.createServer(app);

    await loadPlanetData();

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
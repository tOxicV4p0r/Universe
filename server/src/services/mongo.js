const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:lHtAIItkMdUEl8xH@cluster0.vuw0lgm.mongodb.net/nasa?retryWrites=true&w=majority'

mongoose.connection.once('open', () => {
    console.log('connected MongoDB!!');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisConnect() {
    await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisConnect }
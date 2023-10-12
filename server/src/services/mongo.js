const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGOURL;

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
const axios = require('axios');
const mqtt = require('mqtt');

const Client = mqtt.connect('mqtt://localhost:1883');

Client.on('connect', () => {
    console.log("connected")
    Client.subscribe('userLogs');
    Client.subscribe('gameLogs');
});
Client.on('message', async (topic, message) => {

    await axios.post("http://localhost:5000/logs", {
        content: `${topic}: ${message}`
    })
});

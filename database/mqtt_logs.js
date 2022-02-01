const axios = require('axios');
const mqtt = require('mqtt');

const Client = mqtt.connect('mqtt://localhost:1883');
const fun_facts = require('./../fontend/src/ducks/resources.json').fun_facts;

Client.on('connect', () => {
    console.log("connected")
    Client.subscribe('userLogs');
    Client.subscribe('gameLogs');
    Client.subscribe('chat');
    setInterval(() => {
        let randomId = Math.floor(Math.random() * fun_facts.length);
        Client.publish('funFacts', fun_facts[randomId])
    }, 60000)
});
Client.on('message', async (topic, message) => {

    await axios.post("http://localhost:5000/logs", {
        content: `${topic}: ${message}`
    })
});

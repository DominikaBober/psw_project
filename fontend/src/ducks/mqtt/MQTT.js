import mqtt from 'mqtt/dist/mqtt';

const Client = mqtt.connect('mqtt://localhost:8000/mqtt');

export const MQTT = () => {
    Client.on('connect', () => {
        console.log('mqtt conneced');
        Client.subscribe('rules');
        Client.subscribe('userLogs');
        Client.subscribe('gameLogs');
        Client.subscribe('chat');
        Client.subscribe('funFacts')
    });
};

export default Client;
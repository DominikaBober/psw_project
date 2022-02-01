import mqtt from 'mqtt/dist/mqtt';

const Client = mqtt.connect('mqtt://localhost:8000/mqtt');

export const MQTT = () => {
    Client.on('connect', () => {
        Client.subscribe('rules');
        Client.subscribe('useLogs');
        Client.subscribe('gameLogs');
        Client.subscribe('chat');
        Client.subscribe('funFacts')
        console.log('mqtt conneced');
    });
};

export default Client;
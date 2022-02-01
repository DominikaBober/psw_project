import axios from "axios";
import Client from "../mqtt/MQTT";

export const check_if_exists = async (login) => {
    return await axios.get(`http://localhost:5000/players/login/${login}`)
        .then((response) => {
            if (response.status === 200){return response}
        }).catch((error)=>{
            console.log(error);
            return {status: 500}
        });
}

export const get_game = async (id) => {
    return await axios.get(`http://localhost:5000/games/${id}`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const get_player_games = async (player_id) => {
    return await axios.get(`http://localhost:5000/games/saves/${player_id}`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const get_games = async () => {
    return await axios.get(`http://localhost:5000/games`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const save_game = async (values) => {
    return await axios.post(`http://localhost:5000/games`, values)
        .then((response) => {
            if (Client.connected){Client.publish("gameLogs", `game ${response.data.id} created`)}
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const update_game = async (values, id) => {
    return await axios.put(`http://localhost:5000/games/${id}`, values)
        .then((response) => {
            if (Client.connected){Client.publish("gameLogs", `game ${id} created`)}
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const finish_game = async (id, play_time) => {
    return await axios.patch(`http://localhost:5000/games/${id}/finish`, {play_time: play_time})
        .then((response) => {
            if (Client.connected){Client.publish("gameLogs", `game ${id} finished`)}
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const delete_game = async (id) => {
    return await axios.delete(`http://localhost:5000/games/${id}`)
        .then((response) => {
            if (Client.connected){Client.publish("gameLogs", `game ${id} deleted`)}
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}
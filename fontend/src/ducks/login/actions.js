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

export const check_if_good_password = async (values) => {
    return await axios.post(`http://localhost:5000/players/login`, values)
        .then((response) => {
            if (response.status === 200){
                if (Client.connected){Client.publish("userLogs", `user ${values.login} logged in`)}
                return response
            }
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const create_user = async (values) => {
    const playertoCreate = {
        login: values.login,
        password: values.password,
        login_date: new Date(),
        role: "player"
    }
    return await axios.post(`http://localhost:5000/players`, playertoCreate)
        .then((response) => {
            if (Client.connected){Client.publish("userLogs", `user ${values.login} registered`)}
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const get_players = async () => {
    return await axios.get(`http://localhost:5000/players`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const get_player = async (id) => {
    return await axios.get(`http://localhost:5000/players/${id}`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

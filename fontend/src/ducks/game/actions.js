import axios from "axios";

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
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const finish_game = async (id) => {
    return await axios.patch(`http://localhost:5000/games/${id}/finish`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}

export const delete_game = async (id) => {
    return await axios.delete(`http://localhost:5000/games/${id}`)
        .then((response) => {
            return response;
        }).catch((error)=>{
            console.log(error);
            return {status: 500};
        });
}
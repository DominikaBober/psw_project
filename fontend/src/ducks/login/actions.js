import axios from "axios";

export const check_if_exists = async (login) => {
    return  await axios.get(`http://localhost:5000/players/login/${login}`);
}

export const check_if_good_password = async (values) => {
    return await axios.post(`http://localhost:5000/players/login`, values);
}

export const create_user = async (values) => {
    const playertoCreate = {
        login: values.login,
        password: values.password,
        login_date: new Date(),
        role: "player"
    }
    return await axios.post(`http://localhost:5000/players`, playertoCreate);
}

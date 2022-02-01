import Cookies from 'js-cookie';
import { useState } from 'react';

import Client from '../ducks/mqtt/MQTT';

export default function Home(){

    const [funFact, setFunFact] = useState("")
    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)})

    if (Client.connected){
        Client.on("message", (topic, message) => {
            if (topic === "funFacts"){setFunFact(message.toString())}
        })
    }

    return(
        <div className="Home" id="content">
            <div className="nag">Hello {player.login}!</div>
            <div>Did you know??</div>
            <div>{funFact}</div>
        </div>
    )
}
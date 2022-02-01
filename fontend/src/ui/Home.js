import Cookies from 'js-cookie';
import { useState } from 'react';

import Client from '../ducks/mqtt/MQTT';

const fun_facts = require('./../ducks/resources.json').fun_facts;

export default function Home(){

    const [funFact, setFunFact] = useState(fun_facts[Math.floor(Math.random() * fun_facts.length)])
    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)})

    if (Client.connected){
        Client.on("message", (topic, message) => {
            if (topic === "funFacts"){setFunFact(message.toString())}
        })
    }

    return(
        <div className="Game" id="content">
            <div className="nag">Hello {player.login}!</div>
            <div>Did you know??</div>
            <div>{funFact}</div>
        </div>
    )
}
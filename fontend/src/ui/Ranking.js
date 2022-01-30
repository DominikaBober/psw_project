import './style/Ranking.scss';
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';

import { get_players } from "../ducks/login/actions";

export default function Ranking(){

    const [players, setPlayers] = useState([])

    useEffect(() => { (async () => {
        if (players.length === 0){
        const users = await get_players();
        if (users.status === 200){setPlayers(users.data)}
        }
    })()}, [players])

    return(
        <div className="Ranking" id="content">
            <div className="nag">Top Players</div>
            <div id="col">
                <div id="grid2" className="nag_2">
                    <span id="left">Player</span>
                    {/* <span id="center">Played games</span> */}
                    <span id="right">Score</span>
                </div>
                {players.sort((a, b) => { if(a.score>b.score){return -1}else{return 1}}).map(player => 
                    <Link id="grid2" to={`/player/${player.id}`} key={player.login}>
                        <span id="left">{player.login}</span>
                        {/* <span id="center">{player.played_games}</span> */}
                        <span id="right">{player.score}</span>
                    </Link>
                )}
            </div>
        </div>
    )
}
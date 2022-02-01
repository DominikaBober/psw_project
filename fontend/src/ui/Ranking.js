import './style/Ranking.scss';
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';

import { get_players } from "../ducks/login/actions";
import { get_games } from '../ducks/game/actions';

export default function Ranking(){

    const [players, setPlayers] = useState([])
    const [games, setGames] = useState([])

    useEffect(() => { (async () => {
        const users = await get_players();
        if (users.status === 200){setPlayers(users.data)}
        const all_games = await get_games();
        if (all_games.status === 200){setGames(all_games.data)}
    })()}, [])

    return(
        <div className="Ranking" id="content">
            <div className="nag">Top Players</div>
            <div id="col">
                <div id="grid2" className="nag_2">
                    <span id="left">Player</span>
                    {/* <span id="center">Played games</span> */}
                    <span id="right">Score</span>
                </div>
                {players.sort((a, b) => { if(games.filter(game => game.player_id === a.id)
                                .filter(game => game.finished === true)
                                .map(game => game.score).reduce((a, b) => {return a+b},0)>games.filter(game => game.player_id === b.id)
                                .filter(game => game.finished === true)
                                .map(game => game.score).reduce((a, b) => {return a+b},0)){return -1}else{return 1}}).map(player => 
                    <Link id="grid2" to={`/player/${player.id}`} key={player.login}>
                        <span id="left">{player.login}</span>
                        {/* <span id="center">{player.played_games}</span> */}
                        <span id="right">{games.filter(game => game.player_id === player.id)
                                .filter(game => game.finished === true)
                                .map(game => game.score).reduce((a, b) => {return a+b},0)}</span>
                    </Link>
                )}
            </div>
        </div>
    )
}
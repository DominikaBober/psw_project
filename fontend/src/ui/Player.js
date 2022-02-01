import './style/Player.scss'
import Cookies from 'js-cookie';

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';

import { get_player } from "../ducks/login/actions";
import { get_player_games } from '../ducks/game/actions';

export default function Player(){

    const {id: playerID} = useParams();
    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)});
    const [isPlayerAdmin, setIsPlayerAdmin] = useState(false);
    const [user, setUser] = useState({})
    const [isError, setIsError] = useState(false);
    const [isPlayerUser, setIsPlayerUser] = useState(false);
    const [userGames, setUserGames] = useState([]);
    

    useEffect(() => { (async () => {
        if (!isError){
        const user = await get_player(playerID);
        if (user.status === 200){
            setUser(user.data);
            if (playerID === player.id){setIsPlayerUser(true)};
            const games = await get_player_games(playerID);
            if (games.status === 200){setUserGames(games.data)}
        }
        else{setIsError(true)}
        }
        const admin = await get_player(player.id);
        if (admin.status === 200){if (admin.data.role === "admin"){setIsPlayerAdmin(true)}}
    })()}, [playerID, user])

    console.log("userGames", userGames)

    return(
        <div className="Player" id="content">
            {!isError ? (
                <div>
                <div className="nag">{user.login}</div>
                { userGames.filter(game => game.finished === true).length > 0 ?
                (<div className="col">
                    <div id="row"><div>Score:</div><div>{userGames.filter(game => game.finished === true)
                                                        .map(game => game.score).reduce((a,b) => {return a+b},0)}</div></div>
                    <div id="row"><div>Played games:</div><div>{userGames.filter(game => game.finished === true).length}</div></div>
                    <div id="row"><div>Best time: ?</div>{userGames.filter(game => game.finished === true)
                                                        .sort((a, b) => new Date(a.play_time) - new Date(b.play_time))}</div>
                </div>):(
                    <div>No info</div>
                )}
                {isPlayerUser && (
                    <div className="games" id="col">
                        {userGames.filter(game => game.finished === false).length > 0 && (
                        <div id="col"><div>Active games:</div>
                        <div className="active" id="grid2">
                            {userGames.filter(game => game.finished === false).map(
                                game => 
                                <Link to={`/play/${game.save}`} key={game.save} className="game" id="row">
                                    <div>{game.save}</div>
                                    <div>{game.score}</div>
                                </Link>
                            )}
                        </div></div>)}
                        {userGames.filter(game => game.finished === true).length > 0 && 
                        (<div id="col"><div>Finished games:</div>
                        <div className="unactive" id="grid2">
                            {userGames.filter(game => game.finished === true).map(
                                game => 
                                <div key={game.save} className="game" id="row">
                                    <div>{game.save}</div>
                                    <div>{game.score}</div>
                                </div>
                            )}
                        </div></div>)}
                    </div>
                )}
                </div>
            ):(
                <div className="nag">User does not exists</div>
            )}

        </div>
    )
}
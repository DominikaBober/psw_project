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

    function seconds2time (seconds) {
        var hours   = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var seconds = seconds - (hours * 3600) - (minutes * 60);
        var time = "";
    
        if (hours != 0) {
          time = hours+":";
        }
        if (minutes != 0 || time !== "") {
          minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
          time += minutes+":";
        }
        if (time === "") {
          time = seconds+"s";
        }
        else {
          time += (seconds < 10) ? "0"+seconds : String(seconds);
        }
        return time;
    }
    

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
    })()}, [playerID])

    console.log("userGames", userGames.filter(game => game.finished === true)
    .sort((a, b) => new Date(a.play_time) - new Date(b.play_time)))

    return(
        <div className="Player" id="content">
            {!isError ? (
                <div>
                <div className="nag">{user.login}</div>
                { userGames.filter(game => game.finished === true).length > 0 ?
                (<div id="grid2" className="score">
                    <div id="left">Score:</div><div id="right">{userGames.filter(game => game.finished === true)
                                                        .map(game => game.score).reduce((a,b) => {return a+b},0)}</div>
                    <div id="left">Played games:</div><div id="right">{userGames.filter(game => game.finished === true).length}</div>
                    <div id="left">Best time: </div><div id="right">{
                        seconds2time(Math.floor(userGames.filter(game => game.finished === true)
                        .sort((a, b) => new Date(a.play_time) - new Date(b.play_time))[0].play_time/3600))}</div>
                </div>
                ):(
                    <div>No info</div>
                )}
                { (isPlayerUser || isPlayerAdmin)&& (
                    <div className="games" id="col">
                        {userGames.filter(game => game.finished === false).length > 0 && (
                        <div id="col"><div>Active games:</div>
                        <div className="active" id="grid2">
                            {userGames.filter(game => game.finished === false).map(
                                game => 
                                <Link to={`/play/${game.save}`} key={game.save} className="game" id="grid2">
                                    <div id="left">{game.save}</div>
                                    <div id="right">{game.score}</div>
                                </Link>
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
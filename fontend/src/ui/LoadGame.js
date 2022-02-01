import './style/Game.scss';
import { useParams } from "react-router"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import Popup from './popup';

import { check_results } from '../ducks/game/functions/game';
import { update_game, get_player_games, finish_game } from "../ducks/game/actions";

const all_games_2 = require('./../ducks/game/all_games/all_games_2.json');
const all_games_3 = require('./../ducks/game/all_games/all_games_3.json');
const all_games_4 = require('./../ducks/game/all_games/all_games_4.json');

export default function LoadGame(){

    const {save_name: save_name} = useParams();
    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)});
    const [playerGames, setPlayerGames] = useState([]);
    const [all_games, set_all_games] = useState([]);
    const [yourGame, setYourGame] = useState([]);
    const [gamePlate, setGamePlate] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [isError, setIsError] = useState(true);
    const [popupContext, setPopupContext] = useState("");
    const [all_results, set_all_results] = useState([]);
    
    useEffect(() => {
        (async () => {
                const games = await get_player_games(Cookies.get(`loggedUserId`))
                if (games.status === 200){
                    setPlayerGames(games.data)
                    if (games.data.filter(game => game.save === save_name).length === 0){setIsError(true)}
                    else{
                        const temp_your_game = games.data.filter(game => game.save === save_name)[0];
                        temp_your_game.plate = JSON.parse(temp_your_game.plate)
                        const size = temp_your_game.plate.plate.length
                        const temp_all_games = size === 2 ? all_games_2 : size === 3 ? all_games_3 : all_games_4;
                        setYourGame(temp_your_game);
                        setGamePlate(temp_your_game.plate.plate);
                        set_all_results(check_results(temp_your_game.plate, temp_all_games));
                        set_all_games(temp_all_games);
                        setIsError(false)
                    }
                }
        })()
        Cookies.set(`startGameDate`, new Date().toISOString().slice(0, 19).replace('T', ' '));
    },[])

    const handlePodChange = (i, j) => {
        let temp = gamePlate
        temp[i][j] = (temp[i][j]+1)%(gamePlate.length+1)
        setGamePlate(temp)
        document.getElementById(`pod_${i*gamePlate.length+j+1}`).value= gamePlate[i][j] === 0 ? "" : gamePlate[i][j]; 
    }

    const handleCheck = () => {
        if (all_results.filter(
            result => JSON.stringify(result.plate) === JSON.stringify(gamePlate)
        ).length === 1){
            setIsWrong(false);
            setPopupContext("Congrats, you won !!");
            (async () => {
                await finish_game(yourGame.id, yourGame.play_time + new Date().getTime() - new Date(Cookies.get(`startGameDate`)))
            })()
            setIsOpen(true);
        }else{
            setPopupContext("Sorry, try to change something");
            setIsWrong(true);
        }
    }

    const handleSave = () => {
        (async () => {
            const game_save = {
                start_date: Cookies.get(`startGameDate`),
                play_time: yourGame.play_time + new Date().getTime() - new Date(Cookies.get(`startGameDate`)),
                end_date: yourGame.end_date,
                plate: JSON.stringify({
                    plate: gamePlate,
                    top_text: yourGame.plate.top_text,
                    bottom_text: yourGame.plate.bottom_text,
                    left_text: yourGame.plate.left_text,
                    right_text: yourGame.plate.right_text
                }),
                finished: yourGame.finished,
                score: yourGame.score,
                save: yourGame.save,
                player_id: yourGame.player_id
            };
            console.log("game_save", game_save);
            const response = await update_game(game_save, yourGame.id);
            console.log("response", response)
            if (response.status === 200){
                setPopupContext(`Game saved`);
                setIsOpen(true);
            }
        })()
    }

    console.log("yourGame", yourGame)

    return(
        <>
        {!isError ? (
        <>
        <div className="Game" id="content">
            <div className="top_text" id="row">
                {yourGame.plate.top_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            <div id="row">
            <div className="left_text" id="col">
                {yourGame.plate.left_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            <div className="plate">
                {gamePlate.map((row, i) => 
                    <div id="row">
                    {row.map((el, j) => 
                        <input className="clikcpod" onClick={() => handlePodChange(i, j)} 
                            type="button" value={el ===0 ? "" : el} id={`pod_${i*gamePlate.length+j+1}`} />
                    )}
                    </div>
                )}
            </div>
            <div className="right_text" id="col">
                {yourGame.plate.right_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            </div>
            <div className="bottom_text" id="row">
                {yourGame.plate.bottom_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            {isWrong && (
                <span className="sorry">{popupContext}</span>
            )}
            <div className="buttons" id="row">
            <button onClick={() => handleCheck()}>
                Check
            </button>
            <div className="field">{save_name}</div>
            <button onClick={() => handleSave()}>
                Save
            </button>
            </div>
        </div>
        {isOpen && <Popup
            content={popupContext}
            handleClose={() => {setIsOpen(false)}}
        />}
        </>
        ):(
            <div className="sorry">No game under that name</div>
        )}
        </>
    )
}
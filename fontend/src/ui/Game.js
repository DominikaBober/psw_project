import './style/Game.scss';

import { useEffect, useState } from 'react';

import { check_results } from '../ducks/game/functions/game';

import Popup from './popup';
import { useParams } from 'react-router';

const all_games_2 = require('./../ducks/game/all_games/all_games_2.json');
const all_games_3 = require('./../ducks/game/all_games/all_games_3.json');
const all_games_4 = require('./../ducks/game/all_games/all_games_4.json');

export default function Game(props) {

    const sizes = [2, 3, 4]
    const [size, setSize] = useState(3);
    const [buttonClasses, setButtonClasses] = useState(["unchecked", "checked", "unchecked"]);
    const [all_games, set_all_games] = useState(parseInt(size) === 2 ? all_games_2 : parseInt(size) === 3 ? all_games_3 : all_games_4);
    const [yourGame, setYourGame] = useState(all_games[Object.keys(all_games)[Math.floor(Math.random()*Object.keys(all_games).length)]]);
    const [gamePlate, setGamePlate] = useState(yourGame.plate.map(row => row.map(el => 0)));
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [all_results, set_all_results] = useState(check_results(yourGame, all_games));

    useEffect(() => {
        const temp_all_games = parseInt(size) === 2 ? all_games_2 : parseInt(size) === 3 ? all_games_3 : all_games_4;
        const temp_your_game = temp_all_games[Object.keys(temp_all_games)[Math.floor(Math.random()*Object.keys(temp_all_games).length)]]
        let temp_classes = ["unchecked", "unchecked", "unchecked"];
        temp_classes[size-2] = "checked"
        set_all_games(temp_all_games);
        setYourGame(temp_your_game);
        setGamePlate(temp_your_game.plate.map(row => row.map(el => 0)))
        set_all_results(check_results(temp_your_game, temp_all_games));
        setButtonClasses(temp_classes);
    },[size])

    const handlePodChange = (i, j) => {
        let temp = gamePlate
        temp[i][j] = (temp[i][j]+1)%(gamePlate.length+1)
        setGamePlate(temp)
        document.getElementById(`pod_${i*gamePlate.length+j+1}`).value= gamePlate[i][j] === 0 ? "" : gamePlate[i][j]; 
    }

    const handleCheck = () => {
        if (all_results.filter(
            result => JSON.stringify(result.plate) === JSON.stringify(gamePlate)
        ).length === 1){setPopupContext("Congrats, you won !!")
        }else{setPopupContext("Sorry, try to change something")}
        setIsOpen(true)
    }

    const handleSave = () => {

    }

    return(
        <div className="Game" id="content">
            <div className="create">
                <div className="nag">Create your game</div>
                Size: 
                {sizes.map(el => 
                    <button className={buttonClasses[el-2]} onClick={() => {
                            setSize(el);
                    }} id={`size_${el}`} key={`size_${el}`}>
                        <div className="size">{el}</div>
                    </button>
                )}
            </div>
            <div className="top_text" id="row">
                {yourGame.top_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            <div id="row">
            <div className="left_text" id="col">
                {yourGame.left_text.map(el => 
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
                {yourGame.right_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            </div>
            <div className="bottom_text" id="row">
                {yourGame.bottom_text.map(el => 
                    <div className="pod"><span>{el}</span></div>
                )}
            </div>
            {isOpen && (
                <span className="sorry">{popupContext}</span>
            )}
            <div className="buttons" id="row">
            <button onClick={() => handleCheck()}>
                Check
            </button>
            <button onClick={() => handleSave()}>
                Save
            </button>
            </div>
        </div>
    )
}

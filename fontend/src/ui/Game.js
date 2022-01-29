import './style/Game.scss';

import { useEffect, useState } from 'react';

import { check_results } from '../ducks/game/functions/game';

import Popup from './popup';

const all_games_2 = require('./../ducks/game/all_games/all_games_2.json');
const all_games_3 = require('./../ducks/game/all_games/all_games_3.json');
const all_games_4 = require('./../ducks/game/all_games/all_games_4.json');

export default function Game(props) {

    const size = props.size;
    const all_games = size === 2 ? all_games_2 : size === 3 ? all_games_3 : all_games_4;
    const [yourGame, setYourGame] = useState(all_games[Object.keys(all_games)[Math.floor(Math.random()*Object.keys(all_games).length)]]);
    const [gamePlate, setGamePlate] = useState(yourGame.plate.map(row => row.map(el => 0)));
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const all_results = check_results(yourGame, all_games);

    const handlePodChange = (i, j) => {
        let temp = gamePlate
        temp[i][j] = (temp[i][j]+1)%4
        setGamePlate(temp)
        document.getElementById(`pod_${i*3+j+1}`).value= gamePlate[i][j] === 0 ? "" : gamePlate[i][j]; 
    }

    const handleCheck = () => {
        if (all_results.filter(
            result => JSON.stringify(result.plate) === JSON.stringify(gamePlate)
        ).length === 1){
            setPopupContext("Congrats, you won !!")
        }else{
            setPopupContext("Sorry, try to change something")
        }
        setIsOpen(true)

    }

    const handleSave = () => {

    }

    return(
        <div className="Game" id="col">
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
                        <input className="pod" onClick={() => handlePodChange(i, j)} 
                            type="button" value={el ===0 ? "" : el} id={`pod_${i*3+j+1}`} />
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
            <div className="row">
            <button onClick={() => handleCheck()}>
                Sprawdź
            </button>
            <button onClick={() => handleSave()}>
                Zapisz
            </button>
            </div>
            {isOpen && <Popup
                content={popupContext}
                handleClose={() => {setIsOpen(false)}}
            />}
        </div>
    )
}

// onClick={(i*3+j+1) => handlePodChange(i*3+j+1)}
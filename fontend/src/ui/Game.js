import './style/Game.scss';

import { useEffect, useState } from 'react';
import { useParams } from "react-router"
import {Formik, Form, Field} from "formik";
import Cookies from 'js-cookie';

import Popup from './popup';

import { check_results, create_game } from '../ducks/game/game';
import { save_game, get_player_games, finish_game, update_game } from '../ducks/game/actions';

const all_games_2 = require('./../ducks/game/all_games/all_games_2.json');
const all_games_3 = require('./../ducks/game/all_games/all_games_3.json');
const all_games_4 = require('./../ducks/game/all_games/all_games_4.json');


export default function Game() {

    const {save_name: save_name} = useParams();
    const [isSavedGame, setIsSavedGame] = useState((save_name !== undefined));
    const [yourSavedGame, setYourSavedGame] = useState([])
    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)})
    const [playerGames, setPlayerGames] = useState([])
    const sizes = [2, 3, 4]
    const difficulty_levels = [1, 2, 3, 4, 5]
    const [size, setSize] = useState(3);
    const [difficulty, setDifficulty] = useState(3);
    const [isError, setIsError] = useState(true);
    const [sizeButtonClasses, setSizeButtonClasses] = useState(["unchecked", "checked", "unchecked"]);
    const [difficultyButtonClasses, setDifficultyButtonClasses] = useState(["unchecked", "unchecked", "checked", "unchecked", "unchecked"]);
    const [all_games, set_all_games] = useState([]);
    const [yourGame, setYourGame] = useState([]);
    const [gamePlate, setGamePlate] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [topPopup, setTopPopup] = useState(false);
    const [topPopupContext, setTopPopupContext] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [all_results, set_all_results] = useState([]);
    

    const ValidateSave = (value) => {
        if (!value) return "required";
        if (playerGames.filter(game => game.save === value).length !== 0) return "save exists"
    }

    useEffect(()=>{
        if (save_name === undefined){setIsSavedGame(false)}
        if (save_name !== undefined){
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
                    setYourSavedGame(temp_your_game)
                    setYourGame(temp_your_game.plate);
                    setGamePlate(temp_your_game.plate.plate);
                    set_all_results(check_results(temp_your_game.plate, temp_all_games));
                    set_all_games(temp_all_games);
                    setIsError(false)
                }
            }
            })()
        }else{
            (async () => {
                const games = await get_player_games(Cookies.get(`loggedUserId`))
                setPlayerGames(games.data)
            })()
            const temp_all_games = parseInt(size) === 2 ? all_games_2 : parseInt(size) === 3 ? all_games_3 : all_games_4;
            let temp_your_game = temp_all_games[Object.keys(temp_all_games)[Math.floor(Math.random()*Object.keys(temp_all_games).length)]]
            const temp_texts = create_game(temp_your_game, difficulty)
            temp_your_game.top_text = temp_texts.top_text
            temp_your_game.bottom_text = temp_texts.bottom_text
            temp_your_game.left_text = temp_texts.left_text
            temp_your_game.right_text = temp_texts.right_text
            let temp_size_classes = ["unchecked", "unchecked", "unchecked"];
            let temp_diff_classes = ["unchecked", "unchecked", "unchecked", "unchecked", "unchecked"]
            temp_size_classes[size-2] = "checked"
            temp_diff_classes[difficulty-1] = "checked"
            set_all_games(temp_all_games);
            setYourGame(temp_your_game);
            setGamePlate(temp_your_game.plate.map(row => row.map(el => 0)))
            set_all_results(check_results(temp_your_game, temp_all_games));
            setSizeButtonClasses(temp_size_classes);
            setDifficultyButtonClasses(temp_diff_classes);
            setIsError(false)
        }
        Cookies.set(`startGameDate`, new Date().toISOString().slice(0, 19).replace('T', ' '));
    },[size, difficulty, save_name])

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
            if (isSavedGame) {
                (async () => {
                    const game_save = {
                        start_date: yourSavedGame.start_date,
                        play_time: yourSavedGame.play_time + new Date().getTime() - new Date(Cookies.get(`startGameDate`)),
                        end_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        plate: JSON.stringify({
                            plate: gamePlate,
                            top_text: yourGame.top_text,
                            bottom_text: yourGame.bottom_text,
                            left_text: yourGame.left_text,
                            right_text: yourGame.right_text
                        }),
                        finished: true,
                        score: yourSavedGame.score,
                        save: yourSavedGame.save,
                        player_id: yourSavedGame.player_id
                    };
                    const response = await update_game(game_save, yourSavedGame.id);
                    console.log("zapis", response)
                    if (response.status === 200){
                        setIsWrong(false);
                        setTopPopupContext("Congrats, you won !!");
                        setTopPopup(true);
                        setTimeout(() => {
                            setTopPopup(false)
                            window.location.replace(`/player/${player.id}`);
                        }, 2000);
                        
                        
                    }
                })()
            (async () => {
                const endgame = await finish_game(yourGame.id, yourGame.play_time + new Date().getTime() - new Date(Cookies.get(`startGameDate`)))
            })()}
            else{
                (async () => {
                    const game_save = {
                        start_date: new Date(Cookies.get(`startGameDate`)),
                        play_time: new Date().getTime() - new Date(Cookies.get(`startGameDate`)),
                        end_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        plate: JSON.stringify({
                            plate: gamePlate,
                            top_text: yourGame.top_text,
                            bottom_text: yourGame.bottom_text,
                            left_text: yourGame.left_text,
                            right_text: yourGame.right_text
                        }),
                        finished: true,
                        score: difficulty*gamePlate.length**2,
                        save: null,
                        player_id: player.id
                    };
                    const response = await save_game(game_save);
                    console.log("zapis", response)
                    if (response.status === 200){
                        setIsWrong(false);
                        setTopPopupContext("Congrats, you won !!");
                        setTopPopup(true);
                        setTimeout(() => {
                            setTopPopup(false)
                            window.location.replace(`/play`);
                        }, 2000);
                    }
                })()
            }
        }else{
            setPopupContext("Sorry, try to change something");
            setIsWrong(true);
            setTimeout(() => {setIsWrong(false)}, 3000);
        }
    }

    const handleSave = (values, actions) => {
        if (isSavedGame){
            (async () => {
                const game_save = {
                    start_date: yourSavedGame.start_date,
                    play_time: yourSavedGame.play_time + new Date().getTime() - new Date(Cookies.get(`startGameDate`)),
                    end_date: yourSavedGame.end_date,
                    plate: JSON.stringify({
                        plate: gamePlate,
                        top_text: yourGame.top_text,
                        bottom_text: yourGame.bottom_text,
                        left_text: yourGame.left_text,
                        right_text: yourGame.right_text
                    }),
                    finished: yourSavedGame.finished,
                    score: yourSavedGame.score,
                    save: yourSavedGame.save,
                    player_id: yourSavedGame.player_id
                };
                const response = await update_game(game_save, yourSavedGame.id);
                if (response.status === 200){
                    setTopPopupContext(`Game saved`);
                    setTopPopup(true);
                    setTimeout(() => setTopPopup(false), 3000);
                }
            })()
        }else{
        (async () => {
            const game_save = {
                start_date: Cookies.get(`startGameDate`),
                play_time: new Date().getTime() - new Date(Cookies.get(`startGameDate`)),
                plate: JSON.stringify({
                    plate: gamePlate,
                    top_text: yourGame.top_text,
                    bottom_text: yourGame.bottom_text,
                    left_text: yourGame.left_text,
                    right_text: yourGame.right_text
                }),
                finished: false,
                score: difficulty*gamePlate.length**2,
                save: values.save,
                player_id: player.id
            };
            const response = await save_game(game_save);
            if (response.status === 200){
                setYourSavedGame(response.data)
                setIsSavedGame(true);
                setTopPopupContext(`Game saved under ${values.save}`);
                setTopPopup(true);
                setTimeout(() => window.location.replace(`/play/${values.save}`), 3000);
            }
        })()}
        setTimeout(() => setIsOpen(false), 2000);
    }

    console.log("d", yourGame, difficulty)

    return(
        <>
        {!isError ? (
        <>
        <div className="Game" id="content">
            <div id="grid2">
                
            {isSavedGame ? (
                <div className="buttons">
                    <button onClick={()=>{
                        window.location.replace('/play');
                    }} id="new_game">New Game</button>
                </div>
                
            ):(
            <div className="create" id="col">
                <div className="nag">Create your game</div>
                <div>
                Size: 
                {sizes.map(el => 
                    <button className={sizeButtonClasses[el-2]} onClick={() => {
                            setSize(el);
                    }} id={`size_${el}`} key={`size_${el}`}>
                        <div className="size">{el}</div>
                    </button>
                )}
                </div>
                <div>
                Dificulty:
                {difficulty_levels.map(el => 
                    <button className={difficultyButtonClasses[el-1]} onClick={() => {
                            setDifficulty(el);
                    }} id={`size_${el}`} key={`size_${el}`}>
                        <div className="size">{el}</div>
                    </button>
                )}
                </div>
            </div>)}
            </div>
            <div className="top_text" id="row">
                {yourGame.top_text.map(el => 
                    <div className="pod"><span>{el === 0 ? "" : el}</span></div>
                )}
            </div>
            <div id="row">
            <div className="left_text" id="col">
                {yourGame.left_text.map(el => 
                    <div className="pod"><span>{el === 0 ? "" : el}</span></div>
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
                    <div className="pod"><span>{el === 0 ? "" : el}</span></div>
                )}
            </div>
            </div>
            <div className="bottom_text" id="row">
                {yourGame.bottom_text.map(el => 
                    <div className="pod"><span>{el === 0 ? "" : el}</span></div>
                )}
            </div>
            {isWrong && (
                <span className="sorry">{popupContext}</span>
            )}
            {isSavedGame ? (
                <div className="buttons" id="row">
                    <button onClick={() => handleCheck()}>
                        Check
                    </button>
                    <div className="field">{save_name}</div>
                    <button onClick={() => handleSave()}>
                        Save
                    </button>
                </div>
            ):(
            <div className="buttons" id="row">
                <button onClick={() => handleCheck()}>
                    Check
                </button>
            <Formik
                initialValues={{
                    save: ""
                }}
                onSubmit={(values,actions) => handleSave(values,actions)}
                enableReinitialize = {true} className="Formik">
                {({ errors, touched, isValidating }) => (
                    <Form className="Form" id="row">
                        <div id="grid3">
                        <div></div>
                        <Field name="save" validate={ValidateSave} className="field" placeholder="save name"/>
                        {errors.save && touched.save && <div className="sorry">{errors.save}</div>}
                        {/* {login_error !== "" && <div className="sorry">{login_error}</div>} */}
                        </div>
                    <button type="submit" >
                        Save
                    </button>
                    </Form>
                )}
            </Formik>
            </div>
            )}
        </div>
        {topPopup && <div className="end_game">
            {topPopupContext}
        </div>}
        </>
        ):(
            <div className="content">No game under that name</div>
        )}
        </>
        
    )
}
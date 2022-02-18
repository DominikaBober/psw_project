import './style/App.scss';
import { useEffect, useState } from "react";
import {Formik, Form, Field} from "formik";
import {Route, Switch, Link} from 'react-router-dom';
import Cookies from 'js-cookie';
import { MQTT } from '../ducks/mqtt/MQTT';

import Game from "./Game"
import Popup from "./popup";
import Footer from './Footer';
import Ranking from './Ranking';
import Player from './Player';
import Home from './Home';
import Chat from './Chat';
import LoadGame from './LoadGame';

import { create_user, check_if_good_password, check_if_exists } from '../ducks/login/actions';
import Client from '../ducks/mqtt/MQTT';

const fs = require('fs');
const fsPromises = fs.promises;
const resources = require('./../ducks/resources.json');
MQTT()

function App() {

    const [isLogin, setIsLogin] = useState(Cookies.get(`loggedUserLogin`) !== undefined);
    const [startLog, setStartLog] = useState(false);
    const [isUserCreate, setIsUserCreate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [login_error, set_login_error] = useState("")
    const [password_error, set_password_error] = useState("")
    const [isError, setIsError] = useState(false);
    const [player, setPlayer] = useState([])
    const [classes, setClasses] = useState(["checked", "checked"])
    const [isRulesOpen, setIsRulesOpen] = useState(false);
    const [rules, setRules] = useState("");
    const ValidateLogin = (value) => {if (!value) return "required"}
    const ValidatePassword = (value) => {if (!value) return "required"; if (value.length < 4) return "password too short"}

    if (Client.connected){
        Client.on("message", (topic, message) => {
            if (topic === "rules"){
                setRules(message.toString());
            }
        })
    }

    const handleLogin = async (values,actions) => {
        if (isUserCreate){
            const exist = await check_if_exists(values.login);
            if (exist.status === 200){
                if (!exist.data){
                    const new_user = await create_user(values);
                    if (new_user.status === 200){
                        Cookies.set(`loggedUserLogin`, values.login);
                        Cookies.set(`loggedUserId`, new_user.data.id);
                        setPlayer(Cookies.get(`loggedUser`));
                        setIsLogin(true);
                    }
                }else{
                    set_login_error("user exists")
                }
            }
        }else{
            const exist = await check_if_exists(values.login);
            if (exist.status === 200){
                if (exist.data){
                const login = await check_if_good_password(values);
                    if (login.status === 200){
                        if(login.data.password){
                            Cookies.set(`loggedUserLogin`, values.login);
                            Cookies.set(`loggedUserId`, login.data.id);
                            setPlayer(Cookies.get(`loggedUser`));
                            setIsLogin(true);
                        }
                        else{set_password_error("wrong password")}
                    }
                }else{
                    set_login_error("user does not exists")
                }
            }
        }
    }

    useEffect(()=>{

    },[isLogin, login_error, password_error])
    
  
  return (
    <div className="App">
        <Link to="/"><div className="home_nag">Pyramids</div></Link>
        {!isLogin ? (
            <div className="Login_Page" id="content">
                    <div className="startrules">
                        {resources.rules}
                    </div>
                    <div className="row">
                        <button className={classes[0]} onClick={() => {
                            setIsUserCreate(false); setStartLog(true); setClasses(["checked", "unchecked"]);}}>Login</button>
                        <button className={classes[1]} onClick={() => {
                            setIsUserCreate(true); setStartLog(true); setClasses(["unchecked", "checked"]);}}>Register</button>
                    </div>
                    {startLog && <Formik
                        initialValues={{
                            login: '',
                            password: ''
                        }}
                        onSubmit={(values,actions) => handleLogin(values,actions)}
                        enableReinitialize = {true} className="Formik">
                        {({ errors, touched, isValidating }) => (
                            <Form className="Form" id="col">
                                <div id="pole">login</div>
                                <Field name="login" id="pole" validate={ValidateLogin}/>
                                {errors.login && touched.login && <div className="sorry">{errors.login}</div>}
                                {login_error !== "" && <div className="sorry">{login_error}</div>}
                                <div id="pole">password</div>
                                <Field type="password" name="password" id="pole" validate={ValidatePassword}/>
                                {errors.password && touched.password && <div className="sorry">{errors.password}</div>}
                                {password_error !== "" && <div className="sorry">{password_error}</div>}
                                <button type="submit" id="pole" className="checked">
                                Submit
                                </button>
                            </Form>
                        )}
                    </Formik>}
            </div>
        ):(
            <div>
                <button className="rulesbutton" id="left" onClick={() => {
                    if (Client.connected){Client.publish("rules", resources.rules)}
                    setIsRulesOpen(!isRulesOpen);
                }}>Game Rules</button>
                <div className="nav" id="row">
                        <Link to="/chat"  id="link">Chat</Link>
                        <Link to="/ranking" id="link">Ranking</Link>
                        <Link to="/play"  id="link">Play</Link>
                        <div className="profile" id="col">
                            <Link to={`/player/${Cookies.get(`loggedUserId`)}`} id="link">Your Profile</Link>
                            <button onClick={()=> {
                                Cookies.remove(`loggedUserLogin`);
                                Cookies.remove(`loggedUserId`);
                                setIsLogin(false);
                        }} id="link">Log out</button>
                        </div>
                </div>
                <Switch className="content">
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/play/:save_name">
                        <Game size={3}/>
                    </Route>
                    <Route path="/play">
                        <Game size={3}/>
                    </Route>
                    <Route exact path="/chat">
                        <Chat/>
                    </Route>
                    <Route exact path="/ranking">
                        <Ranking/>
                    </Route>
                    <Route exact path="/player/:id">
                        <Player/>
                    </Route>
                    {/* <Route exact path="/play/:save_name">
                        <LoadGame/>
                    </Route> */}
                    <Route  path="/*">
                        <div className="error" id="content">
                            Page not found
                        </div>
                    </Route>
                </Switch>
                {/* {isRulesOpen &&  */}
                    <div className={rules!== "" && (isRulesOpen? "rules": "hide_rules")}>
                        {rules}
                    </div>
                {/* } */}
            </div>
        )}
        {isOpen && <Popup
            content={popupContext}
            handleClose={() => {setIsOpen(false)}}
        />}
        <Footer/>
    </div>
  );
}
  
export default App;

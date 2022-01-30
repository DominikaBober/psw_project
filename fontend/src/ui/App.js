import './style/App.scss';
import { useEffect, useState } from "react";
import {Formik, Form, Field} from "formik";
import {Route, Switch, Link} from 'react-router-dom';
import Game from "./Game"
import Popup from "./popup";
import Footer from './Footer';

import { create_user, check_if_good_password, check_if_exists } from '../ducks/login/actions';

const Redux = require('redux');

function App() {

    const [isLogin, setIsLogin] = useState(false);
    const [startLog, setStartLog] = useState(false);
    const [isUserCreate, setIsUserCreate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [login_error, set_login_error] = useState("required")
    const [password_error, set_password_error] = useState("required")
    const [isError, setIsError] = useState(false);
    const [player, setPlayer] = useState([])
    const [classes, setClasses] = useState(["checked", "checked"])
    const ValidateLogin = (value) => {if (!value) return login_error}
    const ValidatePassword = (value) => {if (!value) return password_error}

    const handleLogin = async (values,actions) => {
        if (isUserCreate){
            const exist = await check_if_exists(values.login);
            if (!exist.data){
                const new_user = await create_user(values);
                if (new_user.status === 200){setIsLogin(true)}
            }else{
                set_login_error("user exists")
            }
        }else{
            const exist = await check_if_exists(values.login);
            if (exist.data){
                const login = await check_if_good_password(values);
                if (login.data){setIsLogin(true)}
                else{set_password_error("wrong password")}
            }else{
                set_login_error("user does not exists")
            }
        }
    }
    
  
  return (
    <div className="App">
        <Link to="/"><div className="home_nag">Pyramids</div></Link>
        {!isLogin ? (
            <div className="Login_Page" id="content">
                    <div className="rules">
                        Pyramids game is to cossbszvblabvwbvlwbr vebvwalbvkabvsbvjskvkjszdbvjsdbvjsbv
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
                                <div id="pole">password</div>
                                <Field type="password" name="password" id="pole" validate={ValidatePassword}/>
                                {errors.password && touched.password && <div className="sorry">{errors.password}</div>}
                                <button type="submit" id="pole" className="checked">
                                Submit
                                </button>
                            </Form>
                        )}
                    </Formik>}
            </div>
        ):(
            <div>
                <Navbar />
                <Switch className="content">
                    <Route exact path="/play">
                        <Game size={3}/>
                    </Route>
                </Switch>
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

function Navbar() {
  return (
      <div className="nav">
            <Link to="/ranking" id="link"><a>Ranking</a></Link>
            <Link to="/play"  id="link"><a>Play</a></Link>
            {/* <Link to="/profile"><a>Your Profile</a></Link> */}
      </div>
  );
}

// /movies/add - formularz umożliwiający dodanie filmu (z polami id, title, productionYear)
// /movies/:id - szczegóły wybranego filmu. Oprócz danych filmu, powinny się wyświetlić dane reżysera, którzy grają w danym filmie. Powinna być możliwość wybrania reżysera z listy istniejących.
// /directors - lista reżyserów
// /directors/add - formularz umożliwiający dodanie reżysera (z polami id, firstName, lastName, age).
// /directors/:id - szczegóły danego reżysera.
// /directors/:id/edit 
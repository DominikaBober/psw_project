import './style/Chat.scss';

import {Formik, Form, Field} from "formik";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import Client from '../ducks/mqtt/MQTT';

export default function Chat(){
    return(
        <div className="Chat" id="content">
            <Chatter/>
        </div>
    )
}

function Chatter(){

    const [player, setPlayer] = useState({login: Cookies.get(`loggedUserLogin`), id: Cookies.get(`loggedUserId`)})
    const [chatMessages, setChatMessages] = useState([])

    if (Client.connected){
        Client.on("message", (topic, message) => {
            if (topic === "chat"){
                setChatMessages([...chatMessages, message.toString()]);
            }
        })
    }

    const handleSend = (values,actions) => {
        if (Client.connected){
            Client.publish("chat", `${player.login}: ${values.message}`);
            actions.resetForm({message: ""})
        }
    }

    useEffect(() => {
        if (Client.connected){
            Client.publish("chat", `${player.login} joined a chat`);
        }
    },[])

    return(
        <div className="chatter">
            <div className="nag">Welcome to the chat!</div>
            <div className="chat">
                {chatMessages.map(message => 
                <div className="message">
                    {message}
                </div>
                )}
            </div>
            <Formik
                initialValues={{
                    message: ""
                }}
                onSubmit={(values,actions) => handleSend(values,actions)}
                enableReinitialize = {true} className="Formik" id="grid2">
                {({ errors, touched, isValidating }) => (
                    <Form className="Form" id="row">
                        <Field name="message" className="field" placeholder="are you lost baby girl?..."/>
                    <button type="submit" id="rigth">
                        Send
                    </button>
                    </Form>
                )}
            </Formik>
    </div>
    )

}
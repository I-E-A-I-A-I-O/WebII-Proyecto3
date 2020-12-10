import React from "react";
import ReactDOM from "react-dom";
import {RegisterButton, LoginButton} from "./Buttons"
import {Homepage} from "./Homepage";

class mainPage extends React.Component {
    render() {
        this.LoggedIn();
        return (
         <div>
             <h1>Twitter clone</h1>
             <h4>Made by Jesus M.</h4>
             <RegisterButton/>
             <LoginButton/>
         </div>
        )
    }
    LoggedIn(){
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/loginSingUp/LoggedIn",{
            method:"GET",
            credentials:"include"
        }).then(response => response.text())
            .then(response => {
                if(response === "True"){
                    ReactDOM.render(<Homepage/>, document.getElementById("root"));
                }
            })
    }
}

export default mainPage;
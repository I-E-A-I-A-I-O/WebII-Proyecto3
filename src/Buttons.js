import React from "react";
import ReactDOM from "react-dom";
import {Login, Register} from "./EntryInterfaces";

class RegisterButton extends React.Component {
    render() {
        return(
            <button onClick={this.changePage} style={{margin: "15px"}}>Register</button>
        )
    }
    changePage = () => {
        ReactDOM.render(<Register/>, document.getElementById("SecondDiv"));
    }
}

class LoginButton extends React.Component {
    render() {
        return(
            <button onClick={this.changePage} style={{margin: "15px"}}>Login</button>
        )
    }
    changePage = () => {
        ReactDOM.render(<Login/>, document.getElementById("SecondDiv"));
    }
}

export {RegisterButton, LoginButton}

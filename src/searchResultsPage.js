import React from "react";
import ReactDOM from "react-dom";
import {Profile} from "./Homepage";
import {TweetRenderer} from "./tweet"

class Results extends React.Component{
    render() {
        return(
            <div>
                <br/>
                <p style={{fontWeight:"bold", fontSize:"x-large"}}>Users</p>
                <p style={{borderBottom:"groove", borderColor:"rgb(88,86,86)"}}></p>
                <div id={"UList"}></div>
                <p style={{fontWeight:"bold", fontSize:"x-large"}}>Tweets</p>
                <p style={{borderBottom:"groove", borderColor:"rgb(88,86,86)"}}></p>
                <div id={"TList"}></div>
            </div>
        )
    }
    componentDidMount() {
        ReactDOM.render(<UserResults searchParam={this.props.searchParam}/>, document.querySelector("#UList"));
        ReactDOM.render(<TweetRenderer param={"tweetByText"} body={this.props.searchParam}/>, document.querySelector("#TList"));
    }
}

class UserResults extends React.Component{
    render() {
        return(
            <div id={"userResultsDiv"}></div>
        )
    }
    componentDidMount() {
        this.getUsers();
    }
    getUsers = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/profileData/userList", {
            method:"POST",
            body:this.props.searchParam,
            credentials:"include"
        }).then(response => response.text())
            .then(text => {
                let firstSplit = text.split('|');
                let secondSplit = [];
                for (let i = 0; i < firstSplit.length; i++){
                    if (firstSplit[i].length > 1){
                        secondSplit[i] = firstSplit[i].split("username" + i + " : ")[1];
                    }
                }
                this.showUsers(secondSplit);
            })
    }
    showUsers = (Usernames) => {
        let componentDiv = document.querySelector("#userResultsDiv");
        let components = []
        for (let i = 0; i < Usernames.length; i++) {
            components[i] = <UserComponent username={Usernames[i]}/>
        }
        ReactDOM.render(components, componentDiv);
    }
}

class UserComponent extends React.Component{
    render() {
        this.getAvatars();
        return (
            <div>
                <div id={"UserDiv"} style={{textAlign:"center", borderStyle:"groove", borderColor:"#585858", backgroundColor:"rgb(69,67,67)", borderRadius:"10%", width:"225px"}}>
                    <img alt={""} id={"Avatar" + this.props.username} onClick={this.showProfile} style={{cursor:"pointer", position:"absolute", left:"75px", borderStyle:"solid", borderColor:"deepskyblue", borderRadius:"50%", width:"35px"}}/>
                    <p onClick={this.showProfile} style={{cursor:"pointer"}}>{this.props.username}</p>
                </div>
                <br/>
            </div>
        )
    }
    getAvatars = () =>{
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getAvatar", {
            method:"POST",
            body:this.props.username,
            credentials: "include"
        }).then(response => response.blob())
            .then(blob => {
                let url = URL.createObjectURL(blob);
                document.querySelector("#Avatar" + this.props.username).src = url;
            })
    }
    showProfile = () =>{
        ReactDOM.render(<Profile username={this.props.username}/>, document.querySelector("#SecondDiv"));
    }
}

export {Results}
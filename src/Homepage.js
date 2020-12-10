import React from "react";
import ReactDOM from "react-dom";
import {Results} from "./searchResultsPage";
import {TweetRenderer} from "./tweet"
import {Router} from "./routerComponent"
import {TweetWriter} from "./writer";
import EditPage from "./editProfile"
import Main from "./mainPage";

class Homepage extends React.Component{
    render() {
        ReactDOM.render(<MenuBar/>, document.getElementById("root"));
        ReactDOM.render(<Profile username={this.props.username}/>, document.getElementById("SecondDiv"));
        return(null);
    }
}

class MenuBar extends React.Component{
    render() {
        return(
            <div style={{borderStyle:"groove", textAlign:"left", width:"1200px", height:"50px", borderColor:"deepskyblue", backgroundColor:"skyblue"}}>
                <p id={"Home"} style={{cursor:"pointer", position:"absolute", left:"95px", color:"black", fontWeight:"bold"}} onClick={this.renderFeed}>FEED</p>
                <img alt="" onClick={this.showSearchBar} src={"https://cdn3.iconfinder.com/data/icons/block/32/search-512.png"} style={{cursor:"pointer", width:"25px", position:"absolute", left:"740px", top:"60px"}}/>
                <form onSubmit={this.search} style={{position:"absolute", left:"500px", top: "62px"}}>
                    <input hidden={true} id={"searchBar"} type={"text"} style={{borderStyle:"solid", borderColor:"black", backgroundColor:"gray"}} placeholder={"Search..."}/>
                </form>
                <p id={"logo"} style={{position:"absolute", left: "605px", color:"black", fontWeight:"bold"}}>Twitter Clone</p>
                <p style={{cursor:"pointer", position:"absolute", left:"1145px", color:"black", fontWeight:"bold"}} id={"Profile"} onClick={this.renderProfile}>PROFILE</p>
                <img alt="" onClick={this.renderWriter} src={"https://cdn1.iconfinder.com/data/icons/action-states-vol-4-1/48/Sed-04-512.png"} style={{position:"fixed", borderRadius:"50%", borderColor:"deepskyblue", borderStyle:"solid", backgroundColor:"deepskyblue", width:"65px", left:"1180px", top:"75%", cursor:"pointer"}}/>
            </div>
        );
    }

    renderWriter = () => {
        ReactDOM.render(<TweetWriter username={document.cookie.split("username=")[1]}/>, document.querySelector("#SecondDiv"))
    }

    showSearchBar = () => {
        let searchBar = document.querySelector("#searchBar");
        let logo = document.querySelector("#logo");
        searchBar.hidden = !searchBar.hidden;
        logo.style.left = searchBar.hidden ? "605px" : "385px";
    }

    search = (e) => {
        e.preventDefault();
        let searchBar = document.querySelector("#searchBar");
        ReactDOM.render(<Results searchParam={searchBar.value}/>, document.querySelector("#SecondDiv"));
    }

    renderProfile = () =>{
        ReactDOM.render(<Router target={"profile"}/>, document.getElementById("SecondDiv"));
    }
    renderFeed = () =>{
        ReactDOM.render(<Router target={"feed"}/>, document.getElementById("SecondDiv"));
    }
}


class Profile extends React.Component{
    render() {
        return(
            <div>
                <br/><br/>
                <img onClick={this.goToEditPage} id={"editProfile"} hidden={true} alt={""} style={{position:"absolute", width:"30px", left:"720px", cursor:"pointer"}} src={"https://cdn.pixabay.com/photo/2015/12/04/22/20/gear-1077550_960_720.png"}/>
                <img alt="" id={"img"} onClick={this.browseAvatar} style={{cursor:"pointer", borderRadius:"50%", borderStyle:"solid", borderColor:"deepskyblue", width:"100px"}}></img>
                <form id={"Avatar"}>
                    <input id={"browser"} onInput={this.changeAvatar} name={"newAvatar"} type={"file"} style={{display:"none"}}/>
                </form>
                <p id={"username"}>USER</p>
                <p id={"followersCount"} style={{color:"aquamarine"}}>Followers:</p>
                <p id={"followingCount"} style={{color:"aquamarine"}}>Following:</p>
                <button id={"FollowButton"} onClick={this.followUnfollow} style={{backgroundColor:"rgb(74,92,191)", borderColor:"black", color:"rgb(255,251,207)",width:"100px", height:"25px", borderRadius:"15%"}} hidden={true}></button>
                <button id={"LogoutButton"} onClick={this.Logout} style={{backgroundColor:"rgb(74,92,191)", borderColor:"black", color:"rgb(255,251,207)",width:"100px", height:"25px", borderRadius:"15%"}} hidden={true}>Logout</button>
                <br/><br/><br/>
                <div style={{borderStyle:"solid", borderColor:"gray", borderLeft:"none", borderRight:"none", fontWeight:"bold"}}>
                    <p style={{fontWeight:"bold"}}>Tweets</p>
                </div>
                <div id={"tweets"}></div>
            </div>
        );
    }

    componentDidMount() {
        if(document.cookie.split("username=")[1] !== this.props.username) {
            document.querySelector("#FollowButton").hidden = false;
            this.getButtonState();
        }
        else{
            document.querySelector("#LogoutButton").hidden = false;
            document.querySelector("#editProfile").hidden = false;
            ReactDOM.render(<TweetRenderer param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
        }
        this.getProfile();
    }
    goToEditPage = () =>{
        ReactDOM.render(<EditPage/>, document.querySelector("#SecondDiv"));
    }
    browseAvatar = () => {
        if (document.cookie.split("username=")[1] === this.props.username){
            document.querySelector("#browser").click();
        }
    }

    followUnfollow = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/profileData/follow", {
            method:"POST",
            body: this.props.username,
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let followButton = document.querySelector("#FollowButton");
            if (text === "Following") followButton.innerHTML = "Unfollow";
            else if (text === "Unfollowed") followButton.innerHTML = "Follow";
            this.getFollowsCount();
        })
    }

    changeAvatar = () => {
        if (this.props.username !== null) {
            let form = document.querySelector("#Avatar");
            let formData = new FormData(form);
            fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/upload", {
                method: "POST",
                credentials: "include",
                body: formData
            }).then(response => {
                if (response.status === 200){
                    ReactDOM.render(<Router target={"profile"}/>, document.querySelector("#SecondDiv"));
                }
            })
        }
    }

    getProfile = () =>{
        if (this.props.username !== null) {
            document.querySelector("#username").innerHTML = this.props.username;
            this.getFollowsCount();
            fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getAvatar", {
                method: "POST",
                credentials: "include",
                body: this.props.username ? this.props.username : ""
            }).then(response => response.blob())
            .then(response => {
                let url = URL.createObjectURL(response);
                document.querySelector("#img").src = url;
            })
        }
    }
    getButtonState = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/profileData/following", {
            method:"POST",
            body: this.props.username,
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let followButton = document.querySelector("#FollowButton");
            if (text === "True") followButton.innerHTML = "Unfollow";
            else if (text === "False") followButton.innerHTML = "Follow";
            this.showTweets(text);
        })
    }
    showTweets = (follows) => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/getVisibility", {
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                response.text().then(text => {
                    if (text === "true"){
                        if (follows === "True"){
                            ReactDOM.render(<TweetRenderer param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
                        }
                    }
                    else{
                        ReactDOM.render(<TweetRenderer param={"userTweets"} body={this.props.username}/>, document.querySelector("#tweets"));
                    }
                })
            }
        })
    }
    getFollowsCount = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/profileData/userProfile", {
            method: "POST",
            credentials: "include",
            body: this.props.username
        }).then(response => response.json())
        .then(response => {
            document.querySelector("#followersCount").innerHTML = "Followers: " + response.followers;
            document.querySelector("#followingCount").innerHTML = "Following: " + response.follows;
        })
    }
    Logout = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/LoginSingUp/Logout",{
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                let cookie = document.cookie.split("=")[0];
                document.cookie = cookie + "=; expires = Thu, 01 Jan 1970 00:00:00 UTC";
                ReactDOM.render(<Main/>, document.querySelector("#root"));
                window.location.reload();
            }
        })
    }
}

export {MenuBar, Profile, Homepage}
import React from "react";
import ReactDOM from "react-dom"
import {TweetWriter} from "./writer"
import {Router} from "./routerComponent"

class Tweet extends React.Component{
    render(){
        return(
            <div>
                <br/>
                <div style={{borderBottom:"solid", borderColor:"black"}}>
                    <div id={"edition" + this.props.tweetid} hidden={true} style={{position:"absolute"}} >
                        <img id={"delete" + this.props.tweetid} alt={""} onClick={this.deleteTweet} style={{cursor:"pointer", width:"40px", position: "relative", left:"480px"}} src={"https://vectorified.com/images/delete-icon-png-4.png"}/>
                        <img id={"edit" + this.props.tweetid} alt={""} onClick={this.editTweet} style={{cursor:"pointer", width:"37px", position: "relative", left:"400px"}} src={"https://cdn.pixabay.com/photo/2017/06/06/00/33/edit-icon-2375785_640.png"} />
                    </div>
                    <div>
                        <p id={"shared" + this.props.tweetid} style={{textAlign:"justify", position:"relative", left:"140px"}}></p>
                    </div>
                    <div id={"replyingTo"} hidden={true} style={{textAlign:"justify"}}>
                        <p id={"comment" + this.props.tweetid} style={{cursor:"pointer", position:"relative", left:"140px", top:"65px"}}></p>
                    </div>
                    <div id={"poster"} style={{textAlign:"justify"}}>
                        <p id={"username" + this.props.tweetid} style={{cursor:"pointer", position:"relative", left:"140px", top:"0px"}}></p>
                        <img id={"userAvatar" + this.props.tweetid} alt={""} style={{cursor:"pointer", width:"50px", borderRadius:"50%", borderStyle:"solid", borderColor:"deepskyblue", position:"relative", left:"65px", top:"-60px"}} src={""}/>
                    </div>
                    <div id={"textAndMedia"} onClick={this.focus} style={{textAlign:"justify"}}>
                        <p id={"tweetText" + this.props.tweetid} onClick={this.focus} style={{position:"relative", left:"140px", top:"-60px", fontWeight:"bold"}}></p>
                        <video id={"tweetVideo" + this.props.tweetid} controls={true} hidden={true} style={{position:"relative", left:"130px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                        <img id={"tweetImg" + this.props.tweetid} hidden={true} alt={""} style={{position:"relative", left:"130px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                    </div>
                    <div id={"interactions"} style={{textAlign:"justify"}}>
                        <br/><br/>
                        <p id={"tweetDate" + this.props.tweetid} style={{position:"relative", top:"-35px", left:"140px", color:"gainsboro"}}></p>
                        <p style={{borderBottom:"solid", borderColor:"GrayText", position:"relative", top:"-40px"}}/>
                        <img alt={""} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"140px"}} onClick={this.Like} src={"https://i.pinimg.com/originals/ff/ec/ac/ffecac79568c406a212691a0d97ae858.png"}/>
                        <img alt={""} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"180px"}} onClick={this.Dislike} src={"https://image.flaticon.com/icons/png/512/196/196587.png"}/>
                        <img alt={""} onClick={this.CommentTweet} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"220px"}} src={"https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/77-512.png"}/>
                        <img alt={""} onClick={this.shareTweet} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"260px"}} src={"https://pngimg.com/uploads/share/share_PNG31.png"}/>
                    </div>
                </div>
                <div style={{position:"absolute"}}>
                    <p id={"Likes" + this.props.tweetid} style={{position:"relative", left:"120px", top:"-40px"}}>Likes: 0</p>
                    <p id={"Dislikes" + this.props.tweetid}  style={{position:"relative", left:"200px", top:"-75px"}}>Dislikes: 0</p>
                    <p id={"Comments" + this.props.tweetid}  style={{position:"relative", left:"305px", top:"-110px"}}>Comments: 0</p>
                    <p id={"Shares" + this.props.tweetid}  style={{position:"relative", left:"395px", top:"-145px"}}>Shares: 0</p>
                </div>
            </div>
        )
    }
    componentDidMount(){
        if(document.cookie.split("username=")[1] === this.props.username) {
            document.querySelector("#edition" + this.props.tweetid).hidden = false;
        }
        this.getTweetData();
        this.getInteractions();
    }
    editTweet = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter edit={true} tweetid={id}/>, document.querySelector("#SecondDiv"));
    }
    getInteractions = () => {
        let likesLabel = document.querySelector("#Likes" + this.props.tweetid);
        let dislikesLabel = document.querySelector("#Dislikes" + this.props.tweetid);
        let commentsLabel = document.querySelector("#Comments" + this.props.tweetid);
        let sharesLabel = document.querySelector("#Shares" + this.props.tweetid);
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        let promises = [];
        let likesBody = {type: "Like", id:id};
        let dislikesBody = {type:"Dislike", id:id};
        let commentsBody = {type:"Comments", id:id};
        let sharesBody = {type:"Shares", id:id};
        promises.push(this.fetchInteractions(likesBody));
        promises.push(this.fetchInteractions(dislikesBody));
        promises.push(this.fetchInteractions(commentsBody));
        promises.push(this.fetchInteractions(sharesBody));
        Promise.all(promises).then(response => {
            let textPromise = [];
            for (let i = 0; i < response.length; i++){
                textPromise[i] = response[i].text();
            }
            Promise.all(textPromise).then(text => {
                likesLabel.innerHTML = "Likes: " + text[0];
                dislikesLabel.innerHTML = "Dislikes: " + text[1];
                commentsLabel.innerHTML = "Comments: " + text[2];
                sharesLabel.innerHTML = "Shares: " + text[3];
            })
        })
    }
    fetchInteractions = (body) => {
        let promise = fetch("https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/Interactions",{
            method:"POST",
            body:JSON.stringify(body),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        })
        return promise;
    }
    Like = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        let body = {id:id, action:"Like"};
        this.submitInteraction(body);
    }
    Dislike = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        let body = {id:id, action:"Dislike"};
        this.submitInteraction(body);
    }
    submitInteraction = (body) =>{
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/LikeDislike", {
            method:"POST",
            body:JSON.stringify(body),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(response => {
            if (response.status === 200) this.getInteractions();
        })
    }
    getTweetData = () => {
        let id = this.props.referencedtweet && this.props.type !== "comment" ? this.props.referencedtweet : this.props.tweetid;
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetById", {
            method:"POST",
            body:id,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            this.renderTweetData(json.username, json.filelocation, json.text, json.tweet_date);
        })
    }
    focus = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<Router target={"focusedTweet"} referencedTweet={id}/>, document.querySelector("#SecondDiv"));
    }
    renderTweetData = (username, filelocation, text, date) => {
        let avatarContainer = document.querySelector("#userAvatar" + this.props.tweetid);
        document.querySelector("#tweetText" + this.props.tweetid).innerHTML = text.replace(/(\n)+/g, '<br/>');
        let imgMedia = document.querySelector("#tweetImg" + this.props.tweetid);
        let videoMedia = document.querySelector("#tweetVideo" + this.props.tweetid);
        document.querySelector("#tweetDate" + this.props.tweetid).innerHTML = date.replace("T", " ").split(".")[0] + " GMT";
        let shared = document.querySelector("#shared" + this.props.tweetid);
        document.querySelector("#username" + this.props.tweetid).innerHTML = username;
        if (this.props.type === "rt") shared.innerHTML = "Shared by " + this.props.username;
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getAvatar", {
            method:"POST",
            body: username,
            credentials:"include"
        }).then(response => response.blob())
        .then(blob => {
            let url = URL.createObjectURL(blob);
            avatarContainer.src = url;
        })
        if (filelocation){
            fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getPostMedia", {
                method:"POST",
                body:filelocation,
                credentials:"include"
            }).then(response => {
                let mimetype = response.headers.get("Content-Type");
                let blobPromise = response.blob();
                blobPromise.then(blob => {
                    let url = URL.createObjectURL(blob);
                    if (mimetype.includes("image")){
                        imgMedia.hidden = false;
                        imgMedia.src = url;
                    }
                    else{
                        videoMedia.hidden = false;
                        videoMedia.src = url;
                    }
                })
            })
        }
    }
    shareTweet = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter tweetid={id}/>, document.querySelector("#SecondDiv"));
    }
    CommentTweet = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter tweetid={id} isComment={true}/>, document.querySelector("#SecondDiv"));
    }
    deleteTweet = () => {
        let id = this.props.type === "rt" ? this.props.referencedtweet : this.props.tweetid;
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/deleteTweet", {
            method:"POST",
            credentials:"include",
            body:id
        }).then(response => {
            if (response.status === 200){
                ReactDOM.render(<Router target={"feed"}/>, document.querySelector("#SecondDiv"));
            }
        })
    }
}

export {Tweet}
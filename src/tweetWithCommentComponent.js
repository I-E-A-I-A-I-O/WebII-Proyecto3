import React from "react";
import ReactDOM from "react-dom"
import {TweetWriter} from "./writer"
import {Router} from "./routerComponent"

class RetweetComment extends React.Component{
    constructor(props){
        super(props);
        this.state={refenrece:null}
    }
    render(){
        return(
            <div>
                <div id={"edition" + this.props.tweetid} hidden={true} style={{position:"absolute"}} >
                    <img id={"delete" + this.props.tweetid} alt={""} onClick={this.deleteTweet} style={{cursor:"pointer", width:"40px", position: "relative", left:"480px"}} src={"https://vectorified.com/images/delete-icon-png-4.png"}/>
                    <img id={"edit" + this.props.tweetid} alt={""} onClick={this.editTweet} style={{cursor:"pointer", width:"37px", position: "relative", left:"400px"}} src={"https://cdn.pixabay.com/photo/2017/06/06/00/33/edit-icon-2375785_640.png"} />
                </div>
                <div id={"SharedComment"}>
                    <div id>
                        <p id={"shared" + this.props.tweetid} style={{textAlign:"justify", position:"relative", left:"140px"}}></p>
                    </div>
                    <div>
                        <p id={"replying" + this.props.tweetid} style={{cursor:"pointer", position:"relative", left:"-385px", top:"65px"}}></p>
                    </div>
                    <div style={{textAlign:"justify"}}>
                        <p id={"username" + this.props.tweetid} style={{cursor:"pointer", position:"relative", left:"140px", top:"0x"}}></p>
                        <img id={"avatar" + this.props.tweetid} alt={""} style={{cursor:"pointer", width:"50px", borderRadius:"50%", borderStyle:"solid", borderColor:"deepskyblue", position:"relative", left:"65px", top:"-40px"}} src={""}/>
                    </div>
                    <div onClick={this.focusTweet} style={{textAlign:"justify"}}>
                        <p id={"text" + this.props.tweetid} style={{position:"relative", left:"140px", top:"-60px", fontWeight:"bold"}}></p>
                        <video id={"video" + this.props.tweetid} controls={true} hidden={true} style={{position:"relative", left:"130px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                        <img id={"img" + this.props.tweetid} hidden={true} alt={""} src={""} style={{position:"relative", left:"130px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                        <p id={"date" + this.props.tweetid} style={{position:"relative", top:"-35px", left:"140px", color:"gainsboro"}}></p>
                        <p style={{borderBottom:"solid", borderColor:"GrayText", position:"relative", top:"-40px"}}/>
                    </div>
                    <div id={"originalTweet"} onClick={this.focusOriginal} style={{cursor:"pointer", borderStyle:"solid", borderRadius:"5%", borderColor:"black", width:"600px"}}>
                        <div>
                            <p id={"oUsername" + this.props.tweetid} style={{cursor:"pointer", position:"relative", left:"-150px", top:"0x"}}></p>
                            <img id={"oAvatar" + this.props.tweetid} alt={""} style={{cursor:"pointer", width:"50px", borderRadius:"50%", borderStyle:"solid", borderColor:"deepskyblue", position:"relative", left:"-250px", top:"-45px"}} src={""}/>
                        </div>
                        <div>
                            <p id={"oText" + this.props.tweetid} style={{position:"relative", left:"140px", top:"-60px", fontWeight:"bold", textAlign:"justify"}}></p>
                            <video id={"oVideo" + this.props.tweetid} controls={true} hidden={true} style={{position:"relative", left:"-250px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                            <img hidden={true} id={"oImg" + this.props.tweetid} alt={""} src={""} style={{position:"relative", left:"-0px", top:"-25px", borderStyle:"solid", borderColor:"Gray", borderRadius:"5%", width:"350px"}}/>
                        </div>
                    </div>
                    <div id={"interactions"} style={{textAlign:"justify"}}>
                        <br/><br/>
                        <img alt={""} onClick={this.Like} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"140px"}} src={"https://i.pinimg.com/originals/ff/ec/ac/ffecac79568c406a212691a0d97ae858.png"}/>
                        <img alt={""} onClick={this.Dislike} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"180px"}} src={"https://image.flaticon.com/icons/png/512/196/196587.png"}/>
                        <img alt={""} onClick={this.CommentTweet} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"220px"}} src={"https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-shapes-2-1/254000/77-512.png"}/>
                        <img alt={""} onClick={this.share} style={{cursor:"pointer", width:"50px", position:"relative", top:"-25px", left:"260px"}} src={"https://pngimg.com/uploads/share/share_PNG31.png"}/>
                        <p style={{borderBottom:"solid", borderColor:"black"}}/>
                    </div>
                </div>
                <div style={{position:"absolute"}}>
                    <p id={"Likes" + this.props.tweetid} style={{position:"relative", left:"120px", top:"-70px"}}>Likes: 0</p>
                    <p id={"Dislikes" + this.props.tweetid} style={{position:"relative", left:"200px", top:"-105px"}}>Dislikes: 0</p>
                    <p id={"Comments" + this.props.tweetid} style={{position:"relative", left:"305px", top:"-140px"}}>Comments: 0</p>
                    <p id={"Shares" + this.props.tweetid} style={{position:"relative", left:"400px", top:"-175px"}}>Shares: 0</p>
                </div>
            </div>
        )
    }
    componentDidMount(){
        if (this.props.type === "rtWithComment2") document.querySelector("#shared" + this.props.tweetid).innerHTML = "Shared by " + this.props.username;
        if(document.cookie.split("username=")[1] === this.props.username) {
            document.querySelector("#edition" + this.props.tweetid).hidden = false;
        }
        this.getCommentTweet();
        this.getInteractions();
    }
    getCommentTweet = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetById", {
            method:"POST",
            body:id,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            this.renderCommentData(json.username, json.filelocation, json.text, json.tweet_date);
            this.getCommentedTweet(json.referencedtweet);
        })
    }
    getCommentedTweet = (id) => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetById", {
            method:"POST",
            body:id,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            this.setState({refenrece:json.tweetid});
            this.renderCommentedData(json.username, json.filelocation, json.text);
        })
    }
    renderCommentedData = (username, filelocation, text) => {
        document.querySelector("#oUsername" + this.props.tweetid).innerHTML = username;
        document.querySelector("#oText" + this.props.tweetid).innerHTML = text.replace(/(\n)+/g, '<br/>');
        let imgMedia = document.querySelector("#oImg" + this.props.tweetid);
        let videoMedia = document.querySelector("#oVideo" + this.props.tweetid);
        let avatar = document.querySelector("#oAvatar" + this.props.tweetid);
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getAvatar",{
            method:"POST",
            body:username,
            credentials:"include"
        }).then(response => response.blob())
        .then(blob => {
            let url = URL.createObjectURL(blob);
            avatar.src = url;
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
    renderCommentData = (username, filelocation, text, date) => {
        document.querySelector("#username" + this.props.tweetid).innerHTML = username;
        document.querySelector("#text" + this.props.tweetid).innerHTML = text.replace(/(\n)+/g, '<br/>');
        document.querySelector("#date" + this.props.tweetid).innerHTML = date.replace("T", " ").split(".")[0];
        let imgMedia = document.querySelector("#img" + this.props.tweetid);
        let videoMedia = document.querySelector("#video" + this.props.tweetid);
        let avatar = document.querySelector("#avatar" + this.props.tweetid);
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/fileManager/getAvatar",{
            method:"POST",
            body:username,
            credentials:"include"
        }).then(response => response.blob())
        .then(blob => {
            let url = URL.createObjectURL(blob);
            avatar.src = url;
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
    share = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter tweetid={id} rtWithComment={true}/>, document.querySelector("#SecondDiv"));
    }
    CommentTweet = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter tweetid={id} isComment={true}/>, document.querySelector("#SecondDiv"));
    }
    focusTweet = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<Router target={"focusedTweet"} referencedTweet={id}/>, document.querySelector("#SecondDiv"));
    }
    focusOriginal = () => {
        let id = this.state.refenrece;
        ReactDOM.render(<Router target={"focusedTweet"} referencedTweet={id}/>, document.querySelector("#SecondDiv"));
    }
    getInteractions = () => {
        let likesLabel = document.querySelector("#Likes" + this.props.tweetid);
        let dislikesLabel = document.querySelector("#Dislikes" + this.props.tweetid);
        let commentsLabel = document.querySelector("#Comments" + this.props.tweetid);
        let sharesLabel = document.querySelector("#Shares" + this.props.tweetid);
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
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
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        let body = {id:id, action:"Like"};
        this.submitInteraction(body);
    }
    Dislike = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
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
    editTweet = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
        ReactDOM.render(<TweetWriter edit={true} tweetid={id}/>, document.querySelector("#SecondDiv"));
    }
    deleteTweet = () => {
        let id = this.props.type === "rtWithComment2" ? this.props.referencedtweet : this.props.tweetid;
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

export {RetweetComment}
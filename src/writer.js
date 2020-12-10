import React from "react";
import ReactDOM from "react-dom"
import {Router} from "./routerComponent"

class TweetWriter extends React.Component {
    constructor(props){
        super(props);
        this.state = {sendMedia: false, mediaState: "Empty"};
    }
    render() {
        return (
            <div>
                <br/><br/>
                <p id={"message"} style={{fontWeight:"bold"}}></p>
                <br/>
                <div id={"text"}>
                    <textarea id={"TextContent"} onInput={this.checkLength} style={{backgroundColor:"#2b2b2b", color:"white", resize:"none"}} cols={"150"} rows={"8"} placeholder={"Write something..."}/>
                </div>
                <br/>
                <p id={"lengthCounter"} style={{position:"absolute", fontWeight:"bold", color:"rgb(59,134,53)", left:"1050px"}}></p>
                <br/><br/><br/>
                <div id={"media"}>
                    <div style={{position:"absolute", right:"50px"}}>
                        <img alt="" onClick={this.triggerClick} style={{cursor:"pointer", width:"75px"}} src={"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Icons8_flat_add_image.svg/1024px-Icons8_flat_add_image.svg.png"}/>
                    </div>
                    <img alt="" id={"imgPreview"} hidden={true} style={{width:"250px"}}/>
                    <video id={"videoPreview"} hidden={true} controls={true} style={{width:"250px"}}/>
                    <form id={"mediaInput"} hidden={true}>
                        <input name={"tweetMedia"} id={"TFile"} accept={"image/jpeg, image/png, image/gif, video/mp4"} onInput={this.imageInput} type={"file"}/>
                    </form>
                    <button onClick={this.postTweet} style={{cursor:"pointer", backgroundColor:"deepskyblue", borderColor:"deepskyblue", borderRadius:"15%", width:"75px", position:"absolute", left:"115px", top:"350px"}}>Post</button>
                    <button onClick={this.deleteMedia} style={{cursor:"pointer", backgroundColor:"deepskyblue", borderColor:"deepskyblue", borderRadius:"15%", width:"115px", height:"22px", position:"absolute", left:"215px", top:"350px"}}>Delete media</button>
                </div>
            </div>
        )
    }

    deleteMedia = () => {
        this.setState({sendMedia: false});
        let mediaState = this.state.mediaState;
        if (mediaState === "Keep" || mediaState === "New" || mediaState === "Change") this.setState({mediaState:"Delete"});
        let imgPreview = document.querySelector("#imgPreview");
        let videoPreview = document.querySelector("#videoPreview");
        imgPreview.hidden = true;
        imgPreview.src = "";
        videoPreview.hidden = true;
        videoPreview.src = "";
    }

    newTweet = () => {
        let text = document.querySelector("#TextContent");
        let message = document.querySelector("#message");
        let type;
        let option = this.props.tweetid ? this.props.tweetid : "nada";
        if (text.value.length > 240){
            message.style.color = "red";
            message.innerHTML = "Character limit surpassed!";
        }
        else{
            if (this.props.tweetid){
                if(this.props.isComment){
                    type = "comment";
                }
                else{
                    if (text.value.length === 0 && !this.state.sendMedia){
                        type = this.props.rtWithComment ? "rtWithComment2" : "rt";
                    }
                    else{
                        type = "rtWithComment";
                    }
                }
            }
            else{
                type = "originalPost";
            }
        }
        fetch("http://localhost:5000/makeApost/postText", {
             method:"POST",
            body: JSON.stringify({text:text.value, type:type}),
            credentials:"include",
            headers:{
                "Content-Type":"application/json",
                "Option":option
            }
        }).then(response => response.text())
        .then(text => {
            if (this.state.sendMedia){
                let form = document.querySelector("#mediaInput");
                let formData = new FormData(form);
                fetch("http://localhost:5000/makeApost/postMedia", {
                    method:"POST",
                    body: formData,
                    credentials:"include",
                    headers:{
                        "Option":text
                    }
                }).then(response => {
                    if (response.status === 200){
                        message.style.color = "green";
                        message.innerHTML = "Tweet posted.";
                    }
                })
            }
            else{
                message.style.color = "green";
                message.innerHTML = "Tweet posted.";
            }
        })
    }
    postTweet = () => {
        if (this.props.edit){
            this.editTweet();
        }
        else{
            this.newTweet();
        }
    }
    editTweet(){
        let text = document.querySelector("#TextContent");
        let message = document.querySelector("#message");
        if (text.value.length > 240){
            message.style.color = "red";
            message.innerHTML = "Character limit surpassed!";
        }
        else{
            fetch("http://localhost:5000/DataEdition/editText", {
                method:"POST",
                credentials:"include",
                body:JSON.stringify({id:this.props.tweetid, text:document.querySelector("#TextContent").value}),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(response => {
                if (response.status === 200){
                    let mediaState = this.state.mediaState;
                    if (mediaState !== "Keep" && mediaState !== "Empty"){
                        let body = mediaState === "Change" || mediaState === "New" ? 
                        new FormData(document.querySelector("#mediaInput")) : "nada";
                        fetch("http://localhost:5000/DataEdition/editMedia", {
                            method:"POST",
                            credentials:"include",
                            body:body,
                            headers:{
                                "Option":this.props.tweetid,
                                "Option2":mediaState
                            }
                        }).then(response => {
                            if (response.status === 200){
                                ReactDOM.render(<Router target={"feed"}/>, document.querySelector("#SecondDiv"));
                            }
                        })
                    }
                    else{
                        ReactDOM.render(<Router target={"feed"}/>, document.querySelector("#SecondDiv"));
                    }
                }
            })
        }
    }
    componentDidMount() {
        document.querySelector("#lengthCounter").innerHTML = "Characters 0/240";
        if (this.props.edit){
            this.fetchTweet();
        }
    }
    fetchTweet = () => {
        let text = document.querySelector("#TextContent");
        let imgPreview = document.querySelector("#imgPreview");
        let videoPreview = document.querySelector("#videoPreview");
        fetch("http://localhost:5000/makeApost/getTweetById", {
            method:"POST",
            body:this.props.tweetid,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            text.value = json.text;
            if (json.filelocation){
                this.setState({mediaState:"Keep"});
                fetch("http://localhost:5000/fileManager/getPostMedia", {
                    method:"POST",
                    body:json.filelocation,
                    credentials:"include"
                }).then(response => {
                    let mimetype = response.headers.get("Content-Type");
                    let blobPromise = response.blob();
                    blobPromise.then(blob => {
                        let url = URL.createObjectURL(blob);
                        if (mimetype.includes("image")){
                            imgPreview.hidden = false;
                            imgPreview.src = url;
                        }
                        else{
                            videoPreview.hidden = false;
                            videoPreview.src = url;
                        }
                    })
                })
            }
        })
    }
    triggerClick(){
        document.querySelector("#TFile").click();
    }
    imageInput = () => {
        this.setState({sendMedia: true});
        if (this.state.mediaState === "Empty") this.setState({mediaState: "New"});
        else if (this.state.mediaState  === "Delete" || this.state.mediaState === "Keep") this.setState({mediaState:"Change"});
        let file = document.querySelector("#TFile");
        let fReader = new FileReader();
        let imagePreview = document.querySelector("#imgPreview");
        let videoPreview = document.querySelector("#videoPreview");
        fReader.readAsDataURL(file.files[0]);
        fReader.onloadend = function(event){
            let mimeType = event.target.result.split(";")[0].split(":")[1].split("/")[0];
            if (mimeType === "image") {
                videoPreview.src = "";
                videoPreview.hidden = true;
                imagePreview.hidden = false;
                imagePreview.src = event.target.result;
            }
            else{
                imagePreview.src = "";
                videoPreview.hidden = false;
                imagePreview.hidden = true;
                videoPreview.src = event.target.result;
            }
        }
    }

    checkLength = () => {
        let text = document.querySelector("#TextContent");
        let counter = document.querySelector("#lengthCounter");
        counter.innerHTML = "Characters " + text.value.length + "/240"
        if (text.value.length > 240){
            counter.style.color = "rgb(141,14,14)";
        }
        else{
            counter.style.color = "rgb(59,134,53)";
        }
        return text.value.length;
    }
}

export{TweetWriter}
import React from "react";
import ReactDOM from "react-dom"
import {Tweet} from "./tweetComponent"
import {RetweetComment} from "./tweetWithCommentComponent"

class TweetRenderer extends React.Component{
    render(){
        this.getTweets();
        return(
            <div>
                <div id={"tweetDiv"}></div>
                <div id={"commentsDIV"}></div>
            </div>
        )
    }
    getTweets = () => {
        let url;
        switch (this.props.param){
            case "userTweets":{
                url = "https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getUserTweets";
                break;
            }
            case "tweetById":{
                url = "https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetById";
                break;
            }
            case "tweetByText":{
                url = "https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetByText";
                break;
            }
            case "feedTweets":{
                url = "https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getFeedTweets";
                break;
            }
            case "comments":{
                url = "https://twitterclone-webii-proyecto3.herokuapp.com/makeApost/getTweetComments";
                break;
            }
            default:{
                break;
            }
        }
        fetch(url, {
            method:"POST",
            body:this.props.body,
            credentials:"include"
        }).then(response => response.json())
        .then(json => {
            if (json.nada){console.log("Nothing to show")}
            else{
                let tweets = [];
                if (this.props.param === "tweetById"){
                    if(json.type === "comment" || json.type === "originalPost" || json.type === "rt")
                        tweets[0] = <Tweet type={json.type} username={json.username} tweetid={json.tweetid} referencedtweet={json.referencedtweet}/>;
                    else if (json.type === "rtWithComment" || json.type === "rtWithComment2")
                        tweets[0] = <RetweetComment type={json.type} tweetid={json.tweetid} username={json.username} referencedtweet={json.referencedtweet}/>
                }
                else{
                    for (let i = 0; i < json.length; i++){
                        if (json[i].type === "rtWithComment"){
                            tweets[i] = <RetweetComment type={json[i].type} tweetid={json[i].tweetid} username={json[i].username} referencedtweet={json[i].referencedtweet}/>;
                        }
                        else{
                            if (json[i].type === "rtWithComment2"){
                                tweets[i] = <RetweetComment type={json[i].type} tweetid={json[i].tweetid} username={json[i].username} referencedtweet={json[i].referencedtweet}/>;
                            }
                            else if (json[i].type === "comment"){
                                if (this.props.renderComments){
                                    tweets[i] = <Tweet type={json[i].type} username={json[i].username} tweetid={json[i].tweetid} referencedtweet={json[i].referencedtweet}/>;
                                }
                            }
                            else{
                                tweets[i] = <Tweet type={json[i].type} username={json[i].username} tweetid={json[i].tweetid} referencedtweet={json[i].referencedtweet}/>;
                            }
                        }
                    }
                }
                if (this.props.renderComments){
                    ReactDOM.render(tweets, document.querySelector("#commentsDIV"));
                }
                else{
                    ReactDOM.render(tweets, document.querySelector("#tweetDiv"));
                }
            }
        })
    }
}

export{TweetRenderer}
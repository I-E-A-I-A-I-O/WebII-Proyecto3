import React from "react"
import ReactDOM from "react-dom"
import {TweetRenderer} from "./tweet"

class FocusTweet extends React.Component{
    render(){
        return(
            <div>
                <div id={"focusedTweetRoot"}></div>
                <div id={"commentsDiv"}></div>
            </div>
        )
    }
    componentDidMount(){
        ReactDOM.render(<TweetRenderer param={"tweetById"} body={this.props.referencedTweet}/>, document.querySelector("#focusedTweetRoot"));
        ReactDOM.render(<TweetRenderer param={"comments"} body={this.props.referencedTweet} renderComments={true}/>, document.querySelector("#commentsDiv"));
    }
}

export{FocusTweet}
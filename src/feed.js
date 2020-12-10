import React from "react"
import ReactDOM from "react-dom"
import {TweetRenderer} from "./tweet"

class FeedPage extends React.Component{
    render(){
        return(
            <div id={"feedDiv"}></div>
        )
    }
    componentDidMount(){
        ReactDOM.render(<TweetRenderer param={"feedTweets"}/>, document.querySelector("#feedDiv"));
    }
}

export{FeedPage}
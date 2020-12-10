import react from "react";
import ReactDOM from "react-dom";
import {FocusTweet} from "./focusedTweet"
import {Profile} from "./Homepage"
import {FeedPage} from "./feed"

class Router extends react.Component{
    render(){
        return(null)
    }
    componentDidMount(){
        switch(this.props.target){
            case "focusedTweet":{
                ReactDOM.render(<FocusTweet referencedTweet={this.props.referencedTweet}/>, document.querySelector("#SecondDiv"));
                break;
            }
            case "profile":{
                ReactDOM.render(<Profile username={document.cookie.split("username=")[1]}/>, document.querySelector("#SecondDiv"));
                break;
            }
            case "feed":{
                ReactDOM.render(<FeedPage/>, document.querySelector("#SecondDiv"));
                break;
            }
            default:{
                break;
            }
        }
    }
}

export{Router}
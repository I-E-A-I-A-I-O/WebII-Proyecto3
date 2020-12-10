import React from "react";
import ReactDOM from "react-dom";
import {Router} from "./routerComponent"
import Main from "./mainPage"

class EditPage extends React.Component{
    render(){
        return(
            <div style={{textAlign:"left"}} >
                <br/><br/>
                <div style={{color:"Highlight"}}>
                    <h3>Edit your current data</h3>
                    <h5>Notes: <br/>* To edit your avatar click on it in your profile page</h5>
                    <h5>* Leave blank fields that shouldn't be edited</h5>
                    <h5>* To make any changes you must insert your current password</h5>
                </div>
                <br/>
                <p id={"message"} style={{color:"red", fontWeight:"bold", fontSize:""}}></p>
                <br/>
                <form id={"newDataForm"}>
                    <label htmlFor={"username"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Username: </label>
                    <input name={"username"} onInput={this.verifyUsernameInput} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"New username..."} type={"text"} />
                    <img id={"usernameCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"mail"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >E-Mail: </label>
                    <input name={"mail"} onInput={this.verifyMailInput} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"New E-Mail..."} type={"mail"} />
                    <img id={"mailCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"currentPass"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Current password: </label>
                    <input onInput={this.verifyCurrentPassInput} name={"currentPass"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your current password..."} type={"password"} />
                    <img id={"currentPassCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"newPass"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >New password: </label>
                    <input onInput={this.verifyNewPassInput} name={"newPass"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your new password..."} type={"password"} />
                    <img id={"newPassCheck"} alt={""} style={{width:"20px"}} src={""}/>
                    <br/><br/>
                    <label htmlFor={"confirmation"} style={{fontWeight:"bold", fontSize:"small", color:"Yellow"}} >Confirm new password: </label>
                    <input onInput={this.verifyNewPassInput} name={"confirmation"} style={{backgroundColor:"black", borderRadius:"10%", color:"yellow", borderColor:"gray"}} placeholder={"Your new password..."} type={"password"} />
                    <img id={"newPassCheck2"} alt={""} style={{width:"20px"}} src={""}/>
                </form>
                <br/>
                <input onClick={this.submit} type={"image"} style={{width:"50px"}} alt={"submit"} src={"https://image.flaticon.com/icons/png/512/223/223120.png"}/>
                <label style={{position:"relative", left:"10px", top:"-20px", fontWeight:"bold", color:"greenyellow"}} >Save changes</label>
                <img alt={""} onClick={this.submitDelete} style={{cursor:"pointer", width:"40px", position: "relative", left:"480px"}} src={"https://vectorified.com/images/delete-icon-png-4.png"}/>
                <label style={{position:"relative", left:"490px", top:"-15px", color:"red", fontWeight:"bold"}} >Delete account</label>
                <input type={"image"} style={{width:"25px"}}/>
                <label id={"accountVisibilityLabel"} style={{position:"relative", left:"490px", top:"-15px", color:"skyblue", fontWeight:"bold"}} ></label>
            </div>
        )
    }
    changeInputCheckmark(elementId, status){
        switch(status){
            case "Correct":{
                document.querySelector("#" + elementId).src = "https://vectorified.com/images/submit-icon-png-37.png";
                break;
            }
            case "Incorrect":{
                document.querySelector("#" + elementId).src = "https://www.shareicon.net/data/2015/09/15/101562_incorrect_512x512.png";
                break;
            }
            case "nada":{
                document.querySelector("#" + elementId).src = "";
                break;
            }
            default:{
                break;
            }
        }
    }
    componentDidMount(){
        this.fetchState();
    }
    fetchState = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/getVisibility", {
            method:"GET",
            credentials:"include"
        }).then(response => response.text())
        .then(text => {
            let label = document.querySelector("#accountVisibilityLabel");
            if (text === "true") label.innerHTML = "Go public";
            else label.innerHTML = "Go private";
        })
    }
    setState = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/setVisibility", {
            method:"GET",
            credentials:"include"
        }).then(() => {
            this.fetchState();
        })
    }
    verifyUsernameInput = () =>{
        let usernameInput = document.querySelector('[name="username"]').value;
        if (usernameInput.length === 0){
            this.changeInputCheckmark("usernameCheck", "nada");
        }
        else if (usernameInput.length > 25){
            this.changeInputCheckmark("usernameCheck", "Incorrect");
        }
        else{
            this.serverSideCheck("usernameCheck", usernameInput);
        }
    }
    verifyMailInput = () => {
        let mailInput = document.querySelector('[name="mail"]').value;
        if (mailInput.length === 0){
            this.changeInputCheckmark("mailCheck", "nada");
        }
        else{
            this.serverSideCheck("mailCheck", mailInput);
        }
    }
    verifyCurrentPassInput = () => {
        let passInput = document.querySelector('[name="currentPass"]').value;
        if (passInput.length === 0){
            this.changeInputCheckmark("currentPassCheck", "Incorrect");
        }
        else{
            this.serverSideCheck("currentPassCheck", passInput);
        }
    }
    verifyNewPassInput = () => {
        let passInput1 = document.querySelector('[name="newPass"]').value;
        let passInput2 = document.querySelector('[name="confirmation"]').value;
        if (passInput1.length === 0 && passInput2.length === 0){
            this.changeInputCheckmark("newPassCheck", "nada");
            this.changeInputCheckmark("newPassCheck2", "nada");
        }
        else if (passInput1 !== passInput2){
            this.changeInputCheckmark("newPassCheck", "Incorrect");
            this.changeInputCheckmark("newPassCheck2", "Incorrect");
        }
        else if ((passInput1.length < 6 || passInput2.length < 6) || 
        (passInput1.length > 32 || passInput2.length > 32)){
            this.changeInputCheckmark("newPassCheck", "Incorrect");
            this.changeInputCheckmark("newPassCheck2", "Incorrect");
        }
        else{
            this.changeInputCheckmark("newPassCheck", "Correct");
            this.changeInputCheckmark("newPassCheck2", "Correct");
        }
    }
    serverSideCheck = (type, input) =>{
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/verify", {
            method:"POST",
            body:JSON.stringify({type:type, input:input}),
            credentials:"include",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(response => response.text())
        .then(text => {
            if (text === "OK.") this.changeInputCheckmark(type, "Correct");
            else this.changeInputCheckmark(type, "Incorrect");
        })
    }
    submit = () => {
        let body = new FormData(document.querySelector("#newDataForm"));
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/submitChanges", {
            method:"POST",
            credentials:"include",
            body:body
        }).then(response => response.text())
        .then(text => {
            if (text === "Changes saved."){
                ReactDOM.render(<Router target={"profile"}/>, document.querySelector("#SecondDiv"));
            }
            else{
                document.querySelector("#message").innerHTML = text;
            }
        })
    }
    submitDelete = () => {
        fetch("https://twitterclone-webii-proyecto3.herokuapp.com/DataEdition/deleteAccount", {
            method:"GET",
            credentials:"include"
        }).then(response => {
            if (response.status === 200){
                response.text().then(text => {
                    if (text === "Goodbye."){
                        this.Logout();
                    }
                })
            }
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

export default EditPage
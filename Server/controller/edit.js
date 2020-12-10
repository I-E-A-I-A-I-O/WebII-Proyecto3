const db = require("../db/postgres");
const del = require("del");
const parseFile = require("./posts");
const emailValidator = require("email-validator");
const encryptor = require("../encrypt/SHA-256");
const multipary = require("multiparty");
const fs = require("fs");

const editTweetText = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "UPDATE tweets SET text = $1 WHERE tweetid = $2";
        let params = [req.body.text, req.body.id];
        db.query(query, params, (err) => {
            if (!err){
                res.status(200).send("Tweet updated.");
            }
            else{
                res.status(500).send(err);
            }
        })
    }
}

const editTweetMedia = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let id = req.headers.option, query, params, mediaState = req.headers.option2;
        if (mediaState === "Delete" || mediaState === "Change"){
            query = "UPDATE tweets SET filelocation = null WHERE tweetid = $1";
            params = [id];
            deleteFile(id, req.session.username);
            db.query(query, params, (err) => {
                if (err){
                    res.status(500).send(err);
                }
                else{
                    if (mediaState === "Delete"){
                        res.status(200).send("Tweet updated.");
                    }
                    else if (mediaState === "Change"){
                        parseFile.parseFile(req, res, req.session.username, id);
                    }
                }
            });
        }
        else if (mediaState === "New"){
            parseFile.parseFile(req, res, req.session.username, id);
        }
    }
}

const deleteTweet = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM tweets WHERE tweetid = $1";
        let params = [req.body];
        db.query(query, params, (err, success) => {
            if (!err){
                if (success.rows[0].filelocation){
                    deleteFile(req.body, req.session.username);
                }
                query = "DELETE FROM tweets WHERE tweetid = $1";
                db.query(query, params, (error) => {
                    if (!error){
                        res.status(200).send("Tweet deleted.");
                    }
                    else{
                        res.status(500).send(error);
                    }
                })
            }
            else{
                res.status(500).send(err);
            }
        })
    }
}

const deleteFile = (id, username) => {
    let path = "Server/media/tweets/" + username + "/" + id;
    del.sync([path + "/**", "!Server/media/tweets/" + username]);
}

const verifyInput = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query, params = [];
        switch(req.body.type){
            case "usernameCheck":{
                query = "SELECT username FROM registeredUsers WHERE username = $1";
                params = [req.body.input];
                checkDatabase(res, params, query, "username");
                break;
            }
            case "mailCheck": {
                if (emailValidator.validate(req.body.input)){
                    res.status(200).send("OK.");
                }
                else{
                    res.status(200).send("E-Mail is not valid.");
                }
                break;
            }
            case "currentPassCheck":{
                let query = "SELECT password FROM registeredUsers WHERE username = $1 AND password = $2";
                let params = [req.session.username, encryptor.encrypt(req.body.input)];
                checkDatabase(res, params, query, "password");
                break;
            }
            default:{
                res.status(500).send("Undefined type.");
                break;
            }
        }
    }
}

const checkDatabase = (res, params, query, type) => {
    db.query(query, params, (err, success) => {
        if (!err){
            if (type === "username"){
                if (success.rows.length > 0){
                    res.status(200).send("Username not available.");
                }
                else{
                    res.status(200).send("OK.");
                }
            }
            else{
                if (success.rows.length === 0){
                    res.status(200).send("Incorrect password.");
                }
                else{
                    res.status(200).send("OK.");
                }
            }
        }
        else{
            res.status(500).send(err);
        }
    })
}

const changeUserData = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let form = new multipary.Form();
        let query, params = [], newFields = {};
        form.parse(req, (err, fields) => {
            if (err){
                req.status(500).send(err);
            }
            else{
                let {username, mail, currentPass, newPass} = fields;
                username = separateData(username);
                mail = separateData(mail);
                currentPass = encryptor.encrypt(separateData(currentPass));
                newPass = separateData(newPass);
                if (username !== "") newFields.username = username;
                if (mail !== "") newFields.mail = mail;
                if (newPass !== "") newFields.newPass = newPass;
                if (Object.keys(newFields).length === 0){
                    res.status(200).send("No changes made.");
                }
                else{
                    query = "SELECT password FROM registeredUsers WHERE username = $1";
                    params = [req.session.username];
                    db.query(query, params, (err, success) => {
                        if (!err){
                            if (currentPass === success.rows[0].password){
                                insertChanges(res, newFields, req);
                            }
                            else{
                                res.status(403).send("Incorrect password.");
                            }
                        }
                        else{
                            res.status(500).send(err);
                        }
                    })
                }
            }
        })
    }
}

const insertChanges = (res, fields, req) => {
    let promises = [];
    if (fields.newPass){
        let query = "UPDATE registeredUsers SET password = $1 WHERE username = $2";
        let params = [encryptor.encrypt(fields.newPass), req.session.username];
        promises.push(db.queryAsync(query, params));
    }
    if (fields.mail){
        let query = "UPDATE registeredUsers SET email = $1 WHERE username = $2";
        let params = [fields.mail, req.session.username];
        promises.push(db.queryAsync(query, params));
    }
    if (fields.username){
        let query = "UPDATE registeredUsers SET username = $1 WHERE username = $2";
        let params = [fields.username, req.session.username];
        promises.push(db.queryAsync(query, params));
        
    }
    Promise.all(promises).then(results => {
        req.session.username = fields.username;
        res.status(200).send("Changes saved.");
    }).catch(err => {
        res.status(500).send(err);
    })
}

const separateData = (field) => {
    field = JSON.stringify(field);
    field = field.split('"')[1];
    field = field.split('"')[0];
    return field;
}

const deleteAccount = (req, res) => {
    let promises = [], query = "DELETE FROM registeredUsers WHERE username = $1", 
    params = [req.session.username];
    if (fs.existsSync("Server/media/tweets/" + req.session.username)){
        promises.push(del(["Server/media/tweets/" + req.session.username + "/**", "!Server/media/tweets"]));
    }
    promises.push(db.queryAsync(query, params));
    Promise.all(promises).then(response => {
        res.status(200).send("Goodbye.");
    }).catch(err => {
        res.status(500).send(err);
    })
}

const accountState = (req, res) => {
    getVisibility(req.session.username, false, res);
}

const getVisibility = (username, change, response) => {
    let query = "SELECT private FROM registeredUsers WHERE username = $1";
    let params = [username];
    db.query(query, params, (err, res) => {
        if (!err){
            if (change) submitState(username, res.rows[0].private, response);
            else{
                if (res.rows[0].private) response.status(200).send("true");
                else response.status(200).send("false");
            }
        }
        else{
            return null;
        }
    })
}

const submitState = (username, state, res) => {
    let query, params = [];
    query = "UPDATE registeredUsers SET private = $1 WHERE username = $2";
    params = [!state, username];
    db.query(query, params, (err) => {
        if (!err){
            res.status(200).send("Visibility changed");
        }
        else{
            res.status(500).send(err);
        }
    })
}

const changeState = (req, res) => {
    getVisibility(req.session.username, true, res);
}

module.exports = {editTweetText, changeState, accountState, editTweetMedia, changeUserData, deleteTweet, verifyInput, deleteAccount}

const db = require("../db/postgres");
const multiparty = require("multiparty");
const fs = require("fs");

const postTweetText = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query;
        let params
        if (req.headers.option !== "nada"){
            query = "INSERT INTO tweets(username, text, tweet_date, referencedtweet, type) VALUES($1, $2, now(), $3, $4) RETURNING tweetid";
            params = [req.session.username, req.body.text, req.headers.option, req.body.type];
        }
        else{
            query = "INSERT INTO tweets(username, text, tweet_date, type) VALUES($1, $2, now(), $3) RETURNING tweetid";
            params = [req.session.username, req.body.text, req.body.type];
        }
        db.query(query, params, (err, success) => {
            if (!err){
                res.status(200).send("" + success.rows[0].tweetid);
            }
            else{
                console.log(err.error);
                res.status(500).send(err);
            }
        })
    }
}

const postTweetMedia = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let username = req.session.username;
        let tweetid = req.headers.option;
        parseFile(req, res, username, tweetid);
    }
}

const parseFile = (req, res, username, tweetid) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        let type = files.tweetMedia[0].originalFilename.split(".")[1];
        let filePath = "Server/media/tweets/" + username + "/" + tweetid;
        fs.mkdirSync(filePath, {recursive: true});
        let absolutePath = filePath + "/" + req.session.username + "." + type;
        fs.readFile(files.tweetMedia[0].path, (err, data) => {
            if (err) console.log(err);
            else{
                fs.writeFile(absolutePath, data, (err) => {
                    if (err) console.log(err);
                })
                fs.unlink(files.tweetMedia[0].path, (err) => {
                    if (err) console.log(err);
                })
            }
        })
        let query = "UPDATE tweets SET filelocation = $1 WHERE tweetid = $2";
        let params = [absolutePath, tweetid];
        db.queryAsync(query, params).then( () => {
            res.status(200).send("Tweet posted.");
        }).catch (err => {
            console.log(err);
            res.status(500).send(err);
        })
    })
}

const getUserTweets = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM tweets WHERE username = $1 ORDER BY tweet_date DESC";
        let params = [req.body];
        db.query(query, params, (err, success) => {
            if (!err){
                res.status(200).send(success.rows);
            }
            else{
                console.log(err.error);
                res.status(500).send(err);
            }
        })
    }
}

const getTweetById = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM tweets WHERE tweetid = $1";
        let params = [req.body];
        db.query(query, params, (err, success) => {
            if (!err){
                res.status(200).send(success.rows[0]);
            }
            else{
                console.log(err);
                res.status(500).send(err);
            }
        })
    }
}

const getFeedTweets = (results, res) => {
    let query = "SELECT * FROM tweets WHERE username = ANY($1::varchar[]) ORDER BY tweet_date DESC";
    let params = [results];
    db.query(query, params, (err, success) => {
        if (!err){
            res.status(200).send(success.rows);
        }
        else{
            console.log(err.error);
            res.status(500).send(err);
        }
    })
}

const getUserList = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT followsuser FROM follows WHERE username = $1";
        let params = [req.session.username];
        db.query(query, params, (err, success) => {
            if (!err){
                let results = [];
                for (let i = 0; i < success.rows.length; i++){
                    results[i] = success.rows[i].followsuser;
                }
                results.push(req.session.username);
                getFeedTweets(results, res);
            }
            else{
                console.log(err.error);
                res.status(500).send(err);
            }
        })
    }
}

const getTweetByText = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM tweets WHERE text like $1 ORDER BY tweet_date DESC";
        let params = ['%' + req.body + '%'];
        db.query(query, params, (err, success) => {
            if (!err){
                res.send(success.rows);
            }
            else{
                res.status(500).send(err);
            }
        })
    }
}

const getComments = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM tweets WHERE referencedtweet = $1 AND type = $2";
        let params = [req.body, "comment"];
        db.query(query, params, (err, success) => {
            if (!err){
                res.status(200).send(success.rows);
            }
            else{
                res.status(500).send(err);
            }
        })
    }
}

const newLike = (body, username, res) => {
    let query = "INSERT INTO likes VALUES($1, $2, $3)";
    let params = [username, body.id, body.action];
    db.query(query, params, (err, success) => {
        if (!err){
            res.status(200).send(success.rows);
        }
        else{
            res.status(500).send(err);
        }
    })
}

const changeStatus = (body, username, currentStatus, res) => {
    let query;
    let params = [body.id, username];
    switch(currentStatus){
        case "Like":{
            if (body.action === "Like"){
                query = "DELETE FROM likes WHERE referencedTweet = $1 AND username = $2";
            }
            else{
                query = "UPDATE likes SET action = 'Dislike' WHERE referencedtweet = $1 AND username = $2";
            }
            break;
        }
        case "Dislike":{
            if (body.action === "Like"){
                query = "UPDATE likes SET action = 'Like' WHERE referencedtweet = $1 AND username = $2";
            }
            else{
                query = "DELETE FROM likes WHERE referencedTweet = $1 AND username = $2";
            }
            break;
        }
        default:{
            break;
        }
    }
    db.query(query, params, (err, success) => {
        if (!err){
            res.status(200).send("State updated.");
        }
        else{
            console.log(err);
            res.status(500).send(err);
        }
    })
}

const verifyLikeStatus = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM likes WHERE referencedtweet = $1 AND username = $2";
        let params = [req.body.id, req.session.username];
        db.query(query, params, (err, success) => {
            if (!err){
                if (success.rows.length < 1){
                    newLike(req.body, req.session.username, res);
                }
                else{
                    changeStatus(req.body, req.session.username, success.rows[0].action, res);
                }
            }
            else{
                console.log(err);
                res.status(500).send(err);
            }
        })
    }
}

const InteractionCount = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query;
        let params = [req.body.id];
        switch(req.body.type){
            case "Like":{
                query = "SELECT * FROM likes WHERE referencedtweet = $1 AND action = 'Like'";
                break;
            }
            case "Dislike":{
                query = "SELECT * FROM likes WHERE referencedtweet = $1 AND action = 'Dislike'";
                break;
            }
            case "Comments":{
                query = "SELECT * FROM tweets WHERE referencedtweet = $1 AND type = 'comment'";
                break;
            }
            case "Shares":{
                query = "SELECT * FROM tweets WHERE referencedtweet = $1 AND (type = 'rt' OR type = 'rtWithComment' OR type = 'rtWithComment2')";
                break;
            }
            default:{
                break;
            }
        }
        db.query(query, params, (err, success) => {
            if (!err){
                res.status(200).send("" + success.rows.length);
            }
            else{
                res.status(500).send(err);
            }
        })
    }
}

module.exports = {
    postTweetText, 
    getComments, 
    postTweetMedia,
    getUserTweets, 
    getTweetById, 
    getUserList, 
    getTweetByText,
    verifyLikeStatus,
    InteractionCount,
    parseFile
}

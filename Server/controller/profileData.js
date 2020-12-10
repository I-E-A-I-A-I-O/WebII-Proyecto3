const db = require("../db/postgres");

const getUserData = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        getFollowers(res, req.body);
    }
}

const getFollowers = (res, username) => {
    let query = "SELECT username FROM follows WHERE followsuser = $1";
    let params = [username];
    db.query(query, params, (err, success) => {
        if (!err){
            userFollows(res, username, success.rows.length);
        }
    })
}

const userFollows = (res, username, followers) => {
    let query = "SELECT followsuser FROM follows WHERE username = $1";
    let params = [username];
    db.query(query, params, (err, success) => {
        if (!err){
            res.json({followers:followers, follows: success.rows.length});
        }
    })
}

const getUsernames = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT username FROM registeredUsers WHERE username like $1"
        let params = ['%' + req.body + '%'];
        db.query(query, params, (err, success) => {
            if (!err){
                if (success.rows.length > 0){
                    for (let i = 0; i < success.rows.length; i++){
                        if (i === success.rows.length - 1) {
                            res.write("username" + i + " : " + success.rows[i].username);
                        }
                        else{
                            res.write("username" + i + " : " + success.rows[i].username + "|");
                        }
                    }
                    res.end();
                }
            }
        })
    }
}

const isFollowing = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM follows WHERE username = $1 AND followsuser = $2";
        let params = [req.session.username, req.body];
        db.query(query, params, (err, success) => {
            if (!err){
                if (success.rows.length > 0) res.send("True");
                else res.send("False");
            }
        })
    }
}

const Follow = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let query = "SELECT * FROM follows WHERE username = $1 AND followsuser = $2";
        let params = [req.session.username, req.body];
        db.query(query, params, (err, success) => {
            if (!err){
                if (success.rows.length > 0) {
                    query = "DELETE FROM follows WHERE username = $1 AND followsuser = $2"
                    db.query(query, params, (err) => {
                        if (!err){
                            res.status(200).send("Unfollowed");
                        }
                    })
                }
                else{
                    query = "INSERT INTO follows VALUES($1, $2)";
                    db.query(query, params, (err) => {
                        if (!err){
                            res.status(200).send("Following");
                        }
                    })
                }
            }
        })
    }
}

module.exports = {getUserData, getUsernames, isFollowing, Follow}
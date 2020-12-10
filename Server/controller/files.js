const fs = require("fs");
const multiparty = require("multiparty");
const del = require("del");
const db = require("../db/postgres");

const changeAvatar = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let form = new multiparty.Form();
        if (fs.existsSync("Server/media/avatars/" + req.session.username)){
            del.sync("Server/media/avatars/" + req.session.username);
        }
        form.parse(req, (err, fields, files) => {
            let type = files.newAvatar[0].originalFilename.split(".")[1];
            let filePath = "Server/media/avatars/" + req.session.username;
            fs.mkdirSync(filePath);
            let absolutePath = "Server/media/avatars/" + req.session.username + "/" + req.session.username + "." + type;
            fs.renameSync(files.newAvatar[0].path, absolutePath);
            let query = "UPDATE registeredUsers SET hasavatar = $1, avatarpath = $2 WHERE username = $3";
            let params = [true, absolutePath, req.session.username];
            db.query(query, params, (err) => {
                if (!err){
                    res.status(200).send("Profile picture updated.");
                }
            })
        })
    }
}

const downloadAvatar = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        if (req.body === ""){
            res.status(500).send("Body is empty");
        }
        else{
            let query = "SELECT hasavatar, avatarpath FROM registeredUsers WHERE username = $1";
            let params = [req.body];
            db.query(query, params, (err, success) => {
                let path = "Server/media/avatars/noAvatar.jpeg";
                if (!err){
                    if(success.rows[0].hasavatar){
                        if (fs.existsSync(success.rows[0].avatarpath)){
                            path = success.rows[0].avatarpath;
                        }
                    }
                }
                let fileType = path.split(".")[1];
                fileType = (fileType === "jpeg" || fileType === "png" || fileType === "gif") ? "image/" + fileType : "video/mp4";
                let data = fs.readFileSync(path, {}, (err, data) => {
                    if (!err) return data;
                    else return false;
                });
                res.setHeader("Content-Type", fileType);
                res.send(data);
            })
        }
    }
}

const downloadMedia = (req, res) => {
    if (!req.session.username){
        res.status(403).send("Unauthorized user.");
    }
    else{
        let filelocation = req.body;
        let fileType = req.body.split(".")[1];
        fileType = (fileType === "jpeg" || fileType === "png" || fileType === "gif") ? "image/" + fileType : "video/mp4";
        let data = fs.readFileSync(filelocation, {}, (err, data) => {
            if (!err) return data;
            else return false;
        });
        res.setHeader("Content-Type", fileType);
        res.send(data);
    }
}

module.exports = {
    downloadAvatar, changeAvatar, downloadMedia
}

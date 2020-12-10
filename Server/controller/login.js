const db = require("../db/postgres");
const encryptor = require("../encrypt/SHA-256");
const multiparty = require("multiparty");

const verify = (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) =>{
        let {Username, Password} = fields;
        Username = JSON.stringify(Username);
        Password = JSON.stringify(Password);
        Username = Username.split('"')[1];
        Username = Username.split('"')[0];
        Password = Password.split('"')[1];
        Password = Password.split('"')[0];
        let encryptedPass = encryptor.encrypt(Password);
        let query = "SELECT password FROM registeredUsers WHERE username = $1";
        let params = [Username];
        db.query(query, params, (err, success) => {
            if (err){
                res.status(500).send(err);
            }
            else{
                if (success.rows.length < 1) res.status(403).send("User not found.");
                else{
                    if (success.rows[0].password !== encryptedPass){
                        res.status(403).send("Incorrect password.");
                    }
                    else{
                        let session = req.session;
                        session.username = Username;
                        res.status(200).send("Login successful");
                    }
                }
            }
        })
    })
}

const LoggedIn = (req, res) => {
    let session = req.session;
    if (session.username) res.status(200).send("True");
    else res.status(200).send("False");
}

const LogOut = (req, res) => {
    req.session.destroy(err => {
        if (err) res.status(500).send(err);
        res.status(200).send("Logged out");
    });
}

module.exports = {
    verify, LoggedIn, LogOut
}
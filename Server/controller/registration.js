const db = require("../db/postgres");
const encryptor = require("../encrypt/SHA-256");
const emailValidator = require("email-validator");
const multiparty = require("multiparty");

const registerUser = (Username, Email, Password, res) => {
    let queryString = "INSERT INTO registeredUsers(username, email, password, private) VALUES($1, $2, $3, 'false')";
    let params = [Username, Email, encryptor.encrypt(Password)];
    db.query(queryString, params, (err) => {
        if (err){
            console.log(err.stack);
            res.status(500).send(err);
        }
        else{
            console.log("User: " + Username + ". Registered at " + Date());
            res.status(200).send("Registration completed.");
        }
    })
}

const checkDuplicate = (req, res) => {
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
        let {Username, Mail, Password} = fields;
        Username = JSON.stringify(Username);
        Mail = JSON.stringify(Mail);
        Password = JSON.stringify(Password);
        Username = Username.split('"')[1];
        Username = Username.split('"')[0];
        Mail = Mail.split('"')[1];
        Mail = Mail.split('"')[0];
        Password = Password.split('"')[1];
        Password = Password.split('"')[0];
        let queryString = "SELECT username FROM registeredUsers WHERE username = $1";
        let param = [Username];
        if (Username.length < 1) {
            res.status(403).send("Username required. Registration failed.");
        } 
        else if (Username.length > 25) {
            res.status(403).send("Username too long. Registration failed.");
        } 
        else {
            if (validatePassword(Password)) {
                db.query(queryString, param, (error, success) => {
                    if (error) {
                        res.status(500).send(err);
                    } 
                    else {
                        if (success.rows.length === 0) {
                            if (emailValidator.validate(Mail)){
                                registerUser(Username, Mail, Password, res);
                            }
                            else{
                                res.status(403).send("E-Mail direction is invalid.");
                            }
                        } 
                        else res.status(403).send("Username already exists.");
                    }
                })
            } 
            else {
                res.status(403).send("Password length must be between 6 to 32 characters. Registration failed");
            }
        }
    })
}

const validatePassword = (passwordToValidate) => {
    return !(passwordToValidate.length < 6 || passwordToValidate.length > 32);
}

module.exports = {
    registerUser, checkDuplicate
}
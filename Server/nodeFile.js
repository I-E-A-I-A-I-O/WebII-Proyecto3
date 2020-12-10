const express =  require('express');
const registrationRoute = require("./route/registration");
const fileManager = require("./route/files");
const profileManager = require("./route/profileData");
const posts = require("./route/posts");
const dataEdit = require("./route/edit");
const path = require("path");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(express.text());
app.use(express.json());
app.use(session({secret:'justdanceSecret', saveUninitialized:false, resave:false}));

app.use(express.static(path.join(__dirname, 'build')));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://twitterclone-webii-proyecto3.herokuapp.com");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Option, Option2");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use("/loginSingUp", registrationRoute);
app.use("/fileManager", fileManager);
app.use("/profileData", profileManager);
app.use("/makeApost", posts);
app.use("/DataEdition", dataEdit);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(port, () => {
    console.log(`Listening on port " + ${port}`);
})
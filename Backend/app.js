const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const session = require('express-session')({
    secret: "Kitumahoa",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7*24*60*60*1000
    }
});
const multer = require('multer');
const path = require('path');

const sharedsession = require("express-socket.io-session");

const app = express();

app.use(cors({origin:['http://localhost:3000'], credentials: true}))
app.use(session);

if(0)
    app.use("/", (req, res, next) => {
        if(!req.session.userInfo)
            req.session.userInfo = {
                "_id":"5e4671580a2f561b50cc2e2b",
                "email":"ngocdrakula1@gmail.com",
                "username":"Admintranstors",
                "name":"Ngocdrakula",
                "last":1584363434165
            };
        next();
    });
app.use(express.static("File"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({}));

mongoose.connect('mongodb://localhost/trang8',
    {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("DB conected!")
        }
    }
);

app.use((req, res, next) => {
    if(req.session.userInfo)
        if(Date.now() > req.session.userInfo.last + 1000*60*5){
            req.session.userInfo.last = Date.now();
            io.sockets.emit('online', {
                _id: req.session.userInfo._id,
                username: req.session.userInfo.username
            });
        }
    next();
});
app.get("/", (req, res) =>{
    res.sendFile("HTML/index.html", { root: __dirname });
});
const profileRouter = require("./routers/profile");
app.use("/profile", profileRouter);

const conversationRouter = require("./routers/conversation");
app.use("/conversation", conversationRouter);

const userRouter = require("./routers/user");
app.use("/user", userRouter);

const postRouter = require("./routers/post");
app.use("/post", postRouter);

const imageRouter = require("./routers/image");
app.use("/image", imageRouter);

const apiRouter = require("./routers/api");
app.use("/api", apiRouter);

server = app.listen(1505, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Server start!");
    }
});
const io = require("socket.io")(server);
io.use(sharedsession(session, {
    autoSave:true
}));
app.set('socketio', io);
io.on('connection', (socket) => {
    socket.on('online', (data) => {
        if(socket.handshake.session.userInfo){
            var userInfo = socket.handshake.session.userInfo;
            io.sockets.emit('online', {
                _id: userInfo._id,
                username: userInfo.username
            });
        }
    });
});

app.use("", (req, res) => {
    res.sendFile("HTML/404.html", { root: __dirname });
});
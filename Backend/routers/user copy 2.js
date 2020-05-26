const express = require('express');
const userController = require('../controllers/user');


const userRouter = express.Router();

userRouter.post("/login", (req, res) => {
    const {email, username, password} = req.body;
    if(email){
        userController.find({email: {$regex: new RegExp(email, "i")}}).then(user => {
            if(password == user.password){
                req.session.userInfo = {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    last: Date.now()
                }
                var io = req.app.get('socketio');
                io.emit('noti', {
                    _id: user._id,
                    username: user.username,
                    string: 'vừa đăng nhập lại'
                });
                res.json({
                    success: true,
                    data: email
                });
            }
            else{
                res.json({
                    success: false,
                    key: 1,
                    err: `Mật khẩu không chính xác!`
                })
            }
        }).catch(err => {
            res.json({
                success: false,
                key: 0,
                err: `Tài khoản ${email} không tồn tại!`
            });
        })
    }
    else if(username){
        userController.find({username: {$regex: new RegExp(username, "i")}}).then(user => {
            if(password == user.password){
                req.session.userInfo = {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    name: user.name,
                    last: Date.now()
                }
                var io = req.app.get('socketio');
                io.emit('noti', {
                    _id: user._id,
                    username: user.username,
                    string: 'vừa đăng nhập lại'
                });
                res.json({
                    success: true,
                    data: username
                })
            }
            else{
                res.json({
                    success: false,
                    key: 1,
                    err: `Mật khẩu không chính xác!`
                })
            }
        }).catch(err => {
            res.json({
                success: false,
                key: 0,
                err: `Nickname ${username} không tồn tại!`
            })
        })
    }
})

userRouter.post("/register", (req, res) => {
    const {email, username, password, name} = req.body;
    userController.find({$or : [{email: {$regex: new RegExp(email, "i")}}, {username: {$regex: new RegExp(username, "i")}}]})
    .then(userChecking => {
        if(userChecking.email.toLowerCase() == email.toLowerCase()){
            res.json({
                success: false,
                key: 0,
                err: `Email ${email} đã được đăng kí!`
            });
        }
        else{
            res.json({
                success: false,
                key: 2,
                err: `Nickname ${username} đã được sử dụng!`
            });
        }
    }).catch(err => {
        userController.create({email, username, password, name})
        .then(user => {
            req.session.userInfo = {
                _id: user._id,
                email: email,
                username: username,
                name: user.name,
                last: Date.now()
            }
            var io = req.app.get('socketio');
            io.emit('noti', {
                _id: user._id,
                username: user.username,
                string: 'vừa trở thành thành viên của Trang8.'
            });
            res.json({
                success: true,
                data: user
            });
        }).catch(err => {
            var note = null;
            var key = Object.keys(err.keyValue)[0];
            if(key == "email"){
                key = 0;
                note = `Email ${email} đã được đăng kí!`;
            }
            else if(key == "username"){
                key = 2;
                note = `Nickname ${username} đã được sử dụng!`;
            }
            res.json({
                success: false,
                key: key,
                err: note
            });
        });
    });
});
userRouter.get("/logout", (req, res) => {
    if(req.session.userInfo){
        var io = req.app.get('socketio');
        io.emit('noti', {
            _id: req.session.userInfo._id,
            username: req.session.userInfo.username,
            string: 'vừa đăng xuất'
        });
    }
    req.session.userInfo = null;
    res.redirect("/");
});
userRouter.get("/data-userinfo.js", (req, res) => {
    res.setHeader('content-type', 'text/javascript');
    res.send(`export default ${JSON.stringify(req.session.userInfo)}`);
});
userRouter.get("/userinfo", (req, res) => {
    res.json(req.session.userInfo);
});

module.exports = userRouter;
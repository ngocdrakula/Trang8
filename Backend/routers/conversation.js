const express = require('express');
const path = require('path');
const userController = require('../controllers/user');
const conController = require('../controllers/conversation');

const conversationRouter = express.Router();

conversationRouter.get("/", (req, res) => {
    var userinfo = req.session.userInfo;
    if(userinfo){
        userController.get({_id: userinfo._id})
        .populate('conversation.to', 'username')
        .populate({
            path: 'conversation.conversation',
            select: {
                message: { "$slice": -1 },
            },
        })
        .then(user => {
            res.json({
                success: true,
                data: user.conversation
            });
        }).catch(err => {
            res.json({
                success: false,
                err: err
            });
        });
    }
    else
        res.json({
            success: false,
            loged: false,
            err: "Bạn chưa đăng nhập"
        });
});
conversationRouter.get('/read/:id', (req, res) => {
    var _id = req.params.id;
    var userinfo = req.session.userInfo;
    if(userinfo){
        userController.get({_id: userinfo._id})
        .then(user => {
            var conversation = user.conversation.find(con => {return con.to == _id});
            if(conversation){
                conController.get({_id: conversation.conversation})
                .then(messageList => {
                    if(messageList.leader.user == userinfo._id){
                        messageList.leader.seen = Date.now();
                    }
                    else{
                        messageList.member.seen = Date.now();
                    }
                    messageList.save()
                    .then(messageSaved => {
                        var io = req.app.get('socketio');
                        io.emit(userinfo._id, {
                            type: "read",
                            to: _id,
                            time: Date.now()
                        });
                        res.json({
                            success: true
                        });
                    }).catch(err => {
                        res.json({
                            success: false,
                            err: err,
                            code: 'can not save',
                            messageList: messageList
                        });
                    })
                }).catch(err => {
                    res.json({
                        success: false,
                        err: err,
                        code: 'can not get con'
                    });
                });
            }
            else
                res.json({
                    success: true
                });
        });
    }
    else{
        res.json({
            success: false,
            loged: false,
            err: "Bạn chưa đăng nhập"
        });
    }
});
conversationRouter.get('/:id', (req, res) => {
    var _id = req.params.id;
    var order = req.query.order * 10;
    if(order < 0) order = 0;
    var userinfo = req.session.userInfo;
    if(userinfo){
        userController.get({_id: userinfo._id})
        .then(user => {
            var conversation = user.conversation.find(con => {return con.to == _id});
            if(conversation){
                conController.get({_id: conversation.conversation})
                .then(messageList => {
                    var condition, start, end;
                    var mesLength = messageList.message.length;
                    if(mesLength < order) end = mesLength;
                    else end = mesLength - order;
                    if(mesLength < order + 10) start = 0;
                    else start = mesLength - order - 10;
                    if(order == 0){
                        while(!condition && mesLength >0){
                            if(messageList.message[mesLength - 1].author == userinfo._id || messageList.message[mesLength - 1].status == 1 || mesLength == 1){
                                condition = 1;
                            }
                            mesLength = mesLength - 1;
                        }
                        start = Math.min(start, mesLength)
                    }
                    messageList.message = messageList.message.slice(start, end);
                    res.json({
                        success: true,
                        order: order,
                        data: messageList
                    });
                }).catch(err => {
                    res.json({
                        success: false,
                        err: err
                    });
                });
            }
            else
                res.json({
                    success: true
                });
        });
    }
    else{
        res.json({
            success: false,
            loged: false,
            err: "Bạn chưa đăng nhập"
        });
    }
});
conversationRouter.post('/', (req, res) => {
    var {to, message} = req.body;
    var userinfo = req.session.userInfo;
    if(userinfo && to && message && userinfo._id != to){
        userController.get({_id: userinfo._id})
        .then(user => {
            var conversation = user.conversation.find(con => {return con.to == to});
            if(conversation){
                conController.get({_id: conversation.conversation})
                .then(messageList => {
                    messageList.message.push({
                        author: userinfo._id,
                        message: message
                    });
                    messageList.save()
                    .then(messageSaved => {
                        var io = req.app.get('socketio');
                        io.emit(to, {
                            type: "message",
                            to: {
                                _id: userinfo._id,
                                username: userinfo.username
                            }
                        });
                        io.emit(userinfo._id, {
                            type: "mymessage",
                            to: to
                        });
                        messageSaved.message = messageSaved.message.slice(-1);
                        res.json({
                            success: true,
                            data: messageSaved
                        });
                    }).catch(err => {
                        res.json({
                            success: false,
                            err: err,
                            error: "Can't save 1"
                        });
                    })
                }).catch(err => {
                    res.json({
                        success: false,
                        err: err,
                        code: 'Loi 2'
                    });
                });
            }
            else{
                userController.get({_id: to})
                .then(userTo => {
                    conController.create({
                        leader:{
                            user: userinfo._id,
                            seen: Date.now()
                        },
                        member:{
                            user: userTo._id,
                            seen: Date.now()
                        },
                        message: [{
                            author: userinfo._id,
                            message: message
                        }]
                    }).then(conCreated => {
                        userTo.conversation.push({
                            to: userinfo._id,
                            conversation: conCreated._id
                        });
                        userTo.save()
                        .then(conToSaved => {
                            user.conversation.push({
                                to: to,
                                conversation: conCreated._id
                            });
                            user.save()
                            .then(conSaved => {
                                var io = req.app.get('socketio');
                                io.emit(to, {
                                    type: "message",
                                    to: {
                                        _id: userinfo._id,
                                        username: userinfo.username
                                    }
                                });
                                io.emit(userinfo._id, {
                                    type: "mymessage",
                                    to: to
                                });
                                res.json({
                                    success: true,
                                    data: conCreated
                                })
                            }).catch(err => {
                                res.json({
                                    success: false,
                                    err: err,
                                    code: 'Khong the luu user'
                                })
                            })
                        })
                        .catch(err => {
                            res.json({
                                success: false,
                                err: err,
                                code: 'Khong the luu To'
                            })
                        })
                    })
                    .catch(err => {
                        res.json({
                            success: false,
                            err: err,
                            code: 'Khong the tim thay user'
                        })
                    })
                })
                .catch(err => {
                    res.json({
                        success: false,
                        err: err,
                        code: "Không tìm thấy người dùng"
                    })
                })
            }
        }).catch(err => {
            res.json({
                success: false,
                err: err,
                code: "Đã xảy ra lỗi. Vui lòng reload trang và thử lại!"
            });
        });
    }
    else res.json({
        success: false,
        loged: false,
        err: "Bạn chưa đăng nhập"
    })
});
module.exports = conversationRouter;
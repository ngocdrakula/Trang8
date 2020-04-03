const express = require('express');
const path = require('path');
const userController = require('../../controllers/user');

const profileRouter = express.Router();

profileRouter.put('/relation', (req, res) => {
    const {to, type} = req.body;
    var userInfo = req.session.userInfo;
    if(userInfo && to && type){
        userController.get({_id: to})
        .then(user => {
            if(!user){
                res.json({
                    success: false,
                    err: "Kết bạn không thành công. Người dùng không tồn tại"
                });
            }
            else{
                var errKey;
                if(type == 'addfriend' || type == 'unfriend' || type == 'acceptfriend'){
                    var index = user.relation.friends.findIndex(friend => {
                        return friend.friend == userInfo._id;
                    });
                    if(index < 0 && type == 'addfriend'){
                        user.relation.friends.push({
                            friend: userInfo._id,
                            friendship: 0
                        });
                    }
                    else if(index >= 0 && type == 'acceptfriend' && user.relation.friends[index].friendship == 2){
                        user.relation.friends[index].friendship = 1;
                    }
                    else if(index >= 0 && type == 'unfriend'){
                        user.relation.friends.splice(index, 1);
                    }
                    else errKey = {
                        on: "user",
                        index: index,
                        key: type
                    };
                }
                else if(type == 'addfollow' || type == 'unfollow'){
                    var index = user.relation.fans.findIndex(fan => {
                        return fan == userInfo._id;
                    });
                    if(index < 0 && type == 'addfollow'){
                        user.relation.fans.push(userInfo._id);
                    }
                    else if(index >= 0 && type == 'unfollow'){
                        user.relation.fans.splice(index, 1);
                    }
                    else errKey = {
                        on: "user",
                        index: index,
                        key: type
                    }
                }
                else{
                    res.json({
                        on: "user",
                        key: type,
                        code: "Type action is undefined"
                    })
                }
                if(errKey){
                    res.json(errKey);
                }
                else{
                    user.save()
                    .then(userUpdated => {
                        userController.get({_id: userInfo._id})
                        .then(author => {
                            var errorKey;
                            if(type == 'addfriend' || type == 'unfriend' || type == 'acceptfriend'){
                                var index = author.relation.friends.findIndex(friend => {
                                    return friend.friend == to;
                                });
                                if(index < 0 && type == 'addfriend'){
                                    author.relation.friends.push({
                                        friend: to,
                                        friendship: 2
                                    });
                                }
                                else if(index >= 0 && type == 'acceptfriend' && author.relation.friends[index].friendship == 0){
                                    author.relation.friends[index].friendship = 1;
                                }
                                else if(index >= 0 && type == 'unfriend'){
                                    author.relation.friends.splice(index, 1);
                                }
                                else errorKey = {
                                    on: "author",
                                    index: index,
                                    key: type
                                };
                            }
                            else if(type == 'addfollow' || type == 'unfollow'){
                                var index = author.relation.follows.findIndex(follower => {
                                    return follower == to;
                                });
                                if(index < 0 && type == 'addfollow'){
                                    author.relation.follows.push(to);
                                }
                                else if(index >= 0 && type == 'unfollow'){
                                    author.relation.follows.splice(index, 1);
                                }
                                else errorKey = {
                                    on: "author",
                                    index: index,
                                    key: type
                                }
                            }
                            else{
                                res.json({
                                    on: "author",
                                    key: type,
                                    code: "Type action is undefined"
                                })
                            }
                            if(errorKey){
                                res.json(errorKey);
                            }
                            else{
                                author.save()
                                .then(authorUpdated => {
                                    var io = req.app.get('socketio');
                                    if(['addfriend', 'unfriend', 'acceptfriend'].includes(type)){
                                        io.emit(userInfo._id, {
                                            type: 'myRequest'
                                        });
                                        io.emit(to, {
                                            type: 'request'
                                        });
                                    }
                                    res.json({
                                        success: true
                                    })
                                }).catch(err => {
                                    res.json({
                                        success: false,
                                        err: err,
                                        user: userUpdated,
                                        code: "Can't save author data"
                                    })
                                })
                            }
                        }).catch(err => {
                            res.json({
                                success: false,
                                on: "user",
                                user: user
                            })
                        })
                    })
                }
            }
        }).catch(err => {
            res.json({
                success: false,
                err: "Kết bạn không thành công. Người dùng không tồn tại"
            })
        })
    }
    else res.json({
        success: false,
        loged: false,
        err: "Bạn chưa đăng nhập"
    })
});
profileRouter.put('/userinfo', (req, res) => {
    var {name, sex, birthday, country, live} = req.body;
    var userInfo = req.session.userInfo;
    if(userInfo){
        userController.update({_id: userInfo._id}, {
            $set: {name, sex, birthday, country, live}
        })
        .select('-password')
        .populate('avatar.origin')
        .populate('cover.origin')
        .then(dataChanged => {
            res.json({
                success: true,
                data: dataChanged
            })
        }).catch(err => {
            res.json({
                success: false,
                err: err
            })
        })
    }
    else res.json({
        success: false,
        loged: false,
        err: "Bạn chưa đăng nhập"
    })
});
profileRouter.get('/relation', (req, res) => {
    if(req.session.userInfo){
        userController.get({_id: req.session.userInfo._id})
        .select('-password')
        .populate('relation.friends.friend', 'relation username')
        .populate('relation.follows', 'relation username')
        .populate('relation.fans', 'relation username')
        .then(user => {
            var data = user.relation;
            res.json({
                success: true,
                data: data
            })
        }).catch(err => {
            res.json({
                success: false,
                err: err
            })
    
        });
    }
    else{
        res.json({
            success: false,
            err: "Bạn chưa đăng nhập!"
        })
    }
});
profileRouter.get('/:id', (req, res) => {
    var _id = req.params.id;
    userController.get({_id: _id})
    .select('-password')
    .populate('avatar.origin')
    .populate('cover.origin')
    .populate('relation.friends.friend', 'username')
    .populate('relation.follows', 'username')
    .populate('relation.fans', 'username')
    .then(user => {
        var data = user;
        res.json({
            success: true,
            data: data
        })
    }).catch(err => {
        res.json({
            success: false,
            err: 'User does not exist!'
        })

    });
});
profileRouter.get("/", (req, res) => {
    if(req.session.userInfo)
        res.redirect(`/api/profile/${req.session.userInfo._id}`);
    else
        res.json({
            success: false,
            err: "Bạn chưa đăng nhập!"
        });
});
module.exports = profileRouter;
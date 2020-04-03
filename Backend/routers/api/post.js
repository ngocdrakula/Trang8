const express = require('express');
const postRouter = express.Router();
const multer = require('multer');
const path = require('path');

const postController = require('../../controllers/post');
const activeController = require('../../controllers/active');
const userController = require('../../controllers/user');



let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "File/photo");
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg", "image/gif"];
    if(math.indexOf(file.mimetype) == -1){
        let errorMess = "This type file is not allowed";
        return callback(errorMess, null);
    }
    let filename = `${req.session.userInfo._id}_${Date.now()}${path.extname(file.originalname)}`;
    callback(null, filename);
    }
});
let uploadFile = multer({storage: diskStorage}).single("file");


postRouter.post("/", (req, res) => {
    var author = req.session.userInfo;
    if(author){
        uploadFile(req, res, (error) => {
            if(error){
                return res.json({
                    success: false,
                    error: error,
                    code: "Không thể upload ảnh"
                });
            }
            const {status, feeling, privacy, to, infoData} = req.body;
            var infoImage;
            if(infoData)
                infoImage = JSON.parse(infoData);
            var member = to;
            if(author._id == to) member = "";
            var image = "";
            if(req.file) image = req.file.filename;
            if((status!="" || feeling>0 || image!="")||(image!="" && infoImage)){
                var imageType = 0;
                if(infoImage){
                    if(infoImage.avatar) imageType = 1;
                    else imageType = 2;
                }
                activeController.create({}).then(activeCreated => {
                    var newStastus = {
                        status, feeling, privacy,
                        author: req.session.userInfo._id,
                        active: activeCreated._id,
                        image: image,
                        imageType: imageType
                    }
                    if(member && member!="") newStastus.to = member;
                    postController.create(newStastus)
                    .then(postCreated => {
                        postCreated.populate('author', 'username').populate('to', 'username')
                        .populate({ 
                            path: 'active',
                            populate: [
                                {
                                    path: 'comment.author',
                                    model: 'user',
                                    select: 'username'
                                },
                                {
                                    path: 'emotion.author',
                                    model: 'user',
                                    select: 'username'
                                },
                                {
                                    path: 'comment.emotion.author',
                                    model: 'user',
                                    select: 'username'
                                }
                            ]
                        }).execPopulate().then(postCreated => {
                            if(infoImage && image != ""){
                                var dataChange = {};
                                var key = "_id";
                                if(infoImage.avatar){
                                    dataChange = {
                                        'avatar.position': infoImage.avatar.position,
                                        'avatar.size': infoImage.avatar.size,
                                        'avatar.origin': postCreated._id
                                    };
                                    key = 'avatar';
                                }
                                else if(infoImage.cover){
                                    dataChange = {
                                        'cover.position': infoImage.cover.position,
                                        'cover.size': infoImage.cover.size,
                                        'cover.origin': postCreated._id
                                    };
                                    key = 'cover';
                                }
                                userController.update({_id: author._id}, {$set: dataChange})
                                .then(result => {
                                    res.json({
                                        success: true,
                                        data: postCreated,
                                        infoImage: result[key]
                                    })
                                }).catch(err => {
                                    res.json({
                                        success: true,
                                        data: postCreated,
                                        infoImage: err
                                    })
                                });
                            }
                            else{
                                res.json({
                                    success: true,
                                    data: postCreated,
                                    infoImage: null
                                })
                            }
                        })
                    }).catch(err => {
                        res.json({
                            success: false,
                            error: err,
                            err: "Đã có lỗi xảy ra. Bạn hãy thử tải lại trang"
                        });
                    })
                }).catch(err => {
                    res.json({
                        success: false,
                        error: err,
                        err: "Đã có lỗi xảy ra. Bạn hãy thử tải lại trang"
                    });
                })
            }
            else if(image == "" && infoImage){
                var dataChange = {};
                var key = "_id"
                if(infoImage.avatar){
                    dataChange = {
                        'avatar.position': infoImage.avatar.position,
                        'avatar.size': infoImage.avatar.size
                    };
                    key = "avatar";
                }
                else if(infoImage.cover){
                    dataChange = {
                        'cover.position': infoImage.cover.position,
                        'cover.size': infoImage.cover.size
                    };
                    key = "cover";
                }
                userController.update({_id: author._id}, {$set: dataChange})
                .populate(`${key}.origin`)
                .then(result => {
                    res.json({
                        success: true,
                        infoImage: {
                            success: true,
                            result: result[key]
                        }
                    });
                }).catch(err => {
                    res.json({
                        success: false,
                        infoImage: {
                            success: false,
                            err: err,
                        },
                        err: "Đã có lỗi xảy ra. Bạn hãy thử tải lại trang"
                    });
                });
            }
            else{
                res.json({
                    success: false,
                    err: "Hãy chia sẻ một điều gì đó"
                });
            }
        });
    }
    else{ 
        res.json({
            success: false,
            err: "Vui lòng đăng nhập và thử lại"
        });
    }
});
postRouter.get("/news", (req, res) => {
    var order = parseInt(req.query.order || 0);
    if(!order) order = 0;
    var last = req.query.time;
    var query = {};
    query = {
        privacy: 3
    }
    if(req.query.id){
        query = {
            $or: [
                {
                    author: req.query.id,
                    privacy: 3
                }, 
                {
                    to: req.query.id,
                    privacy: 3
                }
            ]
        }
    }
    const Promise = async() => {
        if(req.session.userInfo){
            let userinfo = await userController.get({_id: req.session.userInfo._id});
            let relationList = userinfo.relation;
            if(req.query.id == req.session.userInfo._id){
                query.$or = query.$or.map(item => {
                    item.privacy = {$gt: 0};
                    return item
                });
            }
            else if(req.query.id){
                if(relationList.friends.find(f => f.friend == req.query.id && f.friendship == 1)){
                    query.$or = query.$or.map(item => {
                        item.privacy = {$gt: 1};
                        return item
                    });
                }
            }
            else{
                query = {
                    $or: [
                        {author: req.session.userInfo}, 
                        {to: req.session.userInfo},
                        {
                            author: {$in: relationList.friends.map(f => {if(f.friendship == 1) return(f.friend)})},
                            privacy: {$gt: 1}
                        },
                        {
                            author: {$in: relationList.follows},
                            privacy: {$gt: 2}
                        }
                    ]
                }
            }
        }
        let listpost = await postController.getlist(query).sort({createdAt: -1}).limit(order + 5)
        .populate('author', 'username')
        .populate('to', 'username')
        .populate({ 
            path: 'active',
            populate: [
                {
                    path: 'comment.author',
                    model: 'user',
                    select: 'username'
                },
                {
                    path: 'emotion.author',
                    model: 'user',
                    select: 'username'
                },
                {
                    path: 'comment.emotion.author',
                    model: 'user',
                    select: 'username'
                }
            ]
        });
        return(listpost)
    }
    Promise().then(data => {
        var listpost = []
        data.map((post, index) => {
            if(listpost.length >= 4) return;
            if(Date.parse(post.createdAt) > last){
                listpost.push(post);
            }
        });
        data.slice(-5).map((post, index) =>{
            if(index> listpost.length - 1){
                listpost.push(post);
            }
        })
        res.json(listpost);
    }).catch(err => {
        res.json([])
    });
});
postRouter.post("/emotion", (req, res) => {
    var {active_id, comment_id, emotion} = req.body;
    var author = req.session.userInfo;
    if(author && emotion >= 0 && emotion <= 5){
        activeController.get({_id: active_id})
        .then(data => {
            if(comment_id){//EmotionComment
                var cmtIndex = emIndex = -1;
                data.comment.map((comment, i) => {
                    if(comment._id == comment_id){
                        cmtIndex = i;
                        comment.emotion.map((em, j) => {
                            if(em.author == author._id)
                                emIndex = j;
                        })
                    }
                })
                if(cmtIndex > -1){
                    if(emIndex > -1){
                        if(emotion)
                            data.comment[cmtIndex].emotion[emIndex].emotion = emotion;
                        else
                            data.comment[cmtIndex].emotion.splice(emIndex, 1);
                    }
                    else
                        data.comment[cmtIndex].emotion.push({
                            emotion: emotion,
                            author: author._id
                        });
                }
                data.save()
                .then(result => {
                    result.populate('comment.author', 'username')
                    .populate('emotion.author', 'username')
                    .populate('comment.emotion.author', 'username').execPopulate()
                    .then(dataPopulate => {
                        res.json({
                            success: true,
                            data: dataPopulate,
                            cmt: cmtIndex,
                            em: emIndex
                        });
                    }).catch(err => {
                        res.json({
                            success: false,
                            data: result,
                            err: err,
                            cmt: cmtIndex,
                            em: emIndex
                        });
                    })
                }).catch(err => {
                    res.json({
                        success: false,
                        data: data,
                        err: err,
                        cmt: cmtIndex,
                        em: emIndex
                    })
                })
            }
            else{//Emotion
                var emotionId;
                data.emotion.map((emotion) => {
                    if(emotion.author == author._id) emotionId = 1;
                });
                var query = {
                    _id: active_id,
                    'emotion.author': author._id
                }
                var update = {//delete emotion
                    $pull: {
                        emotion: {author: author._id}
                    }
                };
                if(emotionId && emotion){//change emotion
                    query = {
                        _id: active_id,
                        'emotion.author': author._id
                    };
                    update = {
                        $set: {
                            "emotion.$.emotion": emotion
                            }
                    };
                }
                else if(emotion){//push emotion
                    query = {
                        _id: active_id
                    }
                    update = {
                        $push: {
                            emotion: {
                                emotion: emotion,
                                author: author._id
                            }
                        }
                    }
                }
                activeController.updateOne(query, update, {})
                .populate('comment.author', 'username')
                .populate('emotion.author', 'username')
                .populate('comment.emotion.author', 'username')
                .then(result => {
                    res.json({
                        success: true,
                        data: result
                    });
                }).catch(err => {
                    res.json({
                        success: false,
                        err: err
                    });
                });
            }
        }).catch(err => {
            res.json({
                success: false,
                loged: true,
                error: "Can Not Found Post",
                err: err
            })
        });
    }
    else
        res.json({
            success: false,
            loged: false,
            err: 'Thao tác lỗi! Vui lòng thử lại'
        })
});
postRouter.post("/comment", (req, res) => {
    var {_id, comment} = req.body;
    if(req.session.userInfo && comment)
        activeController.get({_id})
        .then(active => {
            var newcomment = {
                comment: comment,
                image: "",
                author: req.session.userInfo._id
            };
            activeController.update({_id}, {$push: {comment: newcomment}})
            .populate('comment.author', 'username')
            .populate('emotion.author', 'username')
            .populate('comment.emotion.author', 'username')
            .then(result => {
                res.json({
                    success: true,
                    data: result
                    });
            }).catch(err => {
                res.json({
                    success: false,
                    loged: true,
                    err: "Can Not Comment"
                });
            });
        }).catch(err => {
            res.json({
                success: false,
                loged: true,
                error: "Can Not Found Post"
            })
        });
    else
        res.json({
            success: false,
            loged: false,
            err: 'Thao tác lỗi! Vui lòng thử lại'
        })
});
postRouter.get("/image/:id", (req, res) => {
    var query = {
        author: req.params.id,
        privacy: 3,
        image: {$ne: ""}
    }
    const Promise = async() => {
        if(req.session.userInfo){
            if(req.params.id == req.session.userInfo._id){
                query.privacy = {$gt: 0};
            }
            else{
                let userinfo = await userController.get({_id: req.session.userInfo._id});
                relationList = userinfo.relation;
                if(relationList.friends.find(f => f.friend == req.params.id && f.friendship == 1)){
                    query.privacy = {$gt: 1};
                }
            }
        }
        console.log(query)
        let listpost = await postController.getlist(query).sort({createdAt: -1});
        return(listpost)
    }
    Promise().then(data => {
        res.json({
            success: true,
            data: data
        });
    }).catch(err => {
        res.json({
            success: false,
            err: err
        });
    });
});
postRouter.get("/:id", (req, res) => {
    var _id = req.params.id;
    postController.get({_id})
    .populate('author', 'username')
    .populate('to', 'username')
    .populate({ 
        path: 'active',
        populate: [
            {
                path: 'comment.author',
                model: 'user',
                select: 'username'
            },
            {
                path: 'emotion.author',
                model: 'user',
                select: 'username'
            },
            {
                path: 'comment.emotion.author',
                model: 'user',
                select: 'username'
            }
        ]
    })
    .then(data => {
        res.json({
            success: true,
            data: data
        });
    }).catch(err => {
        res.json({
            success: false,
            err: err
        });
    })
});

module.exports = postRouter;